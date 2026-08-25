# Engineering Practices Demo

Welcome to the GitHub Copilot engineering practices demo. In this demo, we will practice context engineering as a repeatable system, not just prompt wording.

The goal is to show that the best results usually come from minimal sufficient context: not too little, not too much, just the right context for the task.

## What You'll Learn
By the end of this demo, you will:
- [ ] Track credit usage
- [ ] Know when to start a new chat for a new topic
- [ ] Select files based on task scope
- [ ] Compare outcomes between bad and recommended context setup practices
- [ ] Apply a minimal context packet to reproduce and fix a real bug

**Estimated Time:** 30-40 minutes; allow 45-60 minutes with the bonus challenge

## Quick reminders for context engineering

Before starting, here are some quick reminders for context engineering.

### Context Layers

Good context engineering uses two layers:

1. **Project-wide context**

- Stable guidance such as repo instructions, architecture notes, and contributor rules
- Best for conventions the agent should know across many tasks

2. **Task-specific context**

- The selected files, scope, constraints, examples, and validation for one task
- Best for keeping the current chat focused and cheap

For this exercise, focus mostly on task-specific context. For larger work, combine both layers.

### Workflow by Phase

For small tasks, one focused chat is usually enough.

For larger tasks, separate the phases:

1. **Research** in one chat
2. **Plan** in a fresh chat with the approved plan
3. **Implement** in another fresh chat if the task grows

This reduces context mixing and keeps each phase easier for the agent to follow.

## 🎯 Challenge One: Locate credit usage

1. Open Copilot Chat in VS Code
2. Hover over an existing chat suggestion
3. Two items will appear on the bottom right of the suggestion:
   - **Model used**: The model that generated the suggestion
   - **Credits used**: The number of credits used to generate the suggestion

**Example image:**
![Copilot Chat usage](/demos/images/credit-usage.png)

We will be reviewing the credits in the next challenge, so make sure you know how to locate them.

## 📝 Challenge Two: Context engineering

For this challenge, we will use one small task so outcomes are easy to compare. We'll go over common mistakes and how to solve them with context engineering techniques.

### Overview of the Task

Below is an overview of the objective for the next four approaches. Each option will have a different approach to context engineering.

- **Current implementation:** The Upload Settings page of a web app has a **Tags (comma-separated)** input field that does not provide autocomplete suggestions. It is difficult for users to remember the available tags, leading to inconsistent tagging and user frustration.
- **Improvement:** Add autocomplete for tags in the Upload Settings page of a web app. The autocomplete should suggest tags as the user types, based on a predefined list of tags.
- **Validation steps:**
  1. Open the Photo Gallery & Portfolio web app.
  2. Select **Upload** from the navigation bar.
  3. Scroll down to the **Tags (comma-separated)** input field.
  4. Type a few characters like `we` and verify that a dropdown appears with suggested tags. If you type `w`, the suggestion `wedding` and `wildlife` should appear.

### Bad habit 1: Too vague, not enough context, and no examples

Run this first to establish a baseline failure mode.

1. Stay in an existing chat, even if the previous topic was unrelated.
2. Do not attach/select any task-relevant files.
3. Use a vague prompt.

Prompt example:

```text
Can you make the upload tags field smarter with autocomplete?
```

Observe what happens:
- More clarification turns
- Less predictable output
- More unnecessary context discovery

### Bad habit 2: Too much context, not focused on the task, and continued in a previous chat

Run this second to show how context overload degrades results.

1. Continue in the same chat from Bad habit 1.
2. Attach the target file plus several loosely related files. Suggested extras:

- [Upload page](../src/app/upload/page.tsx)
- [Gallery page](../src/app/gallery/page.tsx)
- [GalleryGrid](../src/components/gallery/GalleryGrid.tsx)
- [Demo markdown file](../demos/features-demo.md)

3. Keep prompt requirements broad and avoid explicit scope boundaries.

Prompt example:

```text
Improve the upload tag autocomplete behavior.

Requirements:
- Show suggestions as users type in tags.
- Include matching tags like wedding and wildlife for "w".
- Keep the page working.

Use the attached files for context.
```

Observe what happens:
- More tokens used to inspect irrelevant context
- Higher chance of unnecessary changes
- More diffuse reasoning about scope

### Recommended practice 1: Providing focused context, examples, and validation steps in a new chat

Run this third. This is the recommended implementation workflow.

1. Start a new chat because this is a new topic.
2. Attach only relevant files:

- [Upload page](../src/app/upload/page.tsx)
- [mock-tag-data](../src/lib/mock-tag-data.ts)

Suggested prompt:

```text
Implement tag autocomplete for the Upload page tags input. For example, typing "w" should suggest "wedding" and "wildlife". Create a new file in the components/upload folder for the autocomplete input if needed.
```

3. After implementation, check credits again and compare to the two bad-habit runs.

### Recommended practice 2: Research, plan, and implement in separate chats

Run this fourth to practice phase separation for larger tasks.

1. **Research chat**
   - Ask: where tags are sourced, how input state is managed, and which component owns the tags field.
   - Research for yourself and provide a summary of findings with file references.
2. **Plan chat**
   - Ask for a small implementation plan with explicit file scope, edge cases, and validation checklist.
   - Use plan mode to assist with the planning phase.
3. **Implement chat**
   - Execute the approved plan with minimal context packet and strict done criteria.

Prompt starters:

```text
Research chat:
Map where tag data and tag input behavior are implemented for Upload.

Plan chat:
Create a minimal plan to add tag autocomplete without changing styling.

Implement chat:
Implement the approved plan with the validation checklist.
```

Observe what happens:
- Lower context mixing
- Cleaner decisions per phase
- Easier review and rollback if needed

## 🎯 Challenge Three: Compare outcomes and reflect

After completing Challenge Two, compare all four habit-based runs.

### Team discussion prompts

Use these questions with the group:
1. Which run was more predictable?
2. Which run took fewer turns?
3. Which run used fewer credits?
4. Which run produced the smallest correct diff?

## ✅ Key practices to keep

1. New topic -> new chat.
2. New phase -> new chat when research, planning, and implementation start to mix.
3. Select files based on scope, not convenience.
4. Prefer minimal sufficient context over vague or overloaded context.

## 🎁 Bonus Challenge: Enforce the upload size limit

Now apply the same context engineering habits to a real bug in this repo.

The Upload page tells users it **Supports JPEG, PNG, GIF, WebP up to 10MB each**. The code never enforces that limit. The UI makes a promise the code does not keep, so oversized files are accepted silently.

Your job is to make the behavior match the promise. Derive the fix yourself, the same way you would on a real ticket.

### Reproduce it first

Always see the failure before you fix it.

1. Run `npm run dev`.
2. Open the app and go to `/upload`.
3. Drop in an image larger than 10MB.
4. Observe that the file is accepted, listed with its real size, and no error is shown anywhere.

Note what you saw. That observation is part of your context packet.

### Scope your context

Attach exactly one file:

- [UploadZone](../src/components/upload/UploadZone.tsx)

That is the whole packet. This is deliberately small, consistent with **Recommended practice 1** earlier in this guide. Resist the urge to attach the upload page, the gallery, or the mock data. If the agent turns out to need more, add it then, one file at a time.

Suggested prompt:

```text
The Upload page says it supports files up to 10MB each, but oversized files are still accepted. I dropped in a file over 10MB and it was added to the list with no error.

Enforce the 10MB limit and show the user a clear reason when a file is rejected. Do not change the existing layout or styling.
```

### Definition of Done

- [ ] A file over 10MB is rejected instead of being added to the upload list
- [ ] The user is shown a clear reason for the rejection, not a silent failure
- [ ] Files under 10MB still upload exactly as before
- [ ] The existing UI and styling are unchanged

### Validate

Repeat the reproduce steps and confirm the behavior changed:

1. Run `npm run dev` and go to `/upload`.
2. Drop in an image larger than 10MB. It should be rejected with a visible, understandable message.
3. Drop in an image under 10MB. It should upload as it always did.
4. Confirm the page layout and styling look the same as before your change.

### Stretch goal

The `UploadedFile` interface already declares a `status` of `'uploading' | 'success' | 'error'`, but nothing in the component ever sets `'error'`. It is dead code waiting for a rejection path.

Explore how `react-dropzone` reports refused files and use that to surface the reason in the UI. Ask the agent to explain the option it used and why, so you understand the fix rather than just accepting it.

## Anti-Patterns to Avoid

1. Context dumping: attaching many files that do not help the decision.
2. Context mixing: research, planning, coding, debugging, and review in the same long chat.
3. Stale guidance: relying on instructions or examples that no longer match the codebase.
4. No validation: assuming the agent understood the task without checking behavior.
