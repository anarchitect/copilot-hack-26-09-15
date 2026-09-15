# Exercise: Custom Instructions

Part of the Customize Copilot Demo. Complete this exercise independently or follow the [full sequence](README.md#4-customize-copilot-demo).

**Setup:** Open this repository in your editor and start a fresh Copilot Chat with access to repository files. Keep unrelated local changes separate.

**Goal:** prove that instruction quality changes output quality.

**Source:** [Instructions](https://awesome-copilot.github.com/instructions/)

**Prerequisites:** Locate `/.github/copilot-instructions.md`, `/.github/instructions/react-tsx.instructions.md`, and `src/components/upload/UploadZone.tsx`. This exercise compares plans; do not implement the proposed edits.

## Steps

1. Use this prompt:

```markdown
Propose a hardening plan for UploadZone.
Return exactly these sections:
1) Constraints from instructions
2) Proposed edits
3) Regression risks
4) Validation checklist
```

2. Run the same prompt twice, starting a fresh chat for each run and keeping the model and attached context the same:
   - First without repository custom instructions
     - rename `/.github/copilot-instructions.md` to `/.github/copilot-instructions.md.bak`
     - rename `/.github/instructions/react-tsx.instructions.md` to `/.github/instructions/react-tsx.instructions.md.bak`
   - Then with both instruction files restored
     - rename both files back to their original `.md` names

3. Compare differences.
   - Specifically, look for:
     - Token usage. Which one had less token usage?
     - Files reviewed. Did they review the right files?
     - Quality of proposed edits. Did they follow repo conventions?

## Additional instructions best practices
- Keep instructions short and precise on the repo's unique conventions.
  - Instructions that are too long can degrade output quality.
  - GitHub's suggested prompt for generating repository instructions states, "Instructions must be no longer than 2 pages." This is guidance in the generation prompt, not a documented enforced file-size limit. See [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions#asking-copilot-cloud-agent-to-generate-a-copilot-instructionsmd-file).
  - Use `/.github/copilot-instructions.md` to outline the project, architecture, and best practices.
- If you need focused instructions, create them in the subdirectory `.github/instructions/` and specify the files or folders to which they apply.
  - For example, `/.github/instructions/react-tsx.instructions.md` uses `applyTo: "**/*.tsx"`, so supported Copilot features apply it only when working with TSX files and use it together with `/.github/copilot-instructions.md`.
  - The `applyTo` value also supports folder patterns such as `src/components/**/*.tsx` and comma-separated patterns such as `**/*.ts,**/*.tsx`. See GitHub's [custom instructions support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support).
- For a scalable option, manage instructions at the organization level and use wildcards for specific languages or frameworks.
  - Remember to keep this high-level and not repo-specific, as it will apply to all repos in the org.

## Completion Check

1. Save both plans and note differences in usage (if available), files reviewed, and adherence to repository conventions.
2. Confirm both instruction files are restored to their original names, even if you stop the exercise early.

1. [ ] Completed the Custom Instructions exercise and captured before/after quality differences

[Next: Custom Agent](custom-agent.md) · [Choose another exercise](README.md#4-customize-copilot-demo)
