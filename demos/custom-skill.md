# Exercise 3: Custom Skill

Part of the Customize Copilot Demo. Complete this exercise independently or follow the [full sequence](README.md#3-customize-copilot-demo).

**Setup:** Open this repository in your editor and start a fresh Copilot Chat with access to repository files. Keep unrelated local changes separate.

**Goal:** run an awesome-copilot skill in a unique test-engineering workflow.

**Source:** [Skills](https://awesome-copilot.github.com/skills/)

Skill used in this challenge: **javascript-typescript-jest**

Skill reference: [javascript-typescript-jest](https://github.com/github/awesome-copilot/tree/main/skills/javascript-typescript-jest)

**Prerequisites:** Open Copilot Chat in default Agent mode and locate the skill definition below and `src/components/upload/UploadZone.tsx`. No previous exercise is required. Jest and a `test` script are not currently configured in this repository, so setup notes are part of the deliverable; installing a test harness is outside this exercise.

## Steps

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

## Completion Check

1. Capture the test plan, test scaffolding, setup notes, and maintenance checklist.
2. Confirm coverage includes the original behavior, accessibility, and follow-up edge cases, with consistent conventions across both responses.
3. Distinguish generated tests from executed tests; do not claim they pass without a configured test harness.
4. Review any generated file changes and keep or discard only changes from this exercise before continuing.

1. [ ] Completed the Custom Skill exercise with a repeatable trigger workflow

[Optional: Hooks](hooks.md) · [Choose another exercise](README.md#3-customize-copilot-demo)
