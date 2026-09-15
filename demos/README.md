# Demo Guides for Photo Gallery & Portfolio

This folder contains step-by-step demo guides for learning and practicing GitHub Copilot features in the Photo Gallery & Portfolio application. Each demo builds on the previous one, helping you master Copilot’s capabilities in a real-world Next.js project.

## Before you start

- **Work from your own repository.** This project is commonly used as a fork. Where a guide refers to the Agents tab, Pull requests, or Issues, navigate from your own repo rather than following a link to another org. Run `gh repo view --json nameWithOwner,url` to confirm which repo you are on.
- **Issues must be enabled.** Three steps create or open GitHub issues: the MCP exercise in [customize-copilot-classic.md](customize-copilot-classic.md), Step 1 of [cloud-agent-classic.md](cloud-agent-classic.md), and the `/create-issue` step in [cloud-agent.md](cloud-agent.md). Forks have Issues disabled by default. Check with `gh repo view --json hasIssuesEnabled`; if it returns `false`, enable it under Settings -> General -> Features -> Issues, or skip those three steps.
- **Exception:** [copilot-spaces.md](copilot-spaces.md) deliberately links to issues in the upstream `ps-copilot-sandbox` repository. Those are read-only reference sources for a Copilot Space and are meant to stay as they are.

## Current UI landmarks

- Use the header **Upload** link or the Admin **Upload Photos** quick action to open `/upload`. The home-page **Quick Upload** section is a separate inline drop zone.
- The **Tags (comma-separated)** field used in Engineering Practices is under `/upload` → **Upload Settings**.
- `/gallery` has Search, Filters, and working Grid/List controls. Gallery exercises must preserve both layouts.
- Admin **Recent Galleries** has no View All link because `/admin/galleries` does not exist.

## Recommended Demo Sequence & Descriptions

### Agenda planning

| Guide | Recommended allocation |
| --- | --- |
| Features | 20-30 minutes |
| Engineering Practices | 30-40 minutes, plus 15 minutes for the bonus |
| Customize Copilot (including optional Hooks) | 35-50 minutes |

Hooks, Cloud Agent, and Stacked Pull Requests are optional extensions, not part of the recommended sequence. Allow extra time for any optional exercises, discussion, transitions, and breaks.

### 1. Features Demo ([features-demo.md](features-demo.md))
**Overview:**  
Start here with the recommended features challenge. Improve gallery modal behavior while trying Copilot, Copilot Chat, or the Copilot App.  
**Key Skills:**  
- Use inline suggestions and Next Edit Suggestions
- Plan and implement changes with Copilot Chat
- Try the Copilot App workflow
- Review AI-generated changes

---

### 2. Engineering Practices Demo ([engineering-practices.md](engineering-practices.md))
**Overview:**  
Practice context engineering as a repeatable system. Compare vague, overloaded, focused, and phase-separated approaches for the same upload tag autocomplete task.  
**Key Skills:**  
- Track credit usage
- Start fresh chats for new topics
- Select focused task context
- Compare outcomes across context strategies

---

<a id="3-customize-copilot-demo"></a>

### 3. Customize Copilot Demo
**Overview:**  
Choose a standalone exercise or complete the three-exercise recommended customization sequence. Each exercise has its own Markdown file and retains the original prompts and references, with its own prerequisites and completion checks. No exercise requires output from another.

1. [Custom Instructions](custom-instructions.md) — compare instruction-driven UploadZone plans.
2. [Custom Agent](custom-agent.md) — compare Blueprint Mode with default Agent mode.
3. [Custom Skill](custom-skill.md) — generate a test plan and scaffolding with the Jest skill.

**Key Skills:**  
- Compare instruction-driven outputs
- Use specialized agent modes
- Apply skills-style workflows

---

## Optional Demo Sequence & Descriptions

### 1. Hooks ([hooks.md](hooks.md))
**Overview:**
Identify an intentional broken link with the Fix Broken Links hook.
**Key Skills:**
- Run hook-based checks
- Review broken-link reports

---

### 2. Stacked Pull Requests ([stacked-pull-requests.md](stacked-pull-requests.md))
**Overview:**
Ask Copilot in VS Code Agent mode to create a two-PR stack: extract the shared photo actions, then add Like/Unlike tooltips in a dependent PR. Uses GitHub's stacked pull requests feature (public preview) via the `gh stack` CLI extension. Verify the PR branches, the incremental diff, and that GitHub registered a real stack object.
**Key Skills:**
1. Split a refactor and a small feature into focused PRs.
2. Create a real stack with `gh stack`, not just chained base branches.
3. Review incremental diffs and merge bottom-up.

---

### 3. Cloud Agent Demo ([cloud-agent.md](cloud-agent.md))
**Time allocation:** 15 minutes hands-on; 30-45 minutes elapsed.

**Overview:**  
Use Copilot in GitHub to generate a standup report, create a feature issue, and review cloud agent output.  
**Key Skills:**  
- Generate activity reports with `/chronicle standup`
- Create issues with `/create-issue`
- Assign Copilot to implementation work
- Review Copilot-generated pull requests and sessions

---

### 4. Features Demo ([features-demo-classic.md](features-demo-classic.md))
**Overview:**  
Start here to explore Copilot’s core features. Learn how to use chat commands, generate code, and review AI suggestions.  
**Key Skills:**  
- Discover available Copilot commands  
- Get project summaries and code explanations  
- Plan and implement project improvements
- Generate and review code completions  
- Commit changes with Copilot

---

### 5. Engineering Practices Demo ([engineering-practices-classic.md](engineering-practices-classic.md))
**Overview:**  
Dive deeper into professional Copilot tools for teams. Inspect Copilot interactions, export and import agent debug sessions, and explore system prompts for consistent code generation.
**Key Skills:**  
- Debug Copilot interactions
- Export/import agent debug sessions
- Understand and manage system prompts  
- Collaborate using shared conversations

---

### 6. Customize Copilot Demo ([customize-copilot-classic.md](customize-copilot-classic.md))
**Overview:**  
Learn advanced customization techniques. Monitor AI credit usage, switch models, use prompt files, experiment with custom agent modes, and set up custom instructions for your team.
**Key Skills:**  
- Track Copilot AI credit usage
- Switch between AI models  
- Create and use prompt files  
- Utilize custom agent modes, custom instructions, and MCP servers

---

### 7. Copilot Spaces Demo ([copilot-spaces.md](copilot-spaces.md))
**Overview:**  
Collaborate in dedicated Copilot Spaces. Create a Space, set goals, add context files, and work together to implement new features with AI assistance.  
**Key Skills:**  
- Create and manage Copilot Spaces  
- Set development goals  
- Collaborate and share progress  
- Implement and test new features

---

### 8. Cloud Agent Demo (original guide) ([cloud-agent-classic.md](cloud-agent-classic.md))
**Overview:**  
Experience GitHub Copilot as a cloud agent to accelerate building and enhancing features in your Photo Gallery & Portfolio application.  
**Key Skills:**  
- Assign Copilot to GitHub issues  
- Review Copilot-generated pull requests and session details  
- Practice collaborative code review and iteration  

---

## How to Use These Demos

1. Start with the recommended sequence unless your instructor directs you to the optional guides.
2. Follow the instructions and prompts in each file.
3. Mark off completion checklists as you progress.
4. Share your learnings and results with your team.

---