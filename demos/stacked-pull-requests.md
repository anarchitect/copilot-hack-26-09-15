# Stacked Pull Requests

**Optional exercise.** Follows [Hooks](hooks.md); no output from the Hooks exercise is required.

A **stack** is a chain of pull requests in the same repository where the bottom PR targets a trunk branch (usually `main`) and each PR above it targets the branch of the PR below. This lets you review a small foundation change separately from the change that uses it, without waiting for the first PR to merge.

Stacked pull requests are a first-party GitHub feature, currently in **public preview**. GitHub stores a stack object on the server, which is what produces the stack icon, the stack map in the merge box, automatic cascading rebase, and bottom-up merge semantics.

> **This is the part that is easy to get wrong.** Simply running `gh pr create --base <parent-branch>` chains the base branches and *looks* like a stack, but GitHub does not register it as one. The PR's `stack` field stays `null`, no stack UI appears, and you get none of the rebase or merge behavior. You must use the `gh stack` extension (or the REST/GraphQL stack endpoints) to create the stack object.

**Goal:** Copilot creates the branches, writes the changes, and submits a real stack. You approve its tool calls and verify the result.

## Official documentation

1. [About stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs) — the stack model, the server-side object, merge behaviour.
2. [Quickstart for stacked pull requests](https://docs.github.com/en/pull-requests/get-started/stacked-prs-quickstart) — `gh stack init`, `add`, `push`, `submit`, `view`.
3. [Stacked pull requests CLI commands](https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands) — full command reference.
4. [Agent mode in VS Code](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide#agent-mode) — how Copilot edits files and runs terminal commands.

The feature is in public preview, so the CLI surface may change. It works on GitHub.com and GitHub Enterprise Cloud, not GitHub Enterprise Server. Cross-fork stacks and GitHub Desktop are unsupported.

## What you will build

Use the existing `PhotoActions` component in [GalleryGrid](../src/components/gallery/GalleryGrid.tsx):

| Layer | Change | Base branch | Head branch |
| --- | --- | --- | --- |
| Bottom | Extract `PhotoActions` into its own file, no behaviour change | `main` | `stack/photo-actions` |
| Top | Add native Like/Unlike tooltips to the extracted component | `stack/photo-actions` | `stack/like-tooltips` |

The chain is `main → stack/photo-actions → stack/like-tooltips`. The top layer builds on the bottom layer's extracted file, so its **Files changed** tab shows only the tooltip addition. Both PRs must also belong to the same stack object, which is what Step 3 checks.

## Before you start

1. Open your own fork or training repository in VS Code, with permission to push branches and open PRs. The whole stack must live in one repository — cross-fork stacks are not supported.
2. Select **Agent** in Copilot Chat with file-editing and terminal tools enabled. Approve commands individually rather than enabling blanket approval. Ask/Plan mode cannot execute this exercise.
3. Install Git, GitHub CLI 2.90.0 or later, and the project's Node/npm prerequisites. Run `gh auth login` if needed. Never paste credentials into chat.
4. Install the extension:

   ```bash
   gh extension install github/gh-stack
   gh stack --version
   ```

   Optionally add the companion skill so Copilot drives it correctly: `gh skill install github/gh-stack`.
5. Confirm `git remote -v` points `origin` at your training repository. Replace `OWNER/REPO` below with it, and replace `main` if your default branch differs.
6. Start from a clean working tree with both `stack/*` branch names unused, and install project dependencies.

## Step 1: Build the bottom layer

Attach `src/components/gallery/GalleryGrid.tsx` to a fresh **Agent** chat and send:

```text
Build the bottom layer of a two-PR stack here. Execute the work, don't
just propose commands. Stop and tell me if any step fails.

Create the branch with: gh stack init stack/photo-actions
Don't use gh pr create --base -- it doesn't create a stack object.

Extract PhotoActions and its props from GalleryGrid.tsx into
src/components/gallery/PhotoActions.tsx and import it back. Leave the
lucide-react icons GalleryGrid still uses in its own import. No tooltips yet.

Run npm run lint and npm run build, then commit.

Publish with: gh stack submit --auto
(--auto creates a draft and generates the title; there is no --draft flag.)
Then set a real title and body with gh pr edit.

Report the PR URL and the output of gh stack view. Don't start layer two.
```

Notes on that prompt: `gh stack init` takes the branch name and uses your default branch as the trunk. The lint/build line matters because the extraction leaves `Heart` and `Download` referenced in `GalleryGrid` but removed from its import — lint catches it, and the agent should fix it before publishing.

`gh stack view` will draw your one branch above the trunk, but GitHub does not create the stack object until a second PR joins it. Querying the `stack` field now returns `null`, and that is expected — Step 3 is where it must be non-null.

1. Approve the tool calls and open the PR URL Copilot returns. A command proposed in chat is not a created PR.
2. Check **Files changed** shows only the extraction. Run `npm run dev` and confirm `/gallery` still likes, unlikes and opens details in both Grid and List views.
3. Leave the PR open and unmerged.

## Step 2: Add the top layer

Fresh **Agent** chat, attach the new `PhotoActions.tsx`, and send:

```text
Add the second layer to this stack. Execute the work, don't just propose
commands. Stop and tell me if any step fails.

Confirm gh stack view shows the existing stack, then create the branch with:
gh stack add stack/like-tooltips
That branches from the layer below, not from main. Don't use git checkout -b
or gh pr create --base.

In PhotoActions.tsx, give the Like button a native title tooltip matching its
existing aria-label: "Like <photo title>" unliked, "Unlike <photo title>"
liked. Keep aria-label, aria-pressed, behaviour and styling. Change nothing else.

Run npm run lint and npm run build, then commit.

Confirm the layer is isolated before publishing:
git diff origin/stack/photo-actions...HEAD
It must show only the tooltip line. Stop if it shows more.

Publish with gh stack submit --auto, then set the title and body with
gh pr edit, noting this depends on the layer below and merges bottom-up.

Report both PR URLs and the output of gh stack view. Don't merge anything.
```

The `git diff A...HEAD` check is the one worth keeping. Three dots compares against the merge base, so it shows what this layer adds on top of the layer below — if the extraction shows up there, the branch came off the wrong parent.

Approve the tool calls. When `gh stack submit` runs this time it reports `Stack created on GitHub with 2 PRs (stack #N)` — that line is the stack object being created, and it only appears once a second PR joins.

In `/gallery`, hover the Like button in both layouts, toggle it, move away and hover again to confirm the tooltip text follows the state. Check the like count and pressed state still update.

## Step 3: Prove that Copilot created a real stack

Chained base branches alone prove nothing. Run these read-only checks yourself rather than trusting Copilot's summary. Replace `OWNER`, `REPO`, and the two PR numbers.

```bash
# 1. Branch topology
gh pr view stack/photo-actions --repo OWNER/REPO --json url,number,baseRefName,headRefName,state,isDraft,mergedAt
gh pr view stack/like-tooltips --repo OWNER/REPO --json url,number,baseRefName,headRefName,state,isDraft,mergedAt

# 2. The stack object -- the check that actually discriminates
gh stack view
gh api graphql -f query='{repository(owner:"OWNER",name:"REPO"){
  bottom: pullRequest(number:BOTTOM){ stack { number size baseRefName } }
  top:    pullRequest(number:TOP){    stack { number size baseRefName } }
}}'

# 3. Layer isolation
gh pr diff stack/like-tooltips --repo OWNER/REPO
```

| # | Check | Expected |
| --- | --- | --- |
| 1 | Bottom PR | base `main`, head `stack/photo-actions`, `OPEN`, `mergedAt: null` |
| 2 | Top PR | base `stack/photo-actions`, head `stack/like-tooltips`, `OPEN`, `mergedAt: null` — **both bases `main` is a failure** |
| 3 | `gh stack view` | Both branches in one stack above the trunk. `not part of a stack` is a failure even if checks 1–2 pass |
| 4 | GraphQL `stack` | The **same non-null** object on both PRs, `size: 2`. **`null` on either PR is a failure** |
| 5 | github.com | Stack icon with a `2/2` layer indicator, stack map in the merge box, timeline entry `added this pull request to stack #N` |
| 6 | Top PR diff | Only the tooltip line in `PhotoActions.tsx` |

Check 4 is the one that separates a stack from a lookalike. If it fails, the base branches were chained by hand. Repair it without recreating the PRs:

```bash
gh stack link BOTTOM_PR_NUMBER TOP_PR_NUMBER
```

Then re-run checks 3 to 5.

Optionally confirm ancestry with `git merge-base --is-ancestor origin/stack/photo-actions origin/stack/like-tooltips`; exit code `0` is expected. It complements the stack-object check and does not replace it.

If review changes the bottom layer, run `gh stack sync` then `gh stack rebase` to cascade the update upward. Never merge one exercise branch into the other by hand.

## Step 4: Merge bottom-up (optional)

Stacks merge from the bottom, and GitHub retargets the layers above for you.

1. Mark the bottom PR ready and merge it. The top PR is rebased and retargeted to `main` automatically — no manual base change.
2. Confirm the top PR's **Files changed** still shows only the tooltip. Retargeting can mark earlier review comments outdated, so re-read the diff.
3. Mark the top PR ready, let checks re-run against the new base, get any required approval, then merge.
4. Or merge the whole stack at once by merging the top PR — everything below comes with it. `gh stack merge` does the same from the CLI.
5. Delete the training branches once both PRs are merged and neither is the base of an open PR.

**Merge methods:** stacks support merge commit, squash and rebase, and are merge-queue aware. The resulting history matches merging each PR individually from the bottom, so the repository does not need to allow merge commits specifically. Merging through the API requires the asynchronous merge endpoint for stacks.

## Completion checks

1. Two PRs share one non-null stack, evidenced by the PR URLs, the stack number and `gh stack view`.
2. The stack UI is visible on github.com.
3. The bottom PR stands alone; the top PR carries the bottom PR's code but shows only its own change for review.
4. Grid and List views still like and unlike, with working tooltips on the top PR.
5. Lint and build results are recorded in each PR, with pre-existing failures distinguished from new ones.
6. You can explain why chaining base branches is not a stack, and why `stack: null` is a failure.

**Verification boundary:** the references above establish the Agent and stack operations; they do not guarantee any model's output. A genuine pass needs the two real PRs, a shared non-null stack object, the branch and diff evidence, and the application checks. Reading this guide or checking CLI syntax proves nothing. The feature is in public preview, so re-check the CLI reference if a command behaves differently.

## Anti-patterns to avoid

1. Treating chained base branches as a stack because the branch topology looks right.
2. Accepting Copilot's claim that a PR was created without opening the URL.
3. Putting both changes on one branch and splitting them afterwards.
4. Merging the top PR before the bottom, or merging one exercise branch into the other.

