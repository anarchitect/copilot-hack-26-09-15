# Exercise: Features

Welcome to this repository! You're probably wondering what it is and how it works. We will be working with this repository for the duration of this training, so it's important to find out what it's doing now!

## What You'll Learn
By the end of this demo, you will:
- [ ] Understand GitHub Copilot's core features
- [ ] Be able to generate code with AI assistance
- [ ] Plan and implement changes using AI assistance
- [ ] Know how to review and commit AI-generated code

**Estimated Time:** 20-30 minutes

## 🚀 Getting Started

More information on installation can be found in the [README](../README.md) file.

## 🎯 Challenge One: Improve gallery modal UX

For this challenge, we will improve the photo detail modal behavior in [GalleryGrid](../src/components/gallery/GalleryGrid.tsx). The goal is to make the modal feel polished and easier to use.

You have two options for how to implement this challenge in your editor. Feel free to get creative and use the option that best suits your workflow. You can also combine options if you like.

There is a third way — the desktop **GitHub Copilot app** — covered in its own guide, [GitHub Copilot App](copilot-app.md), which picks up this same task in Scenario A and then goes further into canvases and agent merge.

**Definition of Done**
- Go to the gallery page after running the app locally.
- Complete the checks in both **Grid view** and **List view**:
  - [ ] Select **View Details** on a photo.
  - [ ] Press Escape closes the modal.
  - [ ] Click outside the modal content closes it.
  - [ ] The page cannot scroll while the modal is open.
- [ ] Search, Filters, and the Grid/List toggle still work after the change.

### Option 1: Copilot

Use inline suggestions to scaffold a few small UX improvements.

**Features to use**
- Inline suggestions
- Next edit suggestions

**Tips to complete:**

1. Open [GalleryGrid](../src/components/gallery/GalleryGrid.tsx) and scan where `selectedPhoto` controls the modal open/close state.
2. Add a short intent comment immediately below the `selectedPhoto` and `likedPhotos` state declarations (for example: `// Close modal on Escape and disable page scroll while modal is open`) and pause for an inline suggestion before typing more.

> **_NOTE_** If it doesn't appear, try typing a few more words or pressing Enter to trigger it. like `useEffect(() => {` and pause for a suggestion._

3. Find where the modal is rendered and add a short intent comment (for example: add comment `{/* Close modal on backdrop click */}`) in the empty space after `{/* Photo Detail Modal - Placeholder for future implementation */}` and pause for an inline suggestion before typing more.

> **_NOTE_** If it doesn't appear, try typing a few more words or pressing Enter to trigger it. like `onClick={() => {` and pause for a suggestion.

4. Implement one behavior at a time and use **Next Edit Suggestions** after each accepted change to jump to the next likely edit (Escape handling, then backdrop click, then scroll lock).
5. Keep this challenge behavior-only: reject suggestions that change modal text, card layouts, Search, Filters, or Grid/List behavior, then test all requirements after each accepted edit.

### Option 2: Copilot Chat

Use Chat to plan and implement the exact same fix.

**Features to use**
- Plan mode
- Agent mode
- Model picker
- Auto model selection

**Tips to complete:**

- Change agent to _Plan mode_ or _Agent mode_
  - Use whichever mode you're most unfamiliar with to plan or implement the changes.
- Use _'Auto model selection'_ to pick the best model for the task or a model you want to try out.

_Suggested prompt_

```text
In GalleryGrid.tsx, improve the photo detail modal UX:
1) close on Escape,
2) close on backdrop click,
3) disable page scroll while modal is open.
Please keep the current UI and content unchanged.
The same modal is opened from both Grid view and List view, so preserve and verify both layouts.
```

## 🎯 Challenge Two: Review your work

### Option 1: Inline AI-Powered Review

1. **Select generated code:** Highlight the code that was created
2. **Get review** Right-click → Select "Review"
3. **Process feedback:** Review suggestions and accept/discard as needed

### Option 2: Source Code AI-Powered Review

1. **Select Source Control in the Activity Bar:** Click the Source Control icon in the left sidebar to open the source control panel.
2. **Start review:** At the top of the Source Control view, hover over CHANGES, then click the `Code Review - Unstaged Changes` button. _See image below for reference_

![Code review button](/demos/images/code-review.png)

3. **View comments:** If Copilot has any comments, they will be shown inline in your file(s), and in the Problems tab.

## ✅ Completion Checklist

Mark off each item as you complete it:

- [ ] Implement modal UX improvements in GalleryGrid.tsx
- [ ] Review your work using Copilot's AI-powered review features
- [ ] Tested new Copilot features you were not familiar with before this demo
