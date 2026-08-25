// Step-by-step guidance for the four "Option 2" demo challenges.
//
// Each guide maps to a file in /demos. Steps are intentionally concrete:
// the exact file, the exact line region, the exact prompt, and a check that
// tells you whether the step actually worked.

/**
 * @typedef {Object} Step
 * @property {string} id      Stable id, used as the progress key.
 * @property {string} title   Short imperative summary.
 * @property {string} [body]  Markdown-ish detail (subset: **bold**, `code`, links).
 * @property {string[]} [commands] Literal commands to run in a terminal.
 * @property {string} [prompt] A prompt to paste into Copilot Chat.
 * @property {string} [check]  How to verify the step worked.
 * @property {string} [why]    Why the step matters (the teaching point).
 */

/**
 * @typedef {Object} Guide
 * @property {string} id
 * @property {string} title
 * @property {string} source     Repo-relative path to the source demo doc.
 * @property {string} estimate
 * @property {string} goal
 * @property {{id: string, title: string, intro?: string, steps: Step[]}[]} sections
 */

/** @type {Guide[]} */
export const GUIDES = [
    {
        id: "features",
        title: "Features Demo",
        source: "demos/features-demo-option-2.md",
        estimate: "20-30 min",
        goal:
            "Use Copilot Chat (Plan mode, Agent mode, model picker) to add three modal UX behaviours to GalleryGrid.tsx, then review the diff with Copilot's AI review.",
        sections: [
            {
                id: "features-setup",
                title: "Setup",
                intro: "Get the app running first so you can verify behaviour after every change, not at the end.",
                steps: [
                    {
                        id: "features-setup-install",
                        title: "Start the dev server",
                        commands: ["npm ci", "npm run dev"],
                        body:
                            "Install the lockfile-pinned dependencies with `npm ci`, then start the Turbopack development server with `npm run dev`.",
                        check: "http://localhost:3000 loads the Photo Gallery home page.",
                        why: "Challenge One is a behaviour change. Without a running app you cannot tell a real fix from a plausible-looking diff.",
                    },
                    {
                        id: "features-setup-baseline",
                        title: "Reproduce the current (broken) behaviour",
                        body:
                            "Go to **/gallery**. Run the baseline once in **Grid view** and once in **List view**: click **View Details** on a photo, then try each of the three things the challenge asks for.",
                        check:
                            "In both layouts, Escape does nothing, clicking the dark backdrop does nothing, and the page behind the modal still scrolls. Search, Filters, and the Grid/List toggle work before you edit anything.",
                        why: "Establishing the baseline first is what makes the Definition of Done checkable.",
                    },
                    {
                        id: "features-setup-orient",
                        title: "Find the modal in the code",
                        body:
                            "Open `src/components/gallery/GalleryGrid.tsx`. Three landmarks matter: the existing `'use client'` directive, the `selectedPhoto` and `likedPhotos` state declarations, and the `Photo Detail Modal` placeholder with the `{selectedPhoto && (` render block below it. The backdrop is the outer `fixed inset-0 bg-black/80` div; the modal content is its inner `bg-white dark:bg-slate-800` div.",
                        check: "You can point at the line that opens the modal, the backdrop div, and the content div.",
                        why: "Option 2 is a chat-driven challenge, but a prompt that names the real state variable gets a much tighter diff than one that describes the feature vaguely.",
                    },
                ],
            },
            {
                id: "features-plan",
                title: "Challenge One - Plan mode",
                intro:
                    "The point of Option 2 is to feel the difference between planning and executing. Do the plan pass first, even though the task is small.",
                steps: [
                    {
                        id: "features-plan-mode",
                        title: "Switch Copilot Chat to Plan mode",
                        body:
                            "In the Copilot Chat panel, use the mode dropdown at the bottom of the input box and pick **Plan**. Plan mode reads the code and proposes an approach without editing files.",
                        why: "Plan mode is the mode most people skip. It is the cheapest place to catch a wrong approach.",
                    },
                    {
                        id: "features-plan-model",
                        title: "Set the model picker to Auto",
                        body:
                            "Next to the mode dropdown, open the model picker and choose **Auto**. Auto selection routes the request to a model suited to the task. If you would rather explore, pick a model you have not used before - that is also a goal of this demo.",
                        why: "Model choice is part of the feature surface being demoed, not an afterthought.",
                    },
                    {
                        id: "features-plan-prompt",
                        title: "Ask for a plan with the file already attached",
                        body:
                            "Attach `src/components/gallery/GalleryGrid.tsx` to the chat (drag it in, or use the paperclip / `#file` reference) **before** sending. Then send the prompt below.",
                        prompt:
                            "In GalleryGrid.tsx, improve the photo detail modal UX:\n1) close on Escape,\n2) close on backdrop click,\n3) disable page scroll while modal is open.\nPlease keep the current UI and content unchanged.",
                        check:
                            "The plan names `selectedPhoto`, mentions a `useEffect` with a `keydown` listener plus its cleanup, mentions stopping click propagation on the modal content, and mentions restoring `document.body.style.overflow`.",
                        why: "If the plan misses the cleanup or the propagation stop, the implementation will have a listener leak or a modal that closes when you click inside it. Catch that here.",
                    },
                    {
                        id: "features-plan-refine",
                        title: "Push back on the plan if it drifts",
                        body:
                            "If the plan proposes restyling the modal, extracting a new component, or adding a library, reply in the same chat: *\"Keep it to the three behaviours only - no styling, no new components, no dependencies.\"*",
                        check: "The revised plan touches only GalleryGrid.tsx.",
                        why: "Scope control in the plan is far cheaper than reviewing an over-eager diff later.",
                    },
                ],
            },
            {
                id: "features-agent",
                title: "Challenge One - Agent mode",
                intro: "Now execute the approved plan.",
                steps: [
                    {
                        id: "features-agent-mode",
                        title: "Switch to Agent mode and hand over the plan",
                        body:
                            "Change the mode dropdown to **Agent**. Agent mode can read, edit and create files and run commands. Paste the approved plan, or say *\"Implement the plan above.\"* if you stayed in the same chat.",
                        why: "Agent mode is the executing mode. Separating it from Plan mode is the habit the demo is teaching.",
                    },
                    {
                        id: "features-agent-review-diff",
                        title: "Read the diff before you accept it",
                        body:
                            "Check three things in the proposed edit: the `useEffect` returns a cleanup that removes the `keydown` listener; the inner modal container calls `e.stopPropagation()` on click while the outer backdrop closes; and `document.body.style.overflow` is restored in the same cleanup.",
                        check: "All three are present. If any is missing, ask for it specifically rather than re-running the whole prompt.",
                        why: "These are exactly the three bugs a fast implementation introduces - and all three are invisible until you test.",
                    },
                    {
                        id: "features-agent-verify",
                        title: "Verify against the Definition of Done",
                        body:
                            "Back in the browser at **/gallery**, test both Grid and List layouts. In each layout, open **View Details** and test all three behaviours, in this order: press Escape, reopen and click the backdrop, reopen and try to scroll the page behind the modal. Then recheck Search, Filters, and the view toggle.",
                        check:
                            "Both layouts open the same corrected modal. Escape closes it. Backdrop click closes it. Clicking inside the modal does NOT close it. The page cannot scroll while open, scrolling works again after closing, and the surrounding Gallery controls still work.",
                        why: "The 'click inside does not close' case and the 'scroll works again afterwards' case are the two the checklist implies but does not spell out.",
                    },
                ],
            },
            {
                id: "features-review",
                title: "Challenge Two - Review your work",
                steps: [
                    {
                        id: "features-review-inline",
                        title: "Option 1 - inline review on a selection",
                        body:
                            "Select the code Copilot generated in `GalleryGrid.tsx`, right-click, and choose **Copilot > Review**. Accept or discard each suggestion.",
                        check: "Review comments appear inline against the selected lines.",
                    },
                    {
                        id: "features-review-scm",
                        title: "Option 2 - review the whole unstaged change",
                        body:
                            "Open the **Source Control** view in the Activity Bar, hover the **CHANGES** header, and click **Code Review - Unstaged Changes**. Findings appear inline in the file and in the **Problems** tab.",
                        check: "Either you get review comments to triage, or a clean result - both are valid outcomes to report back.",
                        why: "Reviewing the change set rather than a selection catches things the selection-scoped review cannot see, like a missing cleanup.",
                    },
                    {
                        id: "features-review-commit",
                        title: "Commit the verified change",
                        commands: ["git add src/components/gallery/GalleryGrid.tsx", "git commit -m \"Improve photo detail modal UX\""],
                        check: "`git log -1` shows your commit and `git status` is clean for that file.",
                    },
                ],
            },
        ],
    },

    {
        id: "engineering",
        title: "Engineering Practices Demo",
        source: "demos/engineering-practices-option-2.md",
        estimate: "30-40 min (+15 min bonus)",
        goal:
            "Run the same small task four ways - two bad-habit runs and two recommended runs - and compare turns, credits and diff size. The task itself is a side effect; the comparison is the point.",
        sections: [
            {
                id: "eng-credits",
                title: "Challenge One - Locate credit usage",
                steps: [
                    {
                        id: "eng-credits-find",
                        title: "Find the model and credit readout",
                        body:
                            "Open Copilot Chat and hover over any existing response. The **model used** and **credits used** appear at the bottom-right of that response.",
                        check: "You can read both values off a response without guessing.",
                        why: "Every later comparison in this demo depends on you being able to read this number. Confirm it before you generate data you cannot measure.",
                    },
                    {
                        id: "eng-credits-record",
                        title: "Set up a scorecard before you start",
                        body:
                            "Write down four rows - Bad 1, Bad 2, Recommended 1, Recommended 2 - with columns for **turns**, **credits**, **files changed** and **worked?**. Fill each row as you go.",
                        why: "Recording after the fact turns Challenge Three into a memory test. The scorecard is what makes the conclusion defensible.",
                    },
                ],
            },
            {
                id: "eng-task",
                title: "Understand the task once",
                steps: [
                    {
                        id: "eng-task-scope",
                        title: "Know where the tags field actually lives",
                        body:
                            "The **Tags (comma-separated)** input is rendered in `src/app/upload/page.tsx`, and the tag list is `AVAILABLE_TAGS` in `src/lib/mock-tag-data.ts`. Two facts decide this task: (1) the input is **uncontrolled** - it has `type`, `placeholder` and `className` but no `value` and no `onChange`, so there is no existing state to hook into; (2) `upload/page.tsx` has **no `'use client'` directive**, so it is a Server Component and cannot hold `useState` as written. `AVAILABLE_TAGS` contains both `wedding` and `wildlife`, which is why typing `w` is the validation case.",
                        why:
                            "This is why the recommended prompt says \"create a new file in the components/upload folder\" - autocomplete needs a client component, so the real fix is extraction, not an edit in place. The focused packet uses `upload/page.tsx` and `mock-tag-data.ts`; `UploadZone.tsx` contains no tags code.",
                    },
                    {
                        id: "eng-task-validation",
                        title: "Fix the validation steps you'll use for all four runs",
                        body:
                            "Open the app, go to **Upload**, scroll to **Tags (comma-separated)**, type `w`, and expect a dropdown offering `wedding` and `wildlife`. Same check every run.",
                        check: "You can run this check in under 15 seconds. You'll do it four times.",
                        why: "A fixed validation step is the only way the four runs are comparable.",
                    },
                    {
                        id: "eng-task-branch",
                        title: "Reset between runs",
                        commands: [
                            "git status --short",
                            "git restore --source=HEAD --staged --worktree -- src/",
                            "git clean -fd -- src/",
                        ],
                        body:
                            "After each run, record the result, then restore tracked files and remove generated files under `src/` only. Do not use a repo-wide restore, stash, or clean; that could remove unrelated workshop work.",
                        check: "`git status --short` shows no changes under `src/` before each new run.",
                        why: "Run 3 will look artificially good if it inherits half a working implementation from run 2.",
                    },
                ],
            },
            {
                id: "eng-bad",
                title: "Challenge Two - the two bad habits",
                intro: "Run these deliberately badly. The failure modes are the lesson.",
                steps: [
                    {
                        id: "eng-bad1",
                        title: "Bad habit 1 - vague prompt in a stale chat",
                        body:
                            "Stay in an existing chat about an unrelated topic. Attach **nothing**. Send the vague prompt.",
                        prompt: "Can you make the upload tags field smarter with autocomplete?",
                        check:
                            "Record turns, credits, files changed, and whether typing `w` actually works. Watch for the tells: clarifying questions, the agent searching the repo to find the field, edits to a file you did not intend.",
                        why: "This is the baseline failure mode - the agent spends its budget discovering context you already had.",
                    },
                    {
                        id: "eng-bad2",
                        title: "Bad habit 2 - context dump in the same chat",
                        body:
                            "Stay in the **same** chat. Attach the target file plus loosely related extras: `src/app/upload/page.tsx`, `src/app/gallery/page.tsx`, `src/components/gallery/GalleryGrid.tsx`, and `demos/features-demo.md`. Keep the requirements broad.",
                        prompt:
                            "Improve the upload tag autocomplete behavior.\n\nRequirements:\n- Show suggestions as users type in tags.\n- Include matching tags like wedding and wildlife for \"w\".\n- Keep the page working.\n\nUse the attached files for context.",
                        check:
                            "Record the same four numbers. Expect credits to go **up** versus run 1 while the result gets no better - and watch for edits leaking into gallery files that have nothing to do with the task.",
                        why: "More context is not better context. This run is the proof.",
                    },
                ],
            },
            {
                id: "eng-good",
                title: "Challenge Two - the two recommended practices",
                steps: [
                    {
                        id: "eng-good1",
                        title: "Recommended 1 - new chat, minimal context, explicit example",
                        body:
                            "Start a **new chat** (new topic, new chat). Attach only `src/app/upload/page.tsx` and `src/lib/mock-tag-data.ts`. Then send the prompt.",
                        prompt:
                            "Implement tag autocomplete for the Upload page tags input. For example, typing \"w\" should suggest \"wedding\" and \"wildlife\". Create a new file in the components/upload folder for the autocomplete input if needed.",
                        check:
                            "Record the four numbers, then run the `w` validation. Expect fewer turns, fewer credits, and a diff confined to the upload feature.",
                        why:
                            "Two files, one concrete example, one explicit escape hatch for where new code should go. That is 'minimal sufficient context'.",
                    },
                    {
                        id: "eng-good2-research",
                        title: "Recommended 2, phase 1 - research in its own chat",
                        body: "Fresh chat. Ask for a map, not a change.",
                        prompt:
                            "Map where tag data and tag input behavior are implemented for Upload. Tell me which component owns the tags field, where the tag list comes from, and how the input state is managed. Reference specific files and lines. Do not change any code.",
                        check:
                            "You get a short summary with file references you can spot-check yourself. Grade it against what you already confirmed: the field is in `src/app/upload/page.tsx` (not `UploadZone.tsx`), it is an uncontrolled input with no state, the page is a Server Component, and the tags come from `AVAILABLE_TAGS` in `src/lib/mock-tag-data.ts`. A research pass that misses the Server Component constraint has not finished the job.",
                        why: "Research output is reusable input for the next two phases. Mixing it with implementation is what makes long chats degrade.",
                    },
                    {
                        id: "eng-good2-plan",
                        title: "Recommended 2, phase 2 - plan in a fresh chat",
                        body: "New chat. Paste the research summary, switch to **Plan mode**, and ask for a minimal plan.",
                        prompt:
                            "Create a minimal plan to add tag autocomplete to the Upload page tags input, without changing styling. Include explicit file scope, edge cases (empty input, no match, trailing comma, duplicate tag), and a validation checklist.",
                        check: "The plan lists specific files and a checklist you can tick off.",
                    },
                    {
                        id: "eng-good2-implement",
                        title: "Recommended 2, phase 3 - implement in a fresh chat",
                        body: "New chat again. Paste the approved plan only - not the research transcript. Switch to **Agent mode**.",
                        prompt: "Implement the approved plan below with the validation checklist. Do not change styling or unrelated files.",
                        check: "Record the four numbers and run the `w` validation one last time.",
                        why:
                            "Three short chats usually beat one long one on both credits and diff quality, because none of them carries the others' noise.",
                    },
                ],
            },
            {
                id: "eng-compare",
                title: "Challenge Three - compare and reflect",
                steps: [
                    {
                        id: "eng-compare-table",
                        title: "Fill in the scorecard and answer the four questions",
                        body:
                            "Which run was most predictable? Which took fewest turns? Which used fewest credits? Which produced the smallest correct diff?",
                        check:
                            "You can point at a number for each answer. If two runs tie on credits, break the tie on diff size - a smaller correct diff is cheaper to review and safer to roll back.",
                    },
                    {
                        id: "eng-compare-takeaway",
                        title: "State the four keepers out loud",
                        body:
                            "New topic -> new chat. New phase -> new chat. Select files by scope, not convenience. Prefer minimal sufficient context over vague or overloaded context.",
                        why: "Naming the habit right after seeing the evidence is what makes it stick.",
                    },
                ],
            },
            {
                id: "eng-bonus",
                title: "Bonus Challenge - enforce the upload size limit",
                intro:
                    "Apply the same minimal-context method to the real mismatch between the 10 MB UI promise and the upload behavior.",
                steps: [
                    {
                        id: "eng-bonus-reproduce",
                        title: "Reproduce the oversized upload",
                        body:
                            "Run the app, open **/upload**, and drop an image larger than 10 MB into the upload zone.",
                        check:
                            "The oversized image is accepted, listed with its real size, and completes without a rejection message. Record that baseline before editing.",
                    },
                    {
                        id: "eng-bonus-scope",
                        title: "Attach only UploadZone",
                        body:
                            "Start a fresh chat and attach only `src/components/upload/UploadZone.tsx`. The size promise and dropzone configuration are both in that file.",
                        why: "This is the minimal sufficient context packet for the defect.",
                    },
                    {
                        id: "eng-bonus-implement",
                        title: "Implement the bounded fix",
                        prompt:
                            "The Upload page says it supports files up to 10MB each, but oversized files are still accepted. I dropped in a file over 10MB and it was added to the list with no error.\n\nEnforce the 10MB limit and show the user a clear reason when a file is rejected. Do not change the existing layout or styling.",
                        check:
                            "The diff is confined to upload behavior and uses react-dropzone's rejection path rather than silently filtering files.",
                    },
                    {
                        id: "eng-bonus-verify",
                        title: "Retest both sides of the limit",
                        body:
                            "Drop one image larger than 10 MB and one below 10 MB, then compare the result with the recorded baseline.",
                        check:
                            "The large image is rejected with a visible reason, the small image uploads normally, and the layout is unchanged.",
                    },
                ],
            },
        ],
    },

    {
        id: "customize",
        title: "Customize Copilot Demo",
        source: "demos/customize-copilot-option-2.md",
        estimate: "35-50 min",
        goal:
            "Prove that instructions, agents, skills and hooks each change output in a measurable way - by running the same prompt with and without each customization.",
        sections: [
            {
                id: "cust-instructions",
                title: "Challenge 1 - Instructions",
                intro: "An A/B test. The only variable is whether the repo instructions file exists.",
                steps: [
                    {
                        id: "cust-inst-before",
                        title: "Run A - disable the repo instructions",
                        commands: [
                            "git mv .github/copilot-instructions.md .github/copilot-instructions.md.bak",
                            "git mv .github/instructions/react-tsx.instructions.md .github/instructions/react-tsx.instructions.md.bak",
                        ],
                        body:
                            "Rename both the repository-wide and TSX-specific instruction files so neither influences run A. Then start a **fresh chat** and send the hardening prompt.",
                        prompt:
                            "Propose a hardening plan for UploadZone.\nReturn exactly these sections:\n1) Constraints from instructions\n2) Proposed edits\n3) Regression risks\n4) Validation checklist",
                        check:
                            "Record token/credit usage and which files it opened. Expect section 1 to be thin or invented, since there are no instructions to draw constraints from.",
                        why: "Section 1 is the tell. With no instructions file there is nothing real to put there.",
                    },
                    {
                        id: "cust-inst-after",
                        title: "Run B - restore the instructions and repeat",
                        commands: [
                            "git mv .github/copilot-instructions.md.bak .github/copilot-instructions.md",
                            "git mv .github/instructions/react-tsx.instructions.md.bak .github/instructions/react-tsx.instructions.md",
                        ],
                        body: "Start another **fresh chat** - not a follow-up - and send the identical prompt.",
                        check:
                            "Compare three things against run A: token usage, which files were reviewed, and whether the proposed edits follow repo conventions (SectionContainer / SectionTitle layout components, Tailwind dark-mode pairs, explicit TypeScript prop interfaces).",
                        why:
                            "A fresh chat matters. Re-asking in the same chat leaks run A's answer into run B and destroys the comparison.",
                    },
                    {
                        id: "cust-inst-restore",
                        title: "Confirm the instructions file is back",
                        commands: ["git status", "ls .github/copilot-instructions.md"],
                        check: "The file exists at its original path and no `.bak` file is left behind.",
                        why: "Leaving the repo instructions renamed silently degrades every later challenge in this demo.",
                    },
                ],
            },
            {
                id: "cust-agents",
                title: "Challenge 2 - Agents",
                steps: [
                    {
                        id: "cust-agent-read",
                        title: "Read Blueprint Mode before you run it",
                        body:
                            "Open `.github/agents/blueprint-mode.agent.md` and skim the output structure it enforces. The `.agent.md` suffix is what registers it as an agent. Knowing the template is what lets you judge whether the agent actually followed it.",
                        check: "You can name the sections Blueprint Mode is supposed to produce before you run it.",
                    },
                    {
                        id: "cust-agent-run",
                        title: "Run the design prompt in Blueprint Mode",
                        body: "Select **Blueprint Mode** from the agent picker in Copilot Chat, then send the prompt.",
                        prompt:
                            "Design a resilient \"bulk photo operations\" flow for admin:\n- multi-select in gallery grid\n- bulk tag assignment/removal\n- bulk download metadata export\n- rollback strategy for failed operations\nInclude architecture decisions, guardrails, and a test matrix.",
                        check: "The response follows Blueprint Mode's structure and actually contains a test matrix and a rollback strategy.",
                    },
                    {
                        id: "cust-agent-baseline",
                        title: "Run the identical prompt in default Agent mode",
                        body: "Switch the picker back to the default agent, start a **fresh chat**, and send the same prompt unchanged.",
                        check:
                            "Compare on three axes: are the implementation details feasible and specific; is the output organised into clear sections; and which run leaves more unstated assumptions (especially around partial failure and rollback).",
                        why: "The rollback strategy is the discriminator - it is the part a generic agent most often hand-waves.",
                    },
                ],
            },
            {
                id: "cust-skills",
                title: "Challenge 3 - Skills",
                steps: [
                    {
                        id: "cust-skill-read",
                        title: "Read the skill definition",
                        body:
                            "Open `.github/skills/javascript-typescript-jest/SKILL.md` and check its guidance fits this repo's conventions before you invoke it.",
                        why: "A skill injects opinionated instructions. Reading it first is how you tell skill-driven output from generic output.",
                    },
                    {
                        id: "cust-skill-run",
                        title: "Invoke the skill with the test-suite prompt",
                        prompt:
                            "/javascript-typescript-jest Design and generate a test suite for UploadZone behavior.\nRequirements:\n- include tests for drag-drop states, file-type validation, and preview rendering\n- include one accessibility-focused test (keyboard and aria behavior)\n- include setup notes for jest config if missing\n- output a test plan first, then test file scaffolding",
                        check:
                            "You get a **plan first**, then scaffolding - in that order. If it jumps straight to code, the skill's workflow was not applied.",
                        why: "Ordering is the observable signal that a skill ran, rather than the model simply writing tests.",
                    },
                    {
                        id: "cust-skill-followup",
                        title: "Run the follow-up to test skill persistence",
                        body: "Stay in the same chat so you can see whether the skill's conventions carry across turns.",
                        prompt:
                            "/javascript-typescript-jest Now expand the suite with edge-case tests:\n- duplicate upload attempts\n- very large file rejection behavior\n- unsupported MIME type handling\nThen provide a \"test maintenance checklist\" for future UI changes.",
                        check:
                            "The new tests match the mocking style and structure of the first batch, and you get the maintenance checklist. Consistency across both turns is what 'reusable skill execution' means.",
                    },
                    {
                        id: "cust-skill-verify",
                        title: "Confirm the Jest setup gap is real",
                        commands: ["node -e \"const p=require('./package.json');console.log(Object.keys({...p.dependencies,...p.devDependencies}).filter(d=>d.includes('jest')))\""],
                        body:
                            "This prints an empty array: **Jest is not installed in this repo and there is no `test` script** in `package.json`. Do not run `npx jest` - with no local install, npx would try to fetch Jest from the registry, which is a slow detour that tests npm, not the skill.",
                        check:
                            "The command prints `[]`. That makes the skill's \"setup notes for jest config if missing\" requirement the load-bearing part of its output - check whether it actually told you to add `jest`, `ts-jest`/`babel-jest`, `@testing-library/react` and a `test` script.",
                        why:
                            "The most useful thing this challenge can show is whether the skill noticed the missing harness, rather than confidently emitting tests that could never run.",
                    },
                ],
            },
            {
                id: "cust-hooks",
                title: "Challenge 4 - Hooks",
                steps: [
                    {
                        id: "cust-hook-read",
                        title: "Review the hook and its requirements",
                        body:
                            "Open `.github/hooks/fix-broken-links/` and read `README.md` and `hooks.json`. Check the prerequisites before running - the script needs network access to resolve links.",
                    },
                    {
                        id: "cust-hook-run",
                        title: "Run the link checker on the demo doc",
                        body:
                            "You are on Windows, so use the PowerShell script (PowerShell 7+). The `chmod +x` step and the `.sh` variant in the demo doc apply to macOS/Linux shells only - on Windows there is nothing to make executable.",
                        commands: [
                            "pwsh -File .github/hooks/fix-broken-links/link-fix.ps1 ./demos/customize-copilot-option-2.md",
                        ],
                        check:
                            "Verified output: it reports `Checking 9 link(s)`, flags `BROKEN (404) https://github.com/github/awesome-copilot/this-page-does-not-exist-404`, and adds an SEO note about the non-descriptive anchor text `read more`. A transient `ERR` for another URL is a connectivity failure; retry it before calling that link broken.",
                        why:
                            "That 404 anchor is planted in the doc specifically so the hook has something to find. The SEO note is a second, separate finding - the hook flags weak anchor text even on links that resolve.",
                    },
                    {
                        id: "cust-hook-interactive",
                        title: "Know what the interactive prompt will do before you answer it",
                        body:
                            "Passing a file path puts the script in fix mode, not report mode. In a real terminal it will offer `r` replace / `d` remove link, keep text / `c` custom URL / `s` skip. Two things to expect: building the `r` suggestions shells out to the `copilot` CLI with a **60 second timeout per broken link**, so it can sit there looking hung; and `r`, `d` or `c` **rewrite the markdown file in place**. Only `s` leaves the file untouched. (Piping the script's output, as in a non-interactive shell, makes it print `(no terminal - reporting only)` and change nothing.)",
                        check: "You can predict, before pressing a key, whether your choice edits `demos/customize-copilot-option-2.md`.",
                        why: "A link-fixing hook run unattended will happily rewrite a link that was deliberately broken for the demo.",
                    },
                    {
                        id: "cust-hook-decide",
                        title: "Decide per finding, then restore the demo doc",
                        body:
                            "Choose remove, replace or skip for each broken link. For this demo `s` (skip) is the honest answer - the link is meant to stay broken for the next person. If you did let it rewrite the file, restore it.",
                        commands: ["git diff --stat demos/customize-copilot-option-2.md", "git checkout -- demos/customize-copilot-option-2.md"],
                        check: "`git diff` on the demo doc is empty, so the challenge still works for the next run.",
                        why: "An explicit decision per link beats accepting a bulk rewrite - and leaving the planted 404 intact keeps the exercise repeatable.",
                    },
                ],
            },
        ],
    },

    {
        id: "cloud-agent",
        title: "Cloud Agent Demo",
        source: "demos/cloud-agent-option-2.md",
        estimate: "15 min hands-on; 30-45 min elapsed",
        goal:
            "Drive Copilot from github.com instead of the editor: generate a standup report, file an issue with a slash command, assign it to an agent, and review the resulting PR and session.",
        sections: [
            {
                id: "cloud-standup",
                title: "Step 1 - Standup report",
                steps: [
                    {
                        id: "cloud-standup-open",
                        title: "Open the repo's Agents page",
                        body:
                            "Go to **your** repository on github.com and click the **Agents** tab. If the tab is not visible, open `https://github.com/copilot/agents` and select your repository. Confirm Issues and Copilot cloud agent are enabled before filing anything - this demo creates real issues and pull requests.",
                        commands: ["gh repo view --json nameWithOwner,url,hasIssuesEnabled"],
                        check:
                            "You are signed in, acting on the repository the command printed, `hasIssuesEnabled` is true, and you can start an agent task for it.",
                        why: "This is the one demo that acts on a real remote repository, so pointing at the wrong one has consequences beyond the exercise.",
                    },
                    {
                        id: "cloud-standup-run",
                        title: "Run the chronicle standup command",
                        prompt: "/chronicle standup --days 5",
                        check:
                            "You get a report of activity from the last 5 days. If it comes back near-empty, that is expected on a quiet fork - try a wider window such as `--days 30` to confirm the command itself works.",
                        why: "Distinguishing 'no activity' from 'command failed' is the actual skill here.",
                    },
                    {
                        id: "cloud-standup-explore",
                        title: "Explore the other slash commands",
                        body: "Type `/` in the panel and scroll the list to see what else is available.",
                        check: "You can name at least two commands beyond `/chronicle` and `/create-issue`.",
                    },
                ],
            },
            {
                id: "cloud-issue",
                title: "Step 2 - Create a feature issue",
                steps: [
                    {
                        id: "cloud-issue-open",
                        title: "Open the Copilot panel from anywhere in the repo",
                        body: "Click the Copilot logo in the top-right, next to the search bar.",
                    },
                    {
                        id: "cloud-issue-create",
                        title: "Draft the issue with /create-issue",
                        prompt:
                            "/create-issue Add photo download support to the gallery app. Keep the implementation modular, TypeScript-friendly, and consistent with the existing UI. Include loading and error states, use async/await for I/O, avoid hardcoded secrets or URLs, and follow existing project conventions.",
                        check:
                            "A draft issue appears with a title, description and acceptance criteria. Read it before submitting - the constraints in the prompt (loading/error states, no hardcoded secrets) should have survived into the issue body.",
                        why:
                            "Whatever you leave in the issue becomes the agent's specification. Fixing a vague issue after assignment costs a whole PR cycle.",
                    },
                    {
                        id: "cloud-issue-assign",
                        title: "Assign the issue to Copilot",
                        body:
                            "Submit the issue, then set the assignee to **Copilot** for this walkthrough. Claude and Codex can use different timeline labels or session views.",
                        check: "The issue timeline shows the agent has been assigned and has started work.",
                    },
                ],
            },
            {
                id: "cloud-review",
                title: "Step 3 - Review the agent's work",
                steps: [
                    {
                        id: "cloud-review-pr",
                        title: "Follow the linked pull request",
                        body:
                            "On the issue page, scroll to **Activity** and wait for **Copilot linked a pull request that will close this issue**. This is an automatic timeline event, not a button. Open the draft PR card directly below it.",
                        check:
                            "The draft PR is open and references the issue. It may initially show `Files changed (0)` while Copilot is still working.",
                    },
                    {
                        id: "cloud-review-session",
                        title: "Read the agent's session log",
                        body:
                            "On the PR's **Conversation** tab, find **Copilot started work** and select **View session**. You must be signed in. You can also locate the session at `https://github.com/copilot/agents`.",
                        check: "You can describe which files it read before it started editing.",
                        why:
                            "The session log is the difference between reviewing a diff and understanding why the diff looks the way it does.",
                    },
                    {
                        id: "cloud-review-files",
                        title: "Review the file changes against the issue",
                        body:
                            "When Copilot has pushed its implementation, open **Files changed** and check the constraints you set: are loading and error states present, is I/O using async/await, are there hardcoded URLs or secrets, does it match existing component conventions? If the tab still shows `Files changed (0)`, wait and refresh.",
                        check: "You have a concrete accept/request-changes decision with a reason for each constraint.",
                    },
                    {
                        id: "cloud-review-local",
                        title: "Optional - pull the PR into the Copilot app and test it",
                        body:
                            "Open the PR in the GitHub Copilot app, run `npm run dev`, and exercise the download feature in the browser.",
                        check: "The feature works end to end, or you can point at exactly where it breaks.",
                        why: "Reviewing a running feature catches what diff review cannot.",
                    },
                    {
                        id: "cloud-review-close",
                        title: "Discuss or merge",
                        body:
                            "Leave review comments for anything you'd change, then merge if it meets the bar. Merging closes the linked issue automatically.",
                        check: "The PR is merged or has actionable review feedback on it.",
                    },
                ],
            },
        ],
    },
];

/** Look up a guide by id. */
export function getGuide(id) {
    return GUIDES.find((g) => g.id === id);
}

/** Every step id in a guide, in display order. */
export function stepIds(guide) {
    return guide.sections.flatMap((section) => section.steps.map((step) => step.id));
}

/** Total number of steps across all guides. */
export function allStepIds() {
    return GUIDES.flatMap((guide) => stepIds(guide));
}
