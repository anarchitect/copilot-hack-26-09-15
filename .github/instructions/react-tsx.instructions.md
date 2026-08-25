---
applyTo: "**/*.tsx"
---

# React TSX Instructions

- Use function components and React hooks.
- Add `'use client';` only when a component needs hooks, event handlers, browser APIs, or other client-only behavior.
- Define a typed props interface near each component and follow the repository's existing export style.
- Keep state local, derive values instead of duplicating state, and use immutable updates.
- Reuse components from `src/components/ui/` before creating new UI primitives.
- Use Tailwind CSS classes, including the existing responsive and dark-mode patterns.
- Preserve semantic HTML, keyboard behavior, accessible names, and visible focus states.
