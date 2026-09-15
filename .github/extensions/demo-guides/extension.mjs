// Extension: demo-guides
// Step-by-step walkthroughs for the recommended demo challenges.
//
// Content lives in guides.mjs, HTML in renderer.mjs. This file is wiring:
// one loopback server per canvas instance, durable progress storage, and the
// agent-callable actions.

import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { joinSession, createCanvas, CanvasError } from "@github/copilot-sdk/extension";
import { GUIDES, getGuide, stepIds } from "./guides.mjs";
import { renderHtml } from "./renderer.mjs";

// Progress is per-user, not per-repo and not per-session: someone working
// through the demos may pick them up in a different session tomorrow, and this
// is personal state that should not be committed. Keyed by stepId, which is
// stable across instanceIds - see the canvas skill's state model.
const COPILOT_HOME = process.env.COPILOT_HOME || path.join(homedir(), ".copilot");
const PROGRESS_FILE = path.join(COPILOT_HOME, "extensions", "demo-guides", "artifacts", "progress.json");

const DEFAULT_GUIDE = GUIDES[0].id;

/** instanceId -> { server, url, guideId, clients:Set<ServerResponse> } */
const instances = new Map();

async function loadProgress() {
    try {
        const raw = await readFile(PROGRESS_FILE, "utf8");
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        // Missing or corrupt file is not an error - start from empty.
        return {};
    }
}

async function saveProgress(progress) {
    await mkdir(path.dirname(PROGRESS_FILE), { recursive: true });
    await writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf8");
}

/** Tell every open iframe to re-read its state. */
function broadcast() {
    for (const entry of instances.values()) {
        for (const client of entry.clients) {
            client.write("event: progress\ndata: {}\n\n");
        }
    }
}

function readJsonBody(req) {
    return new Promise((resolve) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 1e6) req.destroy();
        });
        req.on("end", () => {
            try {
                resolve(JSON.parse(raw || "{}"));
            } catch {
                resolve({});
            }
        });
        req.on("error", () => resolve({}));
    });
}

async function handleRequest(entry, req, res) {
    const url = new URL(req.url, "http://127.0.0.1");

    if (url.pathname === "/events") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });
        res.write(": connected\n\n");
        entry.clients.add(res);
        req.on("close", () => entry.clients.delete(res));
        return;
    }

    if (req.method === "POST" && url.pathname === "/toggle") {
        const { stepId, done } = await readJsonBody(req);
        const progress = await loadProgress();
        if (done) progress[stepId] = true;
        else delete progress[stepId];
        await saveProgress(progress);
        res.writeHead(204).end();
        return;
    }

    if (req.method === "POST" && url.pathname === "/reset") {
        const { guideId } = await readJsonBody(req);
        const guide = getGuide(guideId);
        if (guide) {
            const progress = await loadProgress();
            for (const id of stepIds(guide)) delete progress[id];
            await saveProgress(progress);
        }
        res.writeHead(204).end();
        broadcast();
        return;
    }

    // Anything else renders the page. `?guide=` switches guides in place so the
    // tab strip doesn't need a separate canvas instance per guide.
    const requested = url.searchParams.get("guide");
    if (requested && getGuide(requested)) entry.guideId = requested;
    const guide = getGuide(entry.guideId) ?? getGuide(DEFAULT_GUIDE);

    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
    });
    res.end(renderHtml({ guides: GUIDES, guide, progress: await loadProgress() }));
}

async function startServer(guideId) {
    const entry = { guideId, clients: new Set() };
    entry.server = createServer((req, res) => {
        handleRequest(entry, req, res).catch(() => {
            if (!res.headersSent) res.writeHead(500);
            res.end();
        });
    });
    await new Promise((resolve) => entry.server.listen(0, "127.0.0.1", resolve));
    const address = entry.server.address();
    entry.url = `http://127.0.0.1:${address.port}/`;
    return entry;
}

function summarize(guide, progress) {
    const ids = stepIds(guide);
    const done = ids.filter((id) => progress[id]);
    return {
        guideId: guide.id,
        title: guide.title,
        total: ids.length,
        completed: done.length,
        remaining: ids.filter((id) => !progress[id]),
    };
}

await joinSession({
    canvases: [
        createCanvas({
            id: "demo-guides",
            displayName: "Demo guides",
            description:
                "Step-by-step walkthroughs for the four recommended demo challenges (Features, Engineering Practices, Customize Copilot, Cloud Agent) with per-step progress tracking.",
            inputSchema: {
                type: "object",
                properties: {
                    guideId: {
                        type: "string",
                        enum: GUIDES.map((g) => g.id),
                        description: "Which guide to show first.",
                    },
                },
                additionalProperties: false,
            },
            actions: [
                {
                    name: "show_guide",
                    description: "Switch the open canvas to a different guide.",
                    inputSchema: {
                        type: "object",
                        properties: { guideId: { type: "string", enum: GUIDES.map((g) => g.id) } },
                        required: ["guideId"],
                        additionalProperties: false,
                    },
                    handler: async (ctx) => {
                        const entry = instances.get(ctx.instanceId);
                        if (!entry) throw new CanvasError("instance_not_found", `No open canvas ${ctx.instanceId}`);
                        const guide = getGuide(ctx.input.guideId);
                        if (!guide) throw new CanvasError("unknown_guide", `No guide ${ctx.input.guideId}`);
                        entry.guideId = guide.id;
                        broadcast();
                        return summarize(guide, await loadProgress());
                    },
                },
                {
                    name: "mark_step",
                    description: "Mark a step complete or incomplete by step id.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            stepId: { type: "string" },
                            done: { type: "boolean", default: true },
                        },
                        required: ["stepId"],
                        additionalProperties: false,
                    },
                    handler: async (ctx) => {
                        const { stepId, done = true } = ctx.input;
                        const known = GUIDES.some((g) => stepIds(g).includes(stepId));
                        if (!known) throw new CanvasError("unknown_step", `No step ${stepId}`);
                        const progress = await loadProgress();
                        if (done) progress[stepId] = true;
                        else delete progress[stepId];
                        await saveProgress(progress);
                        broadcast();
                        return { stepId, done };
                    },
                },
                {
                    name: "get_progress",
                    description: "Report completion for every guide.",
                    handler: async () => {
                        const progress = await loadProgress();
                        return { guides: GUIDES.map((g) => summarize(g, progress)) };
                    },
                },
            ],
            open: async (ctx) => {
                const requested = ctx.input?.guideId;
                const guideId = getGuide(requested) ? requested : DEFAULT_GUIDE;

                // Idempotent: a re-open (focus, reload, or provider reconnect)
                // reuses the running server for this instance.
                let entry = instances.get(ctx.instanceId);
                if (!entry) {
                    entry = await startServer(guideId);
                    instances.set(ctx.instanceId, entry);
                } else if (requested && getGuide(requested)) {
                    entry.guideId = requested;
                }

                const guide = getGuide(entry.guideId);
                const { completed, total } = summarize(guide, await loadProgress());
                return {
                    title: `Demo guides - ${guide.title}`,
                    status: `${completed}/${total} steps`,
                    url: entry.url,
                };
            },
            onClose: async (ctx) => {
                const entry = instances.get(ctx.instanceId);
                if (!entry) return;
                instances.delete(ctx.instanceId);
                for (const client of entry.clients) client.end();
                await new Promise((resolve) => entry.server.close(() => resolve()));
            },
        }),
    ],
});
