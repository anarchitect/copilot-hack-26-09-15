---
name: design-brief
description: 'Produce a grounded architecture design brief: repo reality, decisions, guardrails, and a test matrix.'
argument-hint: '<feature to design> — e.g. bulk photo operations for admin'
agent: 'agent'
tools: ['search/codebase']
---

# Architecture Design Brief

Design this feature for the Photo Gallery & Portfolio application:

**${input:feature:the feature to design, e.g. bulk photo operations for admin}**

## Ground the design before proposing anything

Read the relevant files first. Do not design from file names or from this list alone.

- [GalleryGrid](../../src/components/gallery/GalleryGrid.tsx) — photo grid, selection state, detail modal
- [Admin page](../../src/app/admin/page.tsx) — dashboard surface
- [Gallery page](../../src/app/gallery/page.tsx) — filtering and tag selection
- [Upload page](../../src/app/upload/page.tsx)
- [UploadZone](../../src/components/upload/UploadZone.tsx)
- [mock-photo-data](../../src/lib/mock-photo-data.ts) — the `Photo` shape
- [mock-tag-data](../../src/lib/mock-tag-data.ts) — the canonical tag list
- [mock-admin-data](../../src/lib/mock-admin-data.ts)
- [Copilot instructions](../copilot-instructions.md) — project conventions
- [Component usage guide](../../COMPONENT_USAGE_GUIDE.md)

Confirm that every page, route, and component named in the request actually exists. If the
request assumes a surface that is not in the repo, report the mismatch and design against what
is really there. Do not invent a screen to make the request fit.

State facts drawn from files. No speculation.

## Return exactly these sections

### 1. Assumptions and repo reality

What exists today and where. Any gap between the request and the codebase. Cite file paths.

### 2. Architecture decisions

For each decision give the choice, the alternative rejected, and the reason. Stay inside the
stack already in use: Next.js App Router, TypeScript, Tailwind with dark mode, React hooks,
Framer Motion, and the mock-data pattern in `src/lib/`. Justify any new dependency or say none
is needed.

### 3. Guardrails

Name each failure mode and the constraint that contains it. Cover at minimum: partial failure
part-way through a batch, concurrent or conflicting edits, destructive actions, unbounded
selection size, keyboard and screen-reader access, and dark mode parity.

### 4. Test matrix

A table with columns: scenario, input, expected result, how verified. Cover the happy path,
boundaries, and failure with recovery.

### 5. Rollout

The smallest shippable slice first, then what follows it.

## Constraints

- Design only. Do not edit files.
- No placeholder or mock implementation presented as complete work.
- Flag anything you could not verify rather than filling the gap with a guess.

## Worked example

The [Custom Agent exercise](../../demos/custom-agent.md) uses this feature request, which is a useful first run
because it deliberately names a surface that does not exist yet:

```text
bulk photo operations for admin:
- multi-select in gallery grid
- bulk tag assignment/removal
- bulk download metadata export
- rollback strategy for failed operations
```

Run it once under **Blueprint Mode** and once under the default agent, then compare depth,
structure, and implementation readiness.
