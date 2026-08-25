# Customize Copilot Demo

Welcome to the GitHub Copilot customization challenge lab. This version is built around four advanced customization areas from awesome-copilot and uses this Photo Gallery repo for realistic tasks.

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

## 🎯 Challenge 1: Instructions

**Goal:** prove that instruction quality changes output quality.

**Source:** [Instructions](https://awesome-copilot.github.com/instructions/)

1. Use this prompt:

```markdown
Propose a hardening plan for UploadZone.
Return exactly these sections:
1) Constraints from instructions
2) Proposed edits
3) Regression risks
4) Validation checklist
```

2. Run the same prompt twice:
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

---

## 🎭 Challenge 2: Agents

**Goal:** use agent specialization to improve planning quality.

**Source:** [Agents](https://awesome-copilot.github.com/agents/)

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

4. Switch to default Agent mode and run the same prompt.
5. Compare depth, structure, and implementation readiness.
- Specifically, look for:
  - Implementation details. Are they feasible and well-explained?
  - Structure. Is the output organized into clear sections?
  - Missing assumptions. Are there any gaps in the proposed solution?

---

## 🧩 Challenge 3: Skills

**Goal:** run an awesome-copilot skill in a unique test-engineering workflow.

**Source:** [Skills](https://awesome-copilot.github.com/skills/)

Skill used in this challenge: **javascript-typescript-jest**

Skill reference: [javascript-typescript-jest](https://github.com/github/awesome-copilot/tree/main/skills/javascript-typescript-jest)

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

---

## 🪝 Challenge 4: Hooks

**Goal:** use a hook to identify broken links in a markdown file.

**Source:** [Hooks](https://github.com/github/awesome-copilot/tree/main/hooks)

Hook used in this challenge: **Fix Broken Links**

**Prerequisites:** [Fix Broken Links Hook Requirements](https://github.com/github/awesome-copilot/blob/main/hooks/fix-broken-links/README.md#requirements)

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

---

## ✅ Completion Checklist

Mark off each item as you complete it:

- [ ] Completed the Instructions challenge and captured before/after quality differences
- [ ] Completed the Agents challenge and compared mode behavior
- [ ] Completed the Skills challenge with a repeatable trigger workflow
- [ ] Completed the Hooks challenge and confirmed the broken link detection
