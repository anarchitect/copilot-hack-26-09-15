# GitHub Copilot App

**Follows [Features Demo](features-demo.md).** The GitHub Copilot app is a desktop app built on Copilot CLI that runs parallel agent sessions, each in its own git worktree and branch. This guide takes you from your first session through to letting an agent land a pull request on its own.

Three scenarios, in order:

| | Scenario | You will |
| --- | --- | --- |
| A | **First session** | Finish the Features Demo modal task in the app, review the diff, open a PR |
| B | **Canvas** | Extend a canvas extension this repo already ships so it covers a demo it omits |
| C | **Agent merge** | Let the app clear a blocker and merge a PR in your own fork — never touching `main` |

Scenario A is the on-ramp and carries the task over from Features Demo. **B and C are independent** — you can do either without A, and C does not need B.

> **The part that is easy to get wrong.** Two surfaces here resolve **only inside the app at runtime**: the canvas SDK module `@github/copilot-sdk/extension` is **not** an npm dependency, so `npm ci` never installs it and `node extension.mjs` will fail with `ERR_MODULE_NOT_FOUND`. Agent merge's control lives in the app UI. Every learner-verifiable check below is written to pass or fail from the **file system, the running app, and `gh`** — independent of the app's chrome.

## Official documentation

1. [GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) — built on Copilot CLI; macOS/Linux/Windows; **Interactive / Plan / Autopilot** modes; parallel sessions each with a dedicated git worktree and branch.
2. [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) — install, connect a repository, make a first change, create a PR.
3. [Working with canvas extensions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions) — what a canvas is, project (`.github/extensions`) vs user (`~/.copilot/extensions`) scope, discovery, and `/create-canvas`.
4. [Managing issues and pull requests](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests) — the **Merging a pull request** section documents **agent merge**.
5. [Built-in skills](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/built-in-skills) — `agent-merge`, `create-canvas`, `pr-stack`, `orchestrate`.

On Copilot Business or Enterprise, the **GitHub Copilot app** policy must be enabled for your organisation, or none of the app steps are available. It is on by default and is separate from the Copilot CLI policy.

## Before you start

