---
sidebar_position: 1
---

# Tutorial Intro

Let's discover **Docusaurus in less than 5 minutes**.

## Getting Started

Get started by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Generate a new site

Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.

---

## Adding Your Project to the Documentation Hub

This documentation hub is designed to aggregate documentation from multiple software projects. If you want to include your project's documentation here, follow these steps:

### 1. Prepare Your Project (The "Child" Repository)

These steps are performed in the repository of the project whose documentation you want to add.

1.  **Create a Dedicated Documentation Folder:**
    *   In the root of your project's repository, create a folder to hold its documentation. A common name is `project-docs/` or simply `docs/`. For consistency with this hub's examples, we'll use `hw-docs/` in these instructions, but you can adapt it.
    *   Place all your project-specific documentation (in Markdown `.md` format) inside this folder (e.g., `hw-docs/introduction.md`, `hw-docs/api-guide.md`).

2.  **Set Up a Sync Workflow:**
    *   Create a GitHub Actions workflow file in your project at `.github/workflows/docs-sync.yml`.
    *   This workflow will trigger when changes are pushed to your chosen documentation folder (e.g., `hw-docs/**`).
    *   Its purpose is to send a notification to the central hub repository (`conor-hw/hw-docs`) indicating that your documentation has new updates.
    *   **Workflow Content (`.github/workflows/docs-sync.yml`):**
        ```yaml
        name: Documentation Sync to Parent Hub

        on:
          push:
            paths:
              - 'hw-docs/**' # IMPORTANT: Adjust this if your docs folder is named differently
            branches:
              - main # Or your project's primary development branch

        jobs:
          trigger-parent-sync:
            runs-on: ubuntu-latest
            steps:
              - name: Trigger Parent Repository Sync
                uses: peter-evans/repository-dispatch@v3
                with:
                  token: ${{ secrets.PARENT_REPO_TOKEN }} # See step 3 below
                  repository: conor-hw/hw-docs # Target hub repository
                  event-type: docs-update # Standard event type for this hub
                  client-payload: >-
                    {
                      "repository": "${{ github.repository }}",
                      "commit": "${{ github.sha }}",
                      "ref": "${{ github.ref }}"
                    }
        ```

3.  **Create `PARENT_REPO_TOKEN` Secret:**
    *   In your project repository's GitHub settings (`Settings` > `Secrets and variables` > `Actions`), click "New repository secret".
    *   **Name:** `PARENT_REPO_TOKEN`
    *   **Value:** Create a GitHub Personal Access Token (PAT) from an account that has permission to trigger repository dispatch events.
        *   The PAT needs the `workflow` scope to trigger workflows in the target hub (`conor-hw/hw-docs`).
        *   If the hub repository (`conor-hw/hw-docs`) were private, the PAT would also need `repo` scope (or `public_repo` if its visibility changes often). Since `conor-hw/hw-docs` is public, `workflow` scope should suffice for dispatching.
    *   Paste the generated PAT as the value for the secret.

4.  **Commit and Push:** Commit your new documentation folder (e.g., `hw-docs/`) and the `.github/workflows/docs-sync.yml` file to your project's repository.

### 2. Integrate into the Hub (The `conor-hw/hw-docs` Parent Repository)

These steps are performed by a maintainer of the `conor-hw/hw-docs` repository.

1.  **Add Your Project as a Git Submodule:**
    *   The child project repository is added as a Git submodule. This submodule will typically reside within the `website/docs/` directory of the `conor-hw/hw-docs` hub.
    *   Example command (run in the root of `conor-hw/hw-docs`):
        `git submodule add <your_project_git_url> website/docs/<your-project-name>`
        *(Replace `<your_project_git_url>` and `<your-project-name>` accordingly. `<your-project-name>` will be part of the URL path in the hub).*

2.  **Update Hub's Docusaurus Configuration:**
    *   Edit `website/docusaurus.config.js` in the `conor-hw/hw-docs` repository.
    *   A new entry is added to the `plugins` array for your project's documentation. This typically involves:
        *   A unique `id` (e.g., `yourProjectName`).
        *   The `path` to your documentation *within* the submodule structure (e.g., `docs/<your-project-name>/hw-docs` – note the `hw-docs` part if that's the folder name you used inside your project).
        *   A `routeBasePath` that defines the URL segment for your project's docs (e.g., `projects/your-project-name`).
        *   An `editUrl` that points to your project's documentation folder on GitHub, allowing users to easily suggest edits.
    *   A new link is added to the `navbar.items` array (in `themeConfig`) to make your project's documentation discoverable from the main navigation bar.

3.  **Commit and Push Hub Changes:** The changes to `.gitmodules` and `website/docusaurus.config.js` are committed and pushed to the `conor-hw/hw-docs` repository.

### 3. The Automated Update Flow

Once integrated:
1.  When you push changes to the documentation folder (e.g., `hw-docs/`) in *your* project repository, your `docs-sync.yml` workflow triggers.
2.  It sends a `repository_dispatch` event to `conor-hw/hw-docs`.
3.  The main build workflow (`.github/workflows/docs-build.yml`) in `conor-hw/hw-docs` receives this event.
4.  This workflow automatically updates its Git submodule pointer for your project to the new commit you pushed.
5.  It then commits and pushes this submodule pointer update to its own `main` branch.
6.  This new push to `conor-hw/hw-docs`'s `main` branch re-triggers the same `docs-build.yml` workflow.
7.  This second run builds the entire Docusaurus site (now including your updated documentation) and deploys it to GitHub Pages.

Your updated documentation should then be live on the central documentation hub!
