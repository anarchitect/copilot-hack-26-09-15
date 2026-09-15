# Exercise 4: Hooks

Optional extension to the Customize Copilot Demo. Complete this exercise independently or explore the [optional guides](README.md#optional-demo-sequence--descriptions).

**Setup:** Open this repository in your editor and a terminal at the repository root. Keep unrelated local changes separate.

**Goal:** use a hook to identify broken links in a markdown file.

**Source:** [Hooks](https://github.com/github/awesome-copilot/tree/main/hooks)

Hook used in this challenge: **Fix Broken Links**

**Prerequisites:** [Fix Broken Links Hook Requirements](https://github.com/github/awesome-copilot/blob/main/hooks/fix-broken-links/README.md#requirements)

This exercise runs independently in a terminal; no output from the Copilot Chat exercises is required.

## Steps

1. View and review the Fix Broken Links hook in `.github/hooks/fix-broken-links/`.
2. Run the command for your shell from the repository root:
   - **Bash:** `chmod +x .github/hooks/fix-broken-links/link-fix.sh && bash .github/hooks/fix-broken-links/link-fix.sh ./demos/hooks-option-2.md`
   - **PowerShell:** `pwsh -File .github/hooks/fix-broken-links/link-fix.ps1 .\demos\hooks-option-2.md`
3. Confirm the report identifies the planted broken link below as `BROKEN (404)`.
   - A transient `ERR` for another URL means the checker could not reach it; retry before treating it as broken.
4. Choose `s` to skip the intentional finding so the exercise remains repeatable. If you remove or replace it, restore this file with `git restore demos/hooks-option-2.md`.

**Broken Link**
<!-- INTENTIONAL 404: keep this link broken so both hook implementations have a deterministic demo finding. -->
```markdown
- An HTML anchor:
  <a href="https://github.com/github/awesome-copilot/this-page-does-not-exist-404">read more</a>
```

## Completion Check

1. Capture the report showing `BROKEN (404)` for the intentional link.
2. Confirm the planted link is unchanged so the exercise remains repeatable.

1. [ ] Completed the Hooks exercise and confirmed the broken link detection

[Next exercise: Stacked Pull Requests](engineering-practices-option-2.md#optional-exercise-stacked-pull-requests)

[Choose another optional exercise](README.md#optional-demo-sequence--descriptions)
