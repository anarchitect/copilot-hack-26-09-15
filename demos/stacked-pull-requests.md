# Stacked Pull Requests

**Optional exercise.** Follows [Hooks](hooks-option-2.md); no output from the Hooks exercise is required.

A **stack** is a chain of pull requests in the same repository where the bottom PR targets a trunk branch (usually `main`) and each PR above it targets the branch of the PR below. This lets you review a small foundation change separately from the change that uses it, without waiting for the first PR to merge.

Stacked pull requests are a first-party GitHub feature, currently in **public preview**. GitHub stores a stack object on the server, which is what produces the stack icon, the stack map in the merge box, automatic cascading rebase, and bottom-up merge semantics.

> **This is the part that is easy to get wrong.** Simply running `gh pr create --base <parent-branch>` chains the base branches and *looks* like a stack, but GitHub does not register it as one. The PR's `stack` field stays `null`, no stack UI appears, and you get none of the rebase or merge behavior. You must use the `gh stack` extension (or the REST/GraphQL stack endpoints) to create the stack object.

**Goal:** Ask Copilot to create the branches, implement the changes, commit, and submit a real stack. You approve its tool calls and review the results—not manually create the stack.


## Official documentation behind this exercise

1. [GitHub: About stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs) explains the stack model, the server-side stack object, and merge behavior.
2. [GitHub: Quickstart for stacked pull requests](https://docs.github.com/en/pull-requests/get-started/stacked-prs-quickstart) documents `gh stack init`, `add`, `push`, `submit`, and `view`.
3. [GitHub: Stacked pull requests CLI commands](https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands) is the full command reference.
4. [GitHub: Agent mode in VS Code](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide#agent-mode) describes how Copilot edits files and runs terminal commands.

Because the feature is in public preview, the CLI surface may change. It is available on GitHub.com and GitHub Enterprise Cloud; it is not available on GitHub Enterprise Server, does not support cross-fork stacks, and is not supported in GitHub Desktop.

## Simple sample

Use the existing `PhotoActions` component in [GalleryGrid](../src/components/gallery/GalleryGrid.tsx):

| Layer | PR | Change | Base branch | Head branch |
| --- | --- | --- | --- | --- |
| Bottom | PR 1 | Extract `PhotoActions` into its own file without changing behavior | `main` | `stack/photo-actions` |
| Top | PR 2 | Add native Like/Unlike tooltips to the extracted component | `stack/photo-actions` | `stack/like-tooltips` |

The dependency chain is `main → stack/photo-actions → stack/like-tooltips`. PR 2 builds on PR 1's extracted file; it is not a second independent branch from `main`. Its **Files changed** tab should show only the tooltip addition, not the extraction. Both PRs must also belong to the same stack object on GitHub, which is what Step 3 checks.

## Before you start

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

## Step 1: Ask Copilot to build the bottom of the stack

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

## Step 2: Ask Copilot to add the second layer

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

## Step 3: Prove that Copilot created a real stack

Base-branch chaining alone does not prove a stack exists. Run these read-only checks from your repository root, replacing `OWNER/REPO`. Do not rely only on Copilot's summary.

```bash
# 1. Branch topology
gh pr view stack/photo-actions --repo OWNER/REPO --json url,number,baseRefName,headRefName,state,isDraft,mergedAt
gh pr view stack/like-tooltips --repo OWNER/REPO --json url,number,baseRefName,headRefName,state,isDraft,mergedAt

# 2. The stack object itself — this is the check that matters
gh stack view

gh api graphql -f query='
query($o:String!,$r:String!,$bottom:Int!,$top:Int!){
  repository(owner:$o,name:$r){
    bottom: pullRequest(number:$bottom){ baseRefName stack { number size baseRefName } }
    top:    pullRequest(number:$top){    baseRefName stack { number size baseRefName } }
  }
}' -F o=OWNER -F r=REPO -F bottom=BOTTOM_PR_NUMBER -F top=TOP_PR_NUMBER

# 3. Layer isolation
gh pr diff stack/like-tooltips --repo OWNER/REPO
```

1. The bottom PR must report base `main`, head `stack/photo-actions`, state `OPEN`, `isDraft: true`, and `mergedAt: null`.
2. The top PR must report base `stack/photo-actions`, head `stack/like-tooltips`, state `OPEN`, `isDraft: true`, and `mergedAt: null`. **If both bases are `main`, this exercise has failed.**
3. `gh stack view` must draw both branches in one stack, bottom to top, above the trunk. If it prints `current branch ... is not part of a stack`, the exercise has failed even when step 1 passes.
4. Both PRs must return the **same non-null** `stack` object, with `size: 2` and `baseRefName: main`. **If `stack` is `null` on either PR, the exercise has failed**: the base branches were chained by hand and GitHub never registered a stack. Fix it without recreating the PRs by running `gh stack link BOTTOM_PR_NUMBER TOP_PR_NUMBER`, then re-run this check.
5. On github.com, open the top PR. It must show the stack icon with a layer indicator such as `2/2` near the title, a stack map in the merge box, and a timeline entry reading `added this pull request to stack #N`. Absent stack UI means no stack object.
6. The top PR's diff must contain only the tooltip addition in `src/components/gallery/PhotoActions.tsx`, not the extraction.
7. Optionally confirm the branch ancestry with `git merge-base --is-ancestor origin/stack/photo-actions origin/stack/like-tooltips`. Exit code `0` is expected. This complements, and does not replace, the stack-object check.

If review changes the bottom layer, run `gh stack sync` and then `gh stack rebase` to cascade the update through the layers above, rather than merging one exercise branch into the other by hand.

## Step 4: Merge in dependency order (optional)

Pull requests in a stack merge bottom-up, and GitHub handles the retargeting for you.

1. After review, mark the bottom PR ready and merge it. GitHub automatically rebases the remaining branch and re-targets the top PR to `main`. You do not need to change the base by hand.
2. Confirm the top PR's **Files changed** still contains only the tooltip addition. Re-targeting can mark earlier review comments outdated, so re-read the diff.
3. Mark the top PR ready, let required checks re-run against the new base, obtain any required approval, then merge it.
4. Alternatively, merge the whole stack in one action by merging the top PR: every PR below it merges with it. Or run `gh stack merge`.
5. Delete the two training branches only after both PRs are merged and neither is the base of an open PR.

**Merge methods:** stacks support merge commit, squash, and rebase, and they are merge-queue aware. The resulting history matches merging each PR individually from the bottom up, so the repository does not need to allow merge commits specifically. If you merge through the API, use the asynchronous merge endpoint for stacks.

## Completion checks

1. Copilot created two PRs that share one non-null stack, evidenced by the actual PR URLs, the stack number, and `gh stack view` output.
2. The stack UI is visible on github.com: stack icon, layer indicator, and stack map.
3. The bottom PR works independently; the top PR includes the bottom PR's code but shows only its own change for review.
4. Grid and List views retain working Like/Unlike behavior, with updated native tooltips on the top PR.
5. Lint/build results and manual checks are recorded in each PR; any pre-existing failures are distinguished from new failures.
6. You can explain the difference between chaining base branches and creating a stack, and why `stack: null` means the exercise failed.

**Verification boundary:** The official references establish the Agent and stack operations used here; they do not guarantee a particular model's output. An end-to-end exercise pass requires the two real PRs, a non-null shared stack object, branch/diff evidence, and the application checks above. Reviewing this guide or checking CLI syntax alone does not establish that pass. Stacked pull requests are in public preview, so re-check the CLI reference if a command behaves differently.

