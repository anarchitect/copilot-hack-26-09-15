// Renderer for the demo-guides canvas.
//
// Produces a self-contained HTML document. Styling uses the app's canvas theme
// tokens (with fallbacks) so the panel matches light/dark mode automatically.

/** Escape text for interpolation into HTML. */
function esc(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Minimal inline markdown: `code`, **bold**, and [text](url).
 * Input is escaped first, so this only ever adds our own tags.
 */
function inline(value) {
    return esc(value)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function renderStep(step, index, done) {
    const parts = [];

    parts.push(`<li class="step${done ? " done" : ""}" data-step="${esc(step.id)}">`);
    parts.push('<div class="step-head">');
    parts.push(
        `<button class="tick" data-step="${esc(step.id)}" aria-pressed="${done}" title="Mark step ${done ? "not done" : "done"}">${done ? "&#10003;" : index}</button>`,
    );
    parts.push(`<h4>${inline(step.title)}</h4>`);
    parts.push("</div>");
    parts.push('<div class="step-body">');

    if (step.body) parts.push(`<p>${inline(step.body)}</p>`);

    if (step.commands?.length) {
        parts.push('<div class="block cmds">');
        for (const cmd of step.commands) {
            parts.push(`<pre><code>${esc(cmd)}</code></pre>`);
        }
        parts.push("</div>");
    }

    if (step.prompt) {
        parts.push('<div class="block prompt">');
        parts.push('<div class="block-label">Prompt<button class="copy" type="button">Copy</button></div>');
        parts.push(`<pre><code>${esc(step.prompt)}</code></pre>`);
        parts.push("</div>");
    }

    if (step.check) parts.push(`<p class="note check"><span>Check</span> ${inline(step.check)}</p>`);
    if (step.why) parts.push(`<p class="note why"><span>Why</span> ${inline(step.why)}</p>`);

    parts.push("</div></li>");
    return parts.join("");
}

/**
 * @param {object} args
 * @param {import("./guides.mjs").Guide[]} args.guides   All guides (for the tab strip).
 * @param {import("./guides.mjs").Guide} args.guide      The active guide.
 * @param {Record<string, boolean>} args.progress        stepId -> done.
 */
export function renderHtml({ guides, guide, progress }) {
    const total = guide.sections.reduce((n, s) => n + s.steps.length, 0);
    const done = guide.sections.reduce(
        (n, s) => n + s.steps.filter((step) => progress[step.id]).length,
        0,
    );
    const pct = total ? Math.round((done / total) * 100) : 0;

    const tabs = guides
        .map((g) => {
            const gTotal = g.sections.reduce((n, s) => n + s.steps.length, 0);
            const gDone = g.sections.reduce(
                (n, s) => n + s.steps.filter((step) => progress[step.id]).length,
                0,
            );
            const complete = gTotal > 0 && gDone === gTotal;
            return `<button class="tab${g.id === guide.id ? " active" : ""}${complete ? " complete" : ""}" data-guide="${esc(g.id)}">${esc(g.title)}<span class="tab-count">${gDone}/${gTotal}</span></button>`;
        })
        .join("");

    let counter = 0;
    const sections = guide.sections
        .map((section) => {
            const steps = section.steps
                .map((step) => renderStep(step, ++counter, Boolean(progress[step.id])))
                .join("");
            return `<section class="sec">
        <h3>${inline(section.title)}</h3>
        ${section.intro ? `<p class="sec-intro">${inline(section.intro)}</p>` : ""}
        <ol class="steps">${steps}</ol>
      </section>`;
        })
        .join("");

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(guide.title)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0 0 3rem;
    background: var(--background-color-default, #fff);
    color: var(--text-color-default, #1f2328);
    font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
    font-size: var(--text-body-medium, 14px);
    line-height: var(--leading-body-medium, 20px);
  }
  header { position: sticky; top: 0; z-index: 5; padding: 1rem 1.25rem .5rem;
    background: var(--background-color-default, #fff);
    border-bottom: 1px solid var(--border-color-default, #d1d9e0); }
  h1 { margin: 0 0 .25rem; font-size: var(--text-title-large, 22px);
    font-weight: var(--font-weight-semibold, 600); line-height: var(--leading-title-large, 30px); }
  .goal { margin: 0 0 .75rem; color: var(--text-color-muted, #59636e); }
  .meta { display: flex; gap: .75rem; flex-wrap: wrap; align-items: center;
    color: var(--text-color-muted, #59636e); font-size: 12px; margin-bottom: .6rem; }
  .bar { height: 5px; border-radius: 999px; background: var(--border-color-default, #d1d9e0); overflow: hidden; }
  .bar > i { display: block; height: 100%; width: ${pct}%;
    background: var(--true-color-blue, #0969da); transition: width .18s ease; }
  .tabs { display: flex; gap: .35rem; flex-wrap: wrap; padding: .7rem 0 0; }
  .tab { cursor: pointer; border: 1px solid var(--border-color-default, #d1d9e0); border-radius: 6px;
    padding: .3rem .55rem; font-size: 12px; display: inline-flex; gap: .4rem; align-items: center;
    background: transparent; color: var(--text-color-muted, #59636e); font-family: inherit; }
  .tab:hover { border-color: var(--true-color-blue, #0969da); }
  .tab.active { color: var(--text-color-default, #1f2328);
    border-color: var(--true-color-blue, #0969da);
    background: var(--true-color-blue-muted, rgba(9,105,218,.1)); }
  .tab.complete .tab-count { color: var(--true-color-green, #1a7f37); }
  .tab-count { font-variant-numeric: tabular-nums; opacity: .8; }
  main { padding: 1rem 1.25rem 0; }
  .sec { margin: 0 0 1.6rem; }
  .sec h3 { margin: 0 0 .3rem; font-size: 15px; font-weight: var(--font-weight-semibold, 600); }
  .sec-intro { margin: 0 0 .75rem; color: var(--text-color-muted, #59636e); }
  ol.steps { list-style: none; margin: 0; padding: 0; }
  .step { border: 1px solid var(--border-color-default, #d1d9e0); border-radius: 8px;
    padding: .7rem .8rem; margin-bottom: .5rem; }
  .step.done { opacity: .58; }
  .step.done h4 { text-decoration: line-through; }
  .step-head { display: flex; gap: .6rem; align-items: flex-start; }
  .step-head h4 { margin: 0; font-size: 14px; font-weight: var(--font-weight-semibold, 600); }
  .tick { flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
    border: 1px solid var(--border-color-default, #d1d9e0); background: transparent; font-family: inherit;
    color: var(--text-color-muted, #59636e); font-size: 11px; line-height: 1; font-variant-numeric: tabular-nums; }
  .tick:hover { border-color: var(--true-color-blue, #0969da); color: var(--true-color-blue, #0969da); }
  .step.done .tick { background: var(--true-color-green, #1a7f37); color: var(--color-white, #fff);
    border-color: var(--true-color-green, #1a7f37); }
  .step-body { padding-left: calc(22px + .6rem); }
  .step-body p { margin: .45rem 0; }
  code { font-family: var(--font-mono, "SFMono-Regular", Consolas, monospace);
    font-size: var(--text-code-inline, 12px); }
  .step-body > p code, .note code { background: var(--border-color-default, #d1d9e0);
    border-radius: 4px; padding: .1em .35em; }
  .block { margin: .5rem 0; }
  .block-label { display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
    color: var(--text-color-muted, #59636e); margin-bottom: .25rem; }
  .copy { cursor: pointer; font-size: 11px; font-family: inherit; padding: .12rem .4rem;
    border-radius: 4px; border: 1px solid var(--border-color-default, #d1d9e0);
    background: transparent; color: var(--text-color-muted, #59636e); text-transform: none; letter-spacing: 0; }
  .copy:hover { border-color: var(--true-color-blue, #0969da); color: var(--true-color-blue, #0969da); }
  pre { margin: 0 0 .3rem; padding: .5rem .6rem; overflow-x: auto; border-radius: 6px;
    border: 1px solid var(--border-color-default, #d1d9e0);
    background: var(--true-color-blue-muted, rgba(9,105,218,.07)); }
  .cmds pre { background: transparent; }
  .note { font-size: 13px; border-left: 2px solid var(--border-color-default, #d1d9e0); padding-left: .6rem; }
  .note span { font-weight: var(--font-weight-semibold, 600); margin-right: .3rem; }
  .check { border-left-color: var(--true-color-green, #1a7f37); }
  .check span { color: var(--true-color-green, #1a7f37); }
  .why { border-left-color: var(--true-color-purple, #8250df); color: var(--text-color-muted, #59636e); }
  .why span { color: var(--true-color-purple, #8250df); }
  .src { font-size: 12px; color: var(--text-color-muted, #59636e); padding: 0 1.25rem; }
  button:focus-visible, .tick:focus-visible { outline: 2px solid var(--color-focus-outline, #0969da); outline-offset: 1px; }
</style>
</head>
<body>
<header>
  <h1>${esc(guide.title)}</h1>
  <p class="goal">${inline(guide.goal)}</p>
  <div class="meta">
    <span>${esc(guide.estimate)}</span>
    <span>&middot;</span>
    <span id="count">${done}/${total} steps</span>
    <span>&middot;</span>
    <button class="copy" id="reset" type="button">Reset this guide</button>
  </div>
  <div class="bar"><i></i></div>
  <div class="tabs">${tabs}</div>
</header>
<main>
  ${sections}
  <p class="src">Source: <code>${esc(guide.source)}</code></p>
</main>
<script>
  const guideId = ${JSON.stringify(guide.id)};

  async function post(path, payload) {
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  document.addEventListener("click", async (event) => {
    const tick = event.target.closest(".tick");
    if (tick) {
      const li = tick.closest(".step");
      const nowDone = !li.classList.contains("done");
      li.classList.toggle("done", nowDone);
      tick.setAttribute("aria-pressed", String(nowDone));
      await post("/toggle", { stepId: tick.dataset.step, done: nowDone });
      return;
    }

    const tab = event.target.closest(".tab");
    if (tab) {
      location.search = "?guide=" + encodeURIComponent(tab.dataset.guide);
      return;
    }

    const copy = event.target.closest(".copy");
    if (copy && copy.id !== "reset") {
      const pre = copy.closest(".block")?.querySelector("code");
      if (pre) {
        await navigator.clipboard.writeText(pre.textContent);
        const prev = copy.textContent;
        copy.textContent = "Copied";
        setTimeout(() => { copy.textContent = prev; }, 1200);
      }
      return;
    }

    if (event.target.id === "reset") {
      await post("/reset", { guideId });
      location.reload();
    }
  });

  // Re-render when progress changes from elsewhere (e.g. an agent action).
  new EventSource("/events").addEventListener("progress", () => location.reload());
</script>
</body>
</html>`;
}
