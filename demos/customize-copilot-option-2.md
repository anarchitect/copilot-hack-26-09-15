# Customize Copilot Demo

Welcome to the GitHub Copilot customization exercises. These four standalone exercises preserve the original challenge content from awesome-copilot and use this Photo Gallery repo for realistic tasks.

## Choose an Exercise

Complete the exercises in order for the full demo, or select one independently. No exercise requires output from another.

1. [Custom Instructions](#exercise-1-custom-instructions) — compare UploadZone hardening plans with and without repository instructions.
2. [Custom Agent](#exercise-2-custom-agent) — compare Blueprint Mode and default Agent mode on bulk photo operations.
3. [Custom Skill](#exercise-3-custom-skill) — use the Jest skill to generate a test plan, scaffolding, and edge cases.
4. [Hooks](#exercise-4-hooks) — run the broken-link checker and inspect its findings.

**Shared setup:** Open this repository in your editor. Exercises 1–3 use Copilot Chat with access to repository files; Exercise 4 uses a terminal and the linked hook requirements. Start a fresh chat for each exercise and keep unrelated local changes separate.

## What You'll Learn
By the end of this demo, you will:
- [ ] Write and validate instruction-driven outputs
- [ ] Use agent modes to produce role-specific outcomes
- [ ] Apply skills-style workflows with clear triggers and deliverables
- [ ] Use hooks to identify broken links

**Estimated Time:** 35-50 minutes

---

## Reference Pages

- [Instructions](https://awesome-copilot.github.com/instructions/)
- [Agents](https://awesome-copilot.github.com/agents/)
- [Skills](https://awesome-copilot.github.com/skills/)
- [Hooks](https://github.com/github/awesome-copilot/tree/main/hooks)

---

## Exercise 1: Custom Instructions

**Goal:** prove that instruction quality changes output quality.

**Source:** [Instructions](https://awesome-copilot.github.com/instructions/)

**Prerequisites:** Locate `/.github/copilot-instructions.md`, `/.github/instructions/react-tsx.instructions.md`, and `src/components/upload/UploadZone.tsx`. This exercise compares plans; do not implement the proposed edits.

### Steps

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

### Additional instructions best practices
- Keep instructions short and precise on the repo's unique conventions.
  - Instructions that are too long can degrade output quality.
  - GitHub's suggested prompt for generating repository instructions states, "Instructions must be no longer than 2 pages." This is guidance in the generation prompt, not a documented enforced file-size limit. See [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions#asking-copilot-cloud-agent-to-generate-a-copilot-instructionsmd-file).
  - Use `/.github/copilot-instructions.md` to outline the project, architecture, and best practices.
- If you need focused instructions, create them in the subdirectory `.github/instructions/` and specify the files or folders to which they apply.
  - For example, `/.github/instructions/react-tsx.instructions.md` uses `applyTo: "**/*.tsx"`, so supported Copilot features apply it only when working with TSX files and use it together with `/.github/copilot-instructions.md`.
  - The `applyTo` value also supports folder patterns such as `src/components/**/*.tsx` and comma-separated patterns such as `**/*.ts,**/*.tsx`. See GitHub's [custom instructions support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support).
- For a scalable option, manage instructions at the organization level and use wildcards for specific languages or frameworks.
  - Remember to keep this high-level and not repo-specific, as it will apply to all repos in the org.

### Completion Check

1. Save both plans and note differences in usage (if available), files reviewed, and adherence to repository conventions.
2. Confirm both instruction files are restored to their original names, even if you stop the exercise early.

[Next: Custom Agent](#exercise-2-custom-agent) · [Choose another exercise](#choose-an-exercise)

---

## Exercise 2: Custom Agent

**Goal:** use agent specialization to improve planning quality.

**Source:** [Agents](https://awesome-copilot.github.com/agents/)

**Prerequisites:** Open Copilot Chat and confirm **Blueprint Mode** is available in the agent picker. This exercise uses the existing custom agent; it does not require the Custom Instructions exercise or implementation of the proposed feature.

### Steps

1. Switch to **Blueprint Mode** from awesome-copilot agents in Copilot chat. This mode is designed for planning and architecture tasks.
2. Review the Blueprint Mode markdown template in `/.github/agents/blueprint-mode.agent.md` to understand the expected output structure.
3. Use this prompt:

```markdown
Design a resilient "bulk photo operations" flow for admin:
- multi-select in gallery grid
- bulk tag assignment/removal
- bulk download metadata export
- rollback strategy for failed operations
Include architecture decisions, guardrails, and a test matrix.
```

4. Switch to default Agent mode, start a fresh chat with the same model and attached context, and run the same prompt.
5. Compare depth, structure, and implementation readiness.
- Specifically, look for:
  - Implementation details. Are they feasible and well-explained?
  - Structure. Is the output organized into clear sections?
  - Missing assumptions. Are there any gaps in the proposed solution?

### Completion Check

1. Save the two designs and compare architecture decisions, guardrails, rollback strategies, and test matrices.
2. Record which output is more implementation-ready and why.
3. Switch back to default Agent mode before starting another exercise.

[Next: Custom Skill](#exercise-3-custom-skill) · [Choose another exercise](#choose-an-exercise)

---

## Exercise 3: Custom Skill

**Goal:** run an awesome-copilot skill in a unique test-engineering workflow.

**Source:** [Skills](https://awesome-copilot.github.com/skills/)

Skill used in this challenge: **javascript-typescript-jest**

Skill reference: [javascript-typescript-jest](https://github.com/github/awesome-copilot/tree/main/skills/javascript-typescript-jest)

**Prerequisites:** Open Copilot Chat in default Agent mode and locate the skill definition below and `src/components/upload/UploadZone.tsx`. No previous exercise is required. Jest and a `test` script are not currently configured in this repository, so setup notes are part of the deliverable; installing a test harness is outside this exercise.

### Steps

1. Navigate to `.github/skills/javascript-typescript-jest/SKILL.md`
2. Review the shared skill instructions for safety and fit with your repo conventions.
3. Copy and run the following prompt:

```markdown
/javascript-typescript-jest Design and generate a test suite for UploadZone behavior.
Requirements:
- include tests for drag-drop states, file-type validation, and preview rendering
- include one accessibility-focused test (keyboard and aria behavior)
- include setup notes for jest config if missing
- output a test plan first, then test file scaffolding
```

4. Then run a follow-up prompt:

```markdown
/javascript-typescript-jest Now expand the suite with edge-case tests:
- duplicate upload attempts
- very large file rejection behavior
- unsupported MIME type handling
Then provide a "test maintenance checklist" for future UI changes.
```

5. Evaluate whether output behaved like a reusable skill execution.

### Completion Check

1. Capture the test plan, test scaffolding, setup notes, and maintenance checklist.
2. Confirm coverage includes the original behavior, accessibility, and follow-up edge cases, with consistent conventions across both responses.
3. Distinguish generated tests from executed tests; do not claim they pass without a configured test harness.
4. Review any generated file changes and keep or discard only changes from this exercise before continuing.

[Next: Hooks](#exercise-4-hooks) · [Choose another exercise](#choose-an-exercise)

---

## Exercise 4: Hooks

**Goal:** use a hook to identify broken links in a markdown file.

**Source:** [Hooks](https://github.com/github/awesome-copilot/tree/main/hooks)

Hook used in this challenge: **Fix Broken Links**

**Prerequisites:** [Fix Broken Links Hook Requirements](https://github.com/github/awesome-copilot/blob/main/hooks/fix-broken-links/README.md#requirements)

This exercise runs independently in a terminal; no output from the Copilot Chat exercises is required.

### Steps

1. View and review the Fix Broken Links hook in `.github/hooks/fix-broken-links/`.
2. Run the command for your shell from the repository root:
   - **Bash:** `chmod +x .github/hooks/fix-broken-links/link-fix.sh && bash .github/hooks/fix-broken-links/link-fix.sh ./demos/customize-copilot-option-2.md`
   - **PowerShell:** `pwsh -File .github/hooks/fix-broken-links/link-fix.ps1 .\demos\customize-copilot-option-2.md`
3. Confirm the report identifies the planted broken link below as `BROKEN (404)`.
   - A transient `ERR` for another URL means the checker could not reach it; retry before treating it as broken.
4. Choose `s` to skip the intentional finding so the exercise remains repeatable. If you remove or replace it, restore this file with `git restore demos/customize-copilot-option-2.md`.

**Broken Link**
<!-- INTENTIONAL 404: keep this link broken so both hook implementations have a deterministic demo finding. -->
```markdown
- An HTML anchor:
  <a href="https://github.com/github/awesome-copilot/this-page-does-not-exist-404">read more</a>
```

### Completion Check

1. Capture the report showing `BROKEN (404)` for the intentional link.
2. Confirm the planted link is unchanged so the exercise remains repeatable.

[Choose another exercise](#choose-an-exercise)

---

## ✅ Completion Checklist

Mark off each item as you complete it:

1. [ ] Completed the [Custom Instructions exercise](#exercise-1-custom-instructions) and captured before/after quality differences
2. [ ] Completed the [Custom Agent exercise](#exercise-2-custom-agent) and compared mode behavior
3. [ ] Completed the [Custom Skill exercise](#exercise-3-custom-skill) with a repeatable trigger workflow
4. [ ] Completed the [Hooks exercise](#exercise-4-hooks) and confirmed the broken link detection
