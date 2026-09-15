# Exercise 2: Custom Agent

Part of the Customize Copilot Demo. Complete this exercise independently or follow the [full sequence](README.md#4-customize-copilot-demo).

**Setup:** Open this repository in your editor and start a fresh Copilot Chat with access to repository files. Keep unrelated local changes separate.

**Goal:** use agent specialization to improve planning quality.

**Source:** [Agents](https://awesome-copilot.github.com/agents/)

**Prerequisites:** Open Copilot Chat and confirm **Blueprint Mode** is available in the agent picker. This exercise uses the existing custom agent; it does not require the Custom Instructions exercise or implementation of the proposed feature.

## Steps

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

## Completion Check

1. Save the two designs and compare architecture decisions, guardrails, rollback strategies, and test matrices.
2. Record which output is more implementation-ready and why.
3. Switch back to default Agent mode before starting another exercise.

1. [ ] Completed the Custom Agent exercise and compared mode behavior

[Next: Custom Skill](custom-skill.md) · [Choose another exercise](README.md#4-customize-copilot-demo)
