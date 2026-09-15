# Photo Gallery & Portfolio

A professional photo gallery and portfolio application built with Next.js 15, TypeScript, and Tailwind CSS. This project is designed for **demoing GitHub Copilot features** in a real-world, component-driven Next.js application. The included demos showcase how Copilot can assist with code generation, refactoring, UI building, and more.

## Demos

- All demo guides and examples are in the [`demos/`](demos/) folder.
- For more information about each demo, refer to the [README](demos/README.md) file in the `demos/` directory.
- To get started, check out the recommended first demo [`features-demo-option-2.md`](demos/features-demo-option-2.md) for a walkthrough of gallery features and Copilot capabilities.

### Demo Tracks

Recommended guides:

1. [Features Demo](demos/features-demo-option-2.md)
2. [Engineering Practices Demo](demos/engineering-practices-option-2.md)
3. [Custom Instructions](demos/custom-instructions-option-2.md)
4. [Custom Agent](demos/custom-agent-option-2.md)
5. [Custom Skill](demos/custom-skill-option-2.md)

Optional guides:

- [Hooks](demos/hooks-option-2.md)
- [Cloud Agent Demo](demos/cloud-agent-option-2.md)
- [Features Demo](demos/features-demo.md)
- [Engineering Practices Demo](demos/engineering-practices.md)
- [Customize Copilot Demo](demos/customize-copilot.md)
- [Copilot Spaces Demo](demos/copilot-spaces.md)
- [Cloud Agent Demo (original guide)](demos/cloud-agent.md)
- [Stacked Pull Requests exercise](demos/engineering-practices-option-2.md#optional-exercise-stacked-pull-requests)

### Current Application Routes

| Route | Current UI |
| --- | --- |
| `/` | Header navigation, feature cards, an inline **Quick Upload** drop zone, and **Recent Uploads** with a **View All** link to `/gallery` |
| `/gallery` | Photo search, tag filters, working **Grid view** and **List view** controls, photo action controls, and **View Details** |
| `/upload` | The full upload zone plus **Upload Settings**, including the **Tags (comma-separated)** field used by the Engineering Practices demo |
| `/admin` | Stats, an **Upload Photos** quick-action link to `/upload`, display-only Manage Clients and Settings cards, and the Recent Galleries table |

The header **Upload** link and Admin **Upload Photos** card both open `/upload`. The home-page **Quick Upload** section uploads files in place and does not contain the Upload Settings form. On Gallery cards, Like is wired; Download and Share are visible exercise targets. There is no `/admin/galleries` route or Recent Galleries **View All** link.

### Creating a New Demo

If you want to contribute and create a new demo, follow these steps:

1. Open GitHub Copilot Chat.
2. Type the prompt `/create-copilot-demo` with an explanation of your demo idea.
3. Copilot will generate a new demo file in the `demos/` directory.
4. Fill in remaining sections with detailed instructions, examples, and expected results.

After finishing the demo, don't forget this quick follow-up:

1. Add in the overview, key skills, and demo link to the [demo README](demos/README.md)

## Getting Started

### Technical Requirements

- **Node.js** v18 or newer
- **npm** (or yarn, pnpm, bun)

### Quick Start with GitHub Codespaces

The fastest way to get started is using GitHub Codespaces:

1. Click the **"Code"** button on the GitHub repository page
2. Select the **"Codespaces"** tab
3. Click **"Create codespace on main"** (or your current branch)
4. Wait for the codespace to build and start

The codespace will automatically:
- Install all dependencies (`npm install`)
- Start the development server (`npm run dev`)
- Configure GitHub Copilot and essential VS Code extensions
- Forward port 3000 for the Next.js application

Once ready, you can access the application at the forwarded port URL provided in the terminal.

### Local Installation

1. Clone the repository (replace `<repository-url>` with the clone URL of this repository or your own fork):
   ```bash
   git clone <repository-url> gallery-repo
   cd gallery-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```bash
src/
├── app/                 # Next.js 15 App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and helpers
demos/                   # Demo guides and templates
```