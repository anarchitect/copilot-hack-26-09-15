# Engineering Practices Demo

Welcome to the GitHub Copilot engineering practices demo. In this demo, we will practice context engineering as a repeatable system, not just prompt wording.

The goal is to show that the best results usually come from minimal sufficient context: not too little, not too much, just the right context for the task.

## What You'll Learn
By the end of this demo, you will:
- [ ] Track credit usage
- [ ] Know when to start a new chat for a new topic
- [ ] Select files based on task scope
- [ ] Compare outcomes between bad and recommended context setup practices
- [ ] Apply a minimal context packet to reproduce and fix a real bug

**Estimated Time:** 30-40 minutes; allow 45-60 minutes with the bonus challenge

## Quick reminders for context engineering

Before starting, here are some quick reminders for context engineering.

### Context Layers

Good context engineering uses two layers:

1. **Project-wide context**

- Stable guidance such as repo instructions, architecture notes, and contributor rules
- Best for conventions the agent should know across many tasks

2. **Task-specific context**

- The selected files, scope, constraints, examples, and validation for one task
- Best for keeping the current chat focused and cheap

For this exercise, focus mostly on task-specific context. For larger work, combine both layers.

### Workflow by Phase

For small tasks, one focused chat is usually enough.

For larger tasks, separate the phases:

1. **Research** in one chat
2. **Plan** in a fresh chat with the approved plan
3. **Implement** in another fresh chat if the task grows

This reduces context mixing and keeps each phase easier for the agent to follow.

## 🎯 Challenge One: Locate credit usage

1. Open Copilot Chat in VS Code
2. Hover over an existing chat suggestion
3. Two items will appear on the bottom right of the suggestion:
   - **Model used**: The model that generated the suggestion
   - **Credits used**: The number of credits used to generate the suggestion

**Example image:**
![Copilot Chat usage](/demos/images/credit-usage.png)

We will be reviewing the credits in the next challenge, so make sure you know how to locate them.

## 📝 Challenge Two: Context engineering

For this challenge, we will use one small task so outcomes are easy to compare. We'll go over common mistakes and how to solve them with context engineering techniques.

### Overview of the Task

Below is an overview of the objective for the next four approaches. Each option will have a different approach to context engineering.

- **Current implementation:** The Upload Settings page of a web app has a **Tags (comma-separated)** input field that does not provide autocomplete suggestions. It is difficult for users to remember the available tags, leading to inconsistent tagging and user frustration.
- **Improvement:** Add autocomplete for tags in the Upload Settings page of a web app. The autocomplete should suggest tags as the user types, based on a predefined list of tags.
- **Validation steps:**
  1. Open the Photo Gallery & Portfolio web app.
  2. Select **Upload** from the navigation bar.
  3. Scroll down to the **Tags (comma-separated)** input field.
  4. Type a few characters like `we` and verify that a dropdown appears with suggested tags. If you type `w`, the suggestion `wedding` and `wildlife` should appear.

### Bad habit 1: Too vague, not enough context, and no examples

Run this first to establish a baseline failure mode.

1. Stay in an existing chat, even if the previous topic was unrelated.
2. Do not attach/select any task-relevant files.
3. Use a vague prompt.

Prompt example:

```text
Can you make the upload tags field smarter with autocomplete?
```

Observe what happens:
- More clarification turns
- Less predictable output
- More unnecessary context discovery

### Bad habit 2: Too much context, not focused on the task, and continued in a previous chat

Run this second to show how context overload degrades results.

1. Continue in the same chat from Bad habit 1.
2. Attach the target file plus several loosely related files. Suggested extras:

- [Upload page](../src/app/upload/page.tsx)
- [Gallery page](../src/app/gallery/page.tsx)
- [GalleryGrid](../src/components/gallery/GalleryGrid.tsx)
- [Demo markdown file](../demos/features-demo.md)

3. Keep prompt requirements broad and avoid explicit scope boundaries.

Prompt example:

```text
Improve the upload tag autocomplete behavior.

Requirements:
- Show suggestions as users type in tags.
- Include matching tags like wedding and wildlife for "w".
- Keep the page working.

Use the attached files for context.
```

Observe what happens:
- More tokens used to inspect irrelevant context
- Higher chance of unnecessary changes
- More diffuse reasoning about scope

### Recommended practice 1: Providing focused context, examples, and validation steps in a new chat

Run this third. This is the recommended implementation workflow.

1. Start a new chat because this is a new topic.
2. Attach only relevant files:

- [Upload page](../src/app/upload/page.tsx)
- [mock-tag-data](../src/lib/mock-tag-data.ts)

Suggested prompt:

```text
Implement tag autocomplete for the Upload page tags input. For example, typing "w" should suggest "wedding" and "wildlife". Create a new file in the components/upload folder for the autocomplete input if needed.
```

3. After implementation, check credits again and compare to the two bad-habit runs.

### Recommended practice 2: Research, plan, and implement in separate chats

Run this fourth to practice phase separation for larger tasks.

1. **Research chat**
   - Ask: where tags are sourced, how input state is managed, and which component owns the tags field.
   - Research for yourself and provide a summary of findings with file references.
2. **Plan chat**
   - Ask for a small implementation plan with explicit file scope, edge cases, and validation checklist.
   - Use plan mode to assist with the planning phase.
3. **Implement chat**
   - Execute the approved plan with minimal context packet and strict done criteria.

Prompt starters:

```text
Research chat:
Map where tag data and tag input behavior are implemented for Upload.

Plan chat:
Create a minimal plan to add tag autocomplete without changing styling.

Implement chat:
Implement the approved plan with the validation checklist.
```

Observe what happens:
- Lower context mixing
- Cleaner decisions per phase
- Easier review and rollback if needed

## 🎯 Challenge Three: Compare outcomes and reflect

After completing Challenge Two, compare all four habit-based runs.

### Team discussion prompts

Use these questions with the group:
1. Which run was more predictable?
2. Which run took fewer turns?
3. Which run used fewer credits?
4. Which run produced the smallest correct diff?

## ✅ Key practices to keep

1. New topic -> new chat.
2. New phase -> new chat when research, planning, and implementation start to mix.
3. Select files based on scope, not convenience.
4. Prefer minimal sufficient context over vague or overloaded context.

## 🎁 Bonus Challenge: Enforce the upload size limit

Now apply the same context engineering habits to a real bug in this repo.

The Upload page tells users it **Supports JPEG, PNG, GIF, WebP up to 10MB each**. The code never enforces that limit. The UI makes a promise the code does not keep, so oversized files are accepted silently.

Your job is to make the behavior match the promise. Derive the fix yourself, the same way you would on a real ticket.

### Reproduce it first

Always see the failure before you fix it.

1. Run `npm run dev`.
2. Open the app and go to `/upload`.
3. Drop in an image larger than 10MB.
4. Observe that the file is accepted, listed with its real size, and no error is shown anywhere.

Note what you saw. That observation is part of your context packet.

### Scope your context

Attach exactly one file:

- [UploadZone](../src/components/upload/UploadZone.tsx)

That is the whole packet. This is deliberately small, consistent with **Recommended practice 1** earlier in this guide. Resist the urge to attach the upload page, the gallery, or the mock data. If the agent turns out to need more, add it then, one file at a time.

Suggested prompt:

```text
The Upload page says it supports files up to 10MB each, but oversized files are still accepted. I dropped in a file over 10MB and it was added to the list with no error.

Enforce the 10MB limit and show the user a clear reason when a file is rejected. Do not change the existing layout or styling.
```

### Definition of Done

- [ ] A file over 10MB is rejected instead of being added to the upload list
- [ ] The user is shown a clear reason for the rejection, not a silent failure
- [ ] Files under 10MB still upload exactly as before
- [ ] The existing UI and styling are unchanged

### Validate

Repeat the reproduce steps and confirm the behavior changed:

1. Run `npm run dev` and go to `/upload`.
2. Drop in an image larger than 10MB. It should be rejected with a visible, understandable message.
3. Drop in an image under 10MB. It should upload as it always did.
4. Confirm the page layout and styling look the same as before your change.

### Stretch goal

The `UploadedFile` interface already declares a `status` of `'uploading' | 'success' | 'error'`, but nothing in the component ever sets `'error'`. It is dead code waiting for a rejection path.

Explore how `react-dropzone` reports refused files and use that to surface the reason in the UI. Ask the agent to explain the option it used and why, so you understand the fix rather than just accepting it.

## Optional Exercise: Stacked Pull Requests

A **stack** is a chain of pull requests in the same repository where the bottom PR targets a trunk branch (usually `main`) and each PR above it targets the branch of the PR below. This lets you review a small foundation change separately from the change that uses it, without waiting for the first PR to merge.

Stacked pull requests are a first-party GitHub feature, currently in **public preview**. GitHub stores a stack object on the server, which is what produces the stack icon, the stack map in the merge box, automatic cascading rebase, and bottom-up merge semantics.

> **This is the part that is easy to get wrong.** Simply running `gh pr create --base <parent-branch>` chains the base branches and *looks* like a stack, but GitHub does not register it as one. The PR's `stack` field stays `null`, no stack UI appears, and you get none of the rebase or merge behavior. You must use the `gh stack` extension (or the REST/GraphQL stack endpoints) to create the stack object.

**Goal:** Ask Copilot to create the branches, implement the changes, commit, and submit a real stack. You approve its tool calls and review the results—not manually create the stack.

This optional exercise follows [Hooks](hooks-option-2.md). No output from the Hooks exercise is required.

### Official documentation behind this exercise

1. [GitHub: About stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs) explains the stack model, the server-side stack object, and merge behavior.
2. [GitHub: Quickstart for stacked pull requests](https://docs.github.com/en/pull-requests/get-started/stacked-prs-quickstart) documents `gh stack init`, `add`, `push`, `submit`, and `view`.
3. [GitHub: Stacked pull requests CLI commands](https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands) is the full command reference.
4. [GitHub: Agent mode in VS Code](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide#agent-mode) describes how Copilot edits files and runs terminal commands.

Because the feature is in public preview, the CLI surface may change. It is available on GitHub.com and GitHub Enterprise Cloud; it is not available on GitHub Enterprise Server, does not support cross-fork stacks, and is not supported in GitHub Desktop.

### Simple sample

Use the existing `PhotoActions` component in [GalleryGrid](../src/components/gallery/GalleryGrid.tsx):

| Layer | PR | Change | Base branch | Head branch |
| --- | --- | --- | --- | --- |
| Bottom | PR 1 | Extract `PhotoActions` into its own file without changing behavior | `main` | `stack/photo-actions` |
| Top | PR 2 | Add native Like/Unlike tooltips to the extracted component | `stack/photo-actions` | `stack/like-tooltips` |

The dependency chain is `main → stack/photo-actions → stack/like-tooltips`. PR 2 builds on PR 1's extracted file; it is not a second independent branch from `main`. Its **Files changed** tab should show only the tooltip addition, not the extraction. Both PRs must also belong to the same stack object on GitHub, which is what Step 3 checks.

### Before you start

1. Open your own fork or training repository in VS Code. You need permission to push branches and create draft PRs there.
2. Select **Agent** in Copilot Chat, with file-editing and terminal tools enabled. Review command approvals rather than enabling blanket approval. If Agent mode or terminal execution is unavailable under your organization's policy, stop: Ask/Plan mode alone cannot execute this exercise.
3. Install Git, GitHub CLI (`gh`) 2.90.0 or later, and the project's Node.js/npm prerequisites. Sign in using `gh auth login` if needed and confirm with `gh auth status`. Never paste credentials into chat.
4. Install the stacked-PR extension and confirm it runs:

   ```bash
   gh extension install github/gh-stack
   gh stack --version
   ```

   Optionally install the companion skill so Copilot uses the extension correctly: `gh skill install github/gh-stack`.
5. Confirm `git remote -v` points `origin` to your training repository. Replace every `OWNER/REPO` below with that repository, and replace `main` if its default branch differs. Explicit `--repo` arguments prevent a fork's PRs from accidentally targeting upstream. The stack must live entirely in one repository—cross-fork stacks are not supported.
6. Start with a clean working tree and unused exercise branch names. Commit or stash earlier exercise work first. Install project dependencies using the repository's setup instructions.

### Step 1: Ask Copilot to build the bottom of the stack

Attach `src/components/gallery/GalleryGrid.tsx` to a fresh **Agent** chat. Replace `OWNER/REPO` before submitting:

```text
Build the BOTTOM layer of a two-PR stack in OWNER/REPO, using local Git
and the gh stack extension. Execute the work, not just suggest commands.

First confirm gh authentication, that gh stack --version works, that origin
points to OWNER/REPO, that the working tree is clean, and that main is the
default branch.
Stop and ask if any check fails or an exercise branch/PR already exists.
Do not overwrite work, force-push, or target an upstream repository.

Fetch origin, then run: gh stack init stack/photo-actions
This creates the stack with main as trunk and checks out the new branch.
Do NOT use gh pr create --base for this exercise: chaining base branches
that way does not create a stack object on GitHub.

Extract PhotoActions and its props interface from
src/components/gallery/GalleryGrid.tsx into
src/components/gallery/PhotoActions.tsx and import it back.
Preserve handlers, accessibility, styling, and both Grid and List views.
Keep any lucide-react icons that GalleryGrid still uses in its own import.
Do not implement tooltips yet or add dependencies.

Run npm run lint and npm run build. If either fails, report the failure
and stop before publishing; do not fix unrelated issues.
Review the diff for unintended changes and secrets, then commit only
the extraction.

Run gh stack submit --auto to push the branch and open the PR. With --auto,
new PRs are created as DRAFTS by default; there is no --draft flag, and
running submit interactively defaults to ready-for-review instead.
Because --auto generates the PR title, set the final title and body
afterwards with gh pr edit: title "Extract shared photo actions" and a body
describing scope, validation results, and its role as the bottom of the
stack. Follow the repository's PR template if present.

Return the actual PR URL, then run gh stack view and confirm the PR's
stack field is not null using:
gh api graphql -f query='{repository(owner:"OWNER",name:"REPO"){
pullRequest(number:NUMBER){stack{number size}}}}'
Leave the PR UNMERGED for the next layer to build on.
Stop here; do not add the second layer yet. If a tool or permission is
unavailable, report the blocker rather than claiming the PR was created.
```

1. Approve the intended tool calls and inspect the actual PR URL Copilot returns. A proposed command or draft description in chat is not a created PR.
2. Review the PR's **Files changed**: only the extraction should appear. Use `npm run dev` to check `/gallery` in Grid and List views: Like/Unlike and View Details should still work.
3. Keep the PR open and unmerged. Continue only after its checks pass.

### Step 2: Ask Copilot to add the second layer

Start a fresh **Agent** chat, attach the extracted `PhotoActions.tsx`, and replace both `OWNER/REPO` and `PR1_URL`:

```text
Add the SECOND layer to our stack in OWNER/REPO. The bottom PR is PR1_URL.
Use local Git and the gh stack extension to execute this, not just describe it.

Verify origin and GitHub authentication, a clean working tree, and that
the bottom PR is OPEN and UNMERGED with base main and head
stack/photo-actions. Confirm gh stack view shows the existing stack.
Stop if these checks fail or stack/like-tooltips or its PR already exists.

From stack/photo-actions, run: gh stack add stack/like-tooltips
This branches from the layer below, not from main, and records the new
layer in the stack. Do not create the branch with git checkout -b or open
the PR with gh pr create --base.

In src/components/gallery/PhotoActions.tsx, add a native title tooltip
to the Like button matching its existing dynamic aria-label:
"Like <photo title>" when unliked and "Unlike <photo title>" when liked.
Preserve aria-label, aria-pressed, behavior, and styling.
Do not change Download or Share, add dependencies, or redo the extraction.

Run npm run lint and npm run build; stop before publishing on failure.
Inspect the working diff for unintended changes and secrets, then commit
only the tooltip change. Before submitting, verify
git diff origin/stack/photo-actions...HEAD shows ONLY the tooltip addition
in PhotoActions.tsx. If it does not, stop and report the discrepancy.

Run gh stack submit --auto to push the branch and open the second PR as a
draft (there is no --draft flag). Then set the final title and body with
gh pr edit: title "Add Like/Unlike tooltips", and a body with the actual
bottom PR URL, "Depends on the layer below; merges bottom-up", and
validation results. Follow the repository's PR template if present.

Run gh stack view and confirm BOTH PRs appear in one stack with the correct
order. Then confirm both PRs report the SAME non-null stack number via the
GraphQL stack field. Use gh pr diff to confirm the top PR contains only the
tooltip change. Return both URLs, the stack number, and the results.
Do not merge either PR, enable auto-merge, force-push, or target upstream.
If blocked, report the blocker; do not claim success or substitute two
independent PRs targeting main, or base-chained PRs with a null stack.
```

Approve the intended tool calls. In `/gallery`, hover the Like button in both layouts, toggle it, then move away and hover again to verify the tooltip updates. Confirm the like count and pressed state still update.

### Step 3: Prove that Copilot created a stack

Independently run these read-only checks from your repository root, replacing `OWNER/REPO`. Do not rely only on Copilot's summary.

```bash
gh pr view stack/photo-actions --repo OWNER/REPO --json url,baseRefName,headRefName,state,isDraft,mergedAt
gh pr view stack/like-tooltips --repo OWNER/REPO --json url,baseRefName,headRefName,state,isDraft,mergedAt
gh pr diff stack/like-tooltips --repo OWNER/REPO
```

1. PR 1 must report base `main`, head `stack/photo-actions`, state `OPEN`, `isDraft: true`, and `mergedAt: null`.
2. PR 2 must report base `stack/photo-actions`, head `stack/like-tooltips`, state `OPEN`, `isDraft: true`, and `mergedAt: null`. **If both bases are `main`, this exercise has failed.**
3. PR 2's diff must contain only the tooltip addition in `src/components/gallery/PhotoActions.tsx`, not the extraction. Check both PRs' links to each other.
4. Ask Copilot to fetch origin and run `git merge-base --is-ancestor origin/stack/photo-actions origin/stack/like-tooltips`. Exit code `0` confirms the parent branch tip is in the child's history; nonzero requires investigation. This complements the GitHub base/head check.
5. If PR 2's base is wrong, ask Copilot to correct it using the documented base-change workflow and repeat these checks. If review updates PR 1, ask Copilot to merge `origin/stack/photo-actions` into `stack/like-tooltips`, resolve conflicts with your review, rerun validation, and push. Never merge PR 2 into PR 1.

### Step 4: Merge in dependency order (optional)

1. After review, mark PR 1 ready and merge it into `main` using **Create a merge commit**, not squash or rebase. Keep its branch until PR 2 has been retargeted; if automatic branch deletion is enabled, verify PR 2's base after the merge.
2. In PR 2, change the base to `main` if GitHub has not already done so. Verify **Files changed** still contains only the tooltip addition. Changing the base can make review comments outdated, so review the diff again.
3. Mark PR 2 ready, re-run required checks against the new base, and obtain any required approval before merging PR 2 into `main`. Never merge it while its base is still `stack/photo-actions`.
4. Delete the two training branches only after both PRs are merged and neither is the base of an open PR.

**Squash/rebase caution:** Those merge methods rewrite the parent's commits. Merely changing PR 2's base may then show PR 1's changes again. Stop and restack only PR 2's commits onto the updated `main` before continuing; do not merge a duplicated diff. The merge-commit path above avoids that extra operation.

### Completion checks

1. Copilot created two linked PRs, with actual URLs and the verified base/head pairs shown in the sample table before merging.
2. PR 1 works independently; PR 2 includes PR 1's code but shows only its own change for review.
3. Grid and List views retain working Like/Unlike behavior, with updated native tooltips on PR 2.
4. Lint/build results and manual checks are recorded in each PR; any pre-existing failures are distinguished from new failures.
5. You can explain why PR 2 initially targets PR 1's branch and why PR 1 must merge first.

**Verification boundary:** The official references establish the Agent and PR operations used here; they do not guarantee a particular model's output. An end-to-end exercise pass requires the two real PRs, branch/diff evidence, and application checks above. Reviewing this guide or checking CLI syntax alone does not establish that pass.

## Anti-Patterns to Avoid

1. Context dumping: attaching many files that do not help the decision.
2. Context mixing: research, planning, coding, debugging, and review in the same long chat.
3. Stale guidance: relying on instructions or examples that no longer match the codebase.
4. No validation: assuming the agent understood the task without checking behavior.