1. Install the GitHub Copilot app from the [download page](https://github.com/features/ai/github-app) and sign in.
2. Have this repository cloned, plus Node 18.18+ and GitHub CLI 2.x on `PATH`. `npm ci` should already pass from the repo root.
3. For Scenario C you need a **fork** you can push to. Do not work in the shared upstream.
4. Run `gh auth login` if needed. Never paste credentials into chat.

If you cannot install the app, each scenario ends with a fallback that keeps the same verifiable outcome.

---

# Scenario A — Your first session

This is [Challenge One of the Features Demo](features-demo.md#-challenge-one-improve-gallery-modal-ux) done in the app. If you already finished it with inline suggestions or Copilot Chat, do it again here — the point is the app's session model, not the code.

**First make sure the defects are still there.** The app cuts each session's worktree from your current commit, so if you already committed the Features fix, the session inherits it, there is nothing to fix, and checks 2–4 below pass without the agent doing anything. Either `git stash` your Features work or start from a commit that still has the bug.

**The task:** the photo detail modal in [GalleryGrid](../src/components/gallery/GalleryGrid.tsx) does not close on Escape, does not close when you click the backdrop, and lets the page scroll behind it. Fix all three, in both Grid and List views.

## Step 1: Start a session

1. Next to **Sessions**, select **+**, then **Local folder or repository**, and choose this repository.
2. Pick a session mode from the dropdown below the prompt field:
   - **Interactive** — you steer as it goes.
   - **Plan** — the agent proposes a plan and you approve it first.
   - **Autopilot** — it runs to completion.
3. Leave the model on **Auto** unless you want to compare models.

You do not need to create or switch branches. Each session gets its own git worktree and branch.

**Confirm your baseline before you prompt anything.** Run `npm run dev`, open `http://localhost:3000/gallery`, click **View Details** on any photo, and check that Escape does nothing, clicking the backdrop does nothing, and the page still scrolls behind the modal. If any of those already work, you are starting from a fixed commit — go back and re-read the note above.

## Step 2: Describe the change

```text
In src/components/gallery/GalleryGrid.tsx, fix the photo detail modal:
close on Escape, close on backdrop click, and stop the page scrolling
while it is open.

The same modal opens from Grid view and List view - both must work.
Change behaviour only: leave the modal content, card layouts, Search,
Filters and the Grid/List toggle exactly as they are.

Run npm run lint and npm run build, then tell me what you changed.
```

Why the prompt says what it says:

- **Naming the file and the three behaviours** gets a tighter diff than "improve the modal UX". The agent does not have to guess what "polished" means.
- **"Grid view and List view"** is the one thing people miss. The modal is opened from two places, and a fix applied to one layout looks complete until you switch views.
- **"Change behaviour only"** stops scope creep into restyling, which is what turns a reviewable diff into an unreviewable one.
- **Lint and build** catch an unused import or a stray hook dependency before you see it in review.

## Step 3: Review, preview, and open a PR

1. Open the **Changes** view above the prompt box and read the diff. It should touch `GalleryGrid.tsx` and nothing else.
2. Run `npm run dev` and open `http://localhost:3000/gallery`. Some app versions offer an in-app terminal and browser preview; if yours does not, use your own terminal and browser — the checks are identical.
3. Work the Definition of Done in **both** layouts.
4. Select **Create PR** when you are happy with it. Open it from the **PR** button in the app, or the repository's **Pull requests** page.

| # | Check | Pass condition |
| --- | --- | --- |
| 1 | Diff scope | Only `GalleryGrid.tsx` changed |
| 2 | Escape | Closes the modal in Grid **and** List view |
| 3 | Backdrop click | Clicking outside the modal content closes it, in both views |
| 4 | Scroll lock | The page behind the modal cannot scroll while it is open |
| 5 | Nothing else broke | Search, Filters and the Grid/List toggle still work |
| 6 | Quality | `npm run lint` and `npm run build` both pass |

If a check fails, reply in the same session naming the specific gap — "Escape works in Grid but not List" — and let it iterate. That is the loop the app is built for.

## Fallback

Do the same task in VS Code with Copilot Chat in Agent mode, or in Copilot CLI, using the same prompt. The verification table is unchanged. You lose the session and PR surface, not the exercise.

---

# Scenario B — Canvas

A **canvas** is a shared, interactive surface where you and the agent work on the same artifact — the agent updates it while it works, and you edit on that same surface. Canvases open in the app's right side panel.

**This repository already ships one, and nothing documents it.** `.github/extensions/demo-guides/` contains a working canvas that walks through the demo guides and tracks your progress per step. It covers four guides. It omits [Hooks](hooks.md), [Stacked Pull Requests](stacked-pull-requests.md), and this guide.

**Goal:** discover that canvas, then use the app's agent to add a fifth guide covering Hooks.

The extension is generic — `extension.mjs` (wiring) and `renderer.mjs` (HTML) both derive everything from the `GUIDES` array in `guides.mjs`, so **adding a guide means editing `guides.mjs` only**. Each guide is `{ id, title, source, estimate, goal, sections: [...] }`; each step is `{ id, title, body?, check?, why?, prompt?, commands? }`, and `id` is the stable progress key.

## Step 1: Discover the canvas

1. In the app sidebar open **Customize**, then **Installed**. Look for a canvas named **Demo guides** from this repo's `.github/extensions` — project scope, committed and team-shared.
2. Start a **New session** on this repository and ask the agent to open it:

```text
Open the "Demo guides" canvas and tell me which guides it lists
and how many steps each has.
```

It should report exactly **four** guides: Features, Engineering Practices, Customize Copilot, Cloud Agent. That four is your baseline; Step 3 turns it into five.

**If the canvas does not appear**, this is a registration problem, not a you problem. The extension has no `package.json`, which GitHub's docs list as part of the common structure. Add `.github/extensions/demo-guides/package.json` containing `{ "name": "demo-guides", "type": "module" }` and reopen. Knowing this before you edit anything is why discovery is its own step.

## Step 2: Add the Hooks guide

In the same session, attach `.github/extensions/demo-guides/guides.mjs` and send:

```text
Add a fifth guide to the GUIDES array in this file only. Do not edit
extension.mjs or renderer.mjs.

Model it on demos/hooks.md. Use exactly:
  id: "hooks"
  title: "Hooks Demo"
  source: "demos/hooks.md"

Give it one section whose steps mirror the numbered steps in hooks.md.
Every step needs a stable id prefixed "hooks-", a title, a body and a
check. Add a why only where hooks.md explains intent.

Leave the four existing guides byte-for-byte unchanged. Run
node --check on the file and fix any error before finishing.

Report the new step ids.
```

Why the prompt says what it says:

- **"this file only".** The wiring and renderer are generic, so a new tab appears from a `guides.mjs` edit alone. Touching the other two files turns a reviewable change into an unreviewable one.
- **Exact `id` and `source`.** `source` is what the canvas prints, and Step 3 asserts that file exists. A stable `id` keeps the progress key from churning.
- **"stable id prefixed `hooks-` … and a check".** `stepId` is the persistence key; `check` is what makes a step verifiable. Both match the contract the existing guides follow.
- **"run `node --check`".** The extension is plain ESM with no test harness. A syntax slip silently breaks the entire canvas, so the agent must self-verify before it claims success.

## Step 3: Verify

The first two checks need no app at all. Run from the repo root.

```bash
node --check .github/extensions/demo-guides/guides.mjs
```

```bash
node --input-type=module -e "import {GUIDES,stepIds} from './.github/extensions/demo-guides/guides.mjs'; import {existsSync} from 'node:fs'; const g=GUIDES.at(-1); const ids=GUIDES.flatMap(stepIds); const dup=ids.filter((x,i)=>ids.indexOf(x)!==i); if(GUIDES.length<5) throw new Error('need 5 guides, have '+GUIDES.length); if(g.source!=='demos/hooks.md') throw new Error('last source is '+g.source); if(!existsSync(g.source)) throw new Error('missing '+g.source); if(dup.length) throw new Error('duplicate ids: '+dup.join(',')); console.log('OK:',GUIDES.length,'guides,',ids.length,'steps, last=',g.id);"
```

| # | Check | Pass condition | Needs app |
| --- | --- | --- | --- |
| 1 | File parses | `node --check` exits `0` | no |
| 2 | Fifth guide valid | prints `OK: 5 guides, ... last= hooks` | no |
| 3 | Canvas shows it | a **Hooks Demo** tab appears reading `0/N` | yes |
| 4 | Agent accepts the new steps | ask the agent to `mark_step` one new `hooks-` id and it succeeds | yes |
| 5 | Progress persists | tick a `hooks-` step, reopen — the tick survives | yes |

**Check 4 is the discriminator.** `mark_step` throws `unknown_step` for any id it does not know, so before Step 2 that call fails by construction. If the agent claimed it added the guide but did not, check 4 still throws and no tab renders. Checks 1 and 2 fail on an unedited repo and pass on a correct edit — verified, not assumed.

## Step 4: Teardown

- Use the canvas header's **Reset this guide** button to clear progress, or delete the `hooks-` keys from `~/.copilot/extensions/demo-guides/artifacts/progress.json`.
- Revert the artifact with `git restore .github/extensions/demo-guides/guides.mjs`, or keep it and open a PR if the repo owner wants it upstreamed.

## If you cannot install the app

Opening, ticking and persisting are app-only. **The artifact edit is not.** Make the same `guides.mjs` change in your editor, or with Copilot in VS Code or the CLI, and run the two `node` checks — those fully prove the edit, and it will render for anyone who opens the canvas later.

To feel canvas scaffolding without editing this one, start an app session and run **`/create-canvas`**, describing a surface you want. That is the build-new path; it does not fill the Hooks gap, so treat it as a learning aid rather than the deliverable.

---

# Scenario C — Agent merge

From the docs: *"When you want to merge a pull request, you can enable agent merge at the top of the app. Agent merge will prompt the workspace's Copilot session to read your pull request, fix what is blocking it, and merge it as soon as GitHub allows. It runs in the background, survives app restarts, and turns itself off once your pull request is merged."*

The built-in `agent-merge` skill follows up on *"review comments, failing checks, and merge conflicts"* and the workflow invokes it automatically. The docs name those three blocker types but do not specify an order — treat it as the set it handles, not a sequence.

> **Safety — read before you touch anything.** Work **only in your fork**, and point the PR at a **throwaway base branch, never `main`**. Nothing here goes near the upstream repository's `main`, or even your fork's `main`. The only file involved is a disposable playground file that teardown deletes.

**Why a merge conflict and not a failing check.** This repository ships no CI and `main` has no branch protection. On an unprotected branch a red check does not block a merge and neither does a review comment — agent merge would fire instantly and demonstrate nothing. A merge conflict blocks at the git level regardless of repo policy, so it is the one blocker that reliably gives the agent something real to fix. A failing-check variant is at the end for anyone willing to do the extra setup.

## Step 1: Manufacture a deterministic conflict

Clone your fork and run this from its root:

```bash
git switch main && git pull

# Common ancestor: a throwaway file on a throwaway base branch
git switch -c demo/agent-merge-base
printf 'status: draft\n' > demos/agent-merge-playground.md
git add demos/agent-merge-playground.md
git commit -m "playground: base line"
git push -u origin demo/agent-merge-base

# Work branch changes that line one way
git switch -c demo/agent-merge-fix
printf 'status: ready for review\n' > demos/agent-merge-playground.md
git commit -am "playground: ready"
git push -u origin demo/agent-merge-fix

# Base branch changes the same line a different way
git switch demo/agent-merge-base
printf 'status: in progress\n' > demos/agent-merge-playground.md
git commit -am "playground: in progress"
git push
```

Open the PR **against the throwaway base**, then ask GitHub whether it merges. Replace `OWNER` with your fork's owner:

```bash
gh pr create --repo OWNER/copilot-hack-26-09-15 \
  --base demo/agent-merge-base --head demo/agent-merge-fix \
  --title "Agent merge demo" --body "Deliberate conflict for agent merge."

gh pr view --repo OWNER/copilot-hack-26-09-15 demo/agent-merge-fix \
  --json number,mergeable,mergeStateStatus,baseRefName
```

Expect `mergeable: CONFLICTING`. If it says `UNKNOWN`, GitHub is still computing — re-run after a few seconds.

Both branches change the **same line** that already existed in their common ancestor. Git cannot auto-merge that, and no repository policy can wave it through.

## Step 2: Enable agent merge

1. In the app, start a session on **your fork**, on `demo/agent-merge-fix`.
2. Open the pull request in the app and **enable agent merge at the top**.
3. Leave it running. It works in the background — do not hand-resolve the conflict.

You should see the agent read the PR, push a conflict-resolution commit, and merge into `demo/agent-merge-base`. The reconciled wording of that one line is model-dependent; that variability is expected. The end state you verify next is not.

## Step 3: Verify

```bash
gh pr view --repo OWNER/copilot-hack-26-09-15 PR_NUMBER \
  --json state,mergedAt,baseRefName
git fetch origin && git log --oneline origin/demo/agent-merge-base -5
```

| # | Check | Pass condition |
| --- | --- | --- |
| 1 | PR state | `state: MERGED`, `mergedAt` non-null |
| 2 | Target | `baseRefName: demo/agent-merge-base` — **never `main`** |
| 3 | Conflict genuinely resolved | the base branch history contains a resolution commit **you did not author**, and the playground file has no conflict markers |
| 4 | You did not merge by hand | you never ran `git merge` or `gh pr merge` |

If check 2 ever shows `main`, stop — the base was wrong.

## Step 4: Teardown

```bash
git switch main
git push origin --delete demo/agent-merge-fix demo/agent-merge-base
git branch -D demo/agent-merge-fix demo/agent-merge-base
```

Agent merge turns itself off once the PR merges, so there is nothing to disable. Deleting the branches removes the playground file with them. If you stopped before it merged, run `gh pr close PR_NUMBER` first.

## Optional variant: a failing check instead

This is closer to the documented **Fix failing checks** path, but it needs more setup and has more ways to silently no-op — which is why the conflict above is the default. It works only if you do both:

1. **Enable Actions on your fork.** GitHub disables Actions on new forks by default; turn them on in the fork's **Actions** tab, or the workflow never runs and the PR stays green.
2. **Make the check required.** Without branch protection marking it required, a red check does not block the merge. Add protection on the throwaway base branch before opening the PR.

Commit this workflow on the base branch, then plant a deterministic lint failure on the fix branch:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

Pass condition matches Step 3, plus the check flipping from failing to passing. Teardown also removes the protection rule.

## If you cannot install the app

Do Step 1 exactly, then resolve the conflict by hand to see precisely what agent merge automates:

```bash
git switch demo/agent-merge-fix
git merge origin/demo/agent-merge-base   # conflicts in the playground file
# edit the file to remove the conflict markers, then:
git add demos/agent-merge-playground.md
git commit
git push
gh pr merge --repo OWNER/copilot-hack-26-09-15 PR_NUMBER --merge
```

Step 3's pass conditions still apply — the only difference is that you authored the resolution commit instead of the agent. Run Step 4 teardown afterwards.

---

## Completion checks

1. **A** — the modal closes on Escape and on backdrop click, and the page cannot scroll behind it, in **both** Grid and List views. Lint and build pass, and the diff touches only `GalleryGrid.tsx`.
2. **B** — you found the `demo-guides` canvas and can say what it tracks and where its progress lives.
3. **B** — `guides.mjs` carries a fifth guide; both `node` checks pass; the Hooks tab renders and `mark_step` accepts a `hooks-` id that previously threw.
4. **C** — a pull request in your fork went from `CONFLICTING` to `MERGED` without you resolving the conflict, targeting a throwaway base branch.
5. Everything is torn down: canvas progress reset or reverted, demo branches deleted.
6. You can explain why a merge conflict was the right blocker here and a failing check was not.

## Verification boundary

What is proven: the modal behaviour (you exercise it yourself in both layouts), the `guides.mjs` edit (via `node --check` and the assertion, both of which fail on an unedited repo), and the PR reaching `MERGED` on the right base with a resolution commit you did not author (via `gh` and `git log`). What is **not** guaranteed: the app's UI wording. **Sessions**, **Local folder or repository**, **Changes**, **Create PR**, **Customize**, **Installed** and the agent merge control at the top of a pull request match the docs at time of writing, but labels move between versions — follow the on-screen equivalent. Reading this guide proves nothing; the running app, the artifact and the merged PR do.

## Related

- [Features Demo](features-demo.md) is where Scenario A's task comes from. Options 1 and 2 there do the same fix with inline suggestions and Copilot Chat, which is worth comparing against the app's session model.
- [Stacked Pull Requests](stacked-pull-requests.md) builds a stack with the `gh stack` CLI extension. The app offers a built-in `pr-stack` skill for the same job — *"create and manage a stack of dependent pull requests, with one child session for each layer"* — worth trying once you have done it the CLI way.
- [Hooks](hooks.md) is the guide you add to the canvas in Scenario B.

## Anti-patterns to avoid

1. Fixing the modal in Grid view and calling it done without switching to List view.
2. Believing the agent added the canvas guide without running the two `node` checks.
3. Pointing the Scenario C pull request at `main` instead of the throwaway base branch.
4. Hand-resolving the conflict, which skips the only thing Scenario C teaches.
5. Editing `extension.mjs` or `renderer.mjs` when `guides.mjs` is the only file that needs to change.
