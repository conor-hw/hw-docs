# EDR: Multi-Project Documentation System

**Author(s):** Conor Breen (Representing Codefish Team)

*This EDR (Engineering Design Review) welcomes feedback and captures our best effort to describe a problem agreed on by all stakeholders and a solution that is not perfect but you believe is ideal for solving this problem.*

## 🙋 Problem Statement
Hostelworld's technical documentation is currently fragmented across multiple platforms and repositories:
1. **Repository Documentation:** Project-specific documentation scattered across individual repositories
2. **Confluence:** Team and process documentation
3. **Loop:** Additional documentation and knowledge sharing

This separation presents several significant challenges:
- **Documentation Decay:** Documentation becomes outdated quickly due to the effort required to update across multiple platforms
- **Inconsistent Practices:** Different teams maintain documentation in different ways
- **Single Source of Truth:** Difficulty in maintaining accurate, up-to-date documentation
- **LLM Integration:** Challenges in leveraging LLM capabilities effectively across fragmented documentation
- **Maintenance Overhead:** Time-consuming updates across multiple platforms

The primary goal is to create a unified, Git-centric documentation system that enables real-time updates, maintains consistency, and leverages modern documentation tools.

## ✅ Reviewers
| Approver                     | Status      |
|------------------------------|-------------|
| Codefish Team Lead           | ✏️ To review |
| SRE (John McCormack)         | ✏️ To review |
| Frontend CoP                 | ✏️ To review |
| Relevant Product Owners      | ✏️ To review |

## 🚚 Solution
The proposed solution is to implement a Git-centric documentation system with:
1. **Standardized Documentation Structure:** Each repository includes a `/docs` folder with a consistent structure
2. **Docusaurus Integration:** Modern documentation tooling with search and navigation
3. **Git Submodules:** Automated synchronization between project docs and parent documentation hub
4. **Automated Workflows:** GitHub Actions for documentation validation and sync

**Implementation Strategy:**
- Create a parent documentation repository as the central hub
- Implement standardized documentation structure in each project repository
- Set up automated sync mechanisms using Git submodules
- Deploy Docusaurus-based documentation site. The MVP will include a lean versioning strategy (e.g., "Latest" from main branches and one initial "Stable" version), with full versioning capabilities planned as a stretch goal.
- Migrate existing documentation incrementally

**Planned Project Folder Structure:**
```
docs-parent/                    # Parent documentation repository
├── website/                   # Docusaurus site
│   ├── src/
│   │   ├── pages/            # Main pages
│   │   └── components/       # Custom components
│   ├── docs/                 # Main documentation
│   │   ├── project-a/       # Project A docs (submodule)
│   │   ├── project-b/       # Project B docs (submodule)
│   │   └── shared/          # Shared documentation
│   ├── docusaurus.config.js # Docusaurus configuration
│   └── package.json
├── .github/                  # CI/CD workflows
└── README.md

project-repository/           # Individual project repository
└── docs/
    ├── project-info.md      # Project metadata
    ├── environments/        # Environment documentation
    ├── team/               # Team information
    └── custom/             # Project-specific documentation
```

## 🚚 Discarded Solutions
1. **Maintain Current Structure:**
   * *Reason for Discarding:* Current system leads to documentation decay and inconsistency
2. **Centralized Confluence:**
   * *Reason for Discarding:* Doesn't integrate well with development workflow and LLM tools
3. **Separate Documentation Repositories:**
   * *Reason for Discarding:* Creates additional maintenance overhead and doesn't solve the sync problem
4. **VuePress:**
   * *Reason for Discarding:* Docusaurus offers better versioning, search capabilities, and long-term support

## 🎯 Scope
| Category        | Details                                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **Must Have**   | - Standardized documentation structure in all repositories                                                                           |
|                 | - Automated sync mechanism between project docs and parent hub                                                                        |
|                 | - Docusaurus-based documentation site with search and navigation                                                                      |
|                 | - Basic versioning implementation (e.g., "Latest" from main branches and one initial "Stable" version)                                |
|                 | - Documentation validation and quality checks                                                                                         |
|                 | - Clear migration path for existing documentation                                                                                     |
| **Stretch Goals** | - AI-powered documentation suggestions                                                                                               |
|                 | - Automated documentation generation                                                                                                  |
|                 | - Interactive documentation features                                                                                                  |
|                 | - Advanced analytics and usage tracking                                                                                               |
|                 | - Comprehensive multi-version support and management                                                                                  |
|                 | - NPM package for easy project integration                                                                                            |
| **Not in Scope**| - Migration of non-technical documentation                                                                                           |
|                 | - Major redesign of existing documentation                                                                                            |
|                 | - Integration with external documentation systems                                                                                     |

## 🎉 Operational Plan
- **Infrastructure:** 
  - GitHub repositories for documentation
  - GitHub Actions for automation
  - Docusaurus for documentation site
  - Git submodules for sync

- **Deployment Strategy:**
  - **Child Repository Workflow:**
    ```yaml
    # .github/workflows/docs-sync.yml in child repository
    name: Documentation Sync
    on:
      push:
        paths:
          - 'docs/**'
        branches:
          - main

    jobs:
      trigger-parent-sync:
        runs-on: ubuntu-latest
        steps:
          - name: Trigger Parent Repository Sync
            uses: peter-evans/repository-dispatch@v2
            with:
              token: ${{ secrets.PARENT_REPO_TOKEN }}
              repository: hostelworld/docs-parent
              event-type: docs-update
              client-payload: '{"repository": "${{ github.repository }}", "commit": "${{ github.sha }}"}'
    ```

  - **Parent Repository Workflow:**
    ```yaml
    # .github/workflows/docs-build.yml in parent repository
    name: Documentation Build and Deploy
    on:
      repository_dispatch:
        types: [docs-update]
      push:
        paths:
          - 'website/**'
        branches:
          - main

    jobs:
      update-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v2
            with:
              submodules: true
              token: ${{ secrets.GITHUB_TOKEN }}

          - name: Update Submodules
            run: |
              git submodule update --remote --merge
              git config --global user.name "GitHub Action"
              git config --global user.email "action@github.com"
              git add .
              git commit -m "Update documentation from child repositories" || echo "No changes to commit"
              git push

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: '16'

          - name: Install Dependencies
            run: |
              cd website
              npm install

          - name: Build Documentation
            run: |
              cd website
              npm run build

          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v3
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./website/build
    ```

  - **Deployment Flow:**
    1. Developer updates documentation in child repository
    2. Child repository workflow triggers parent repository sync
    3. Parent repository:
       - Updates submodules
       - Builds documentation
       - Deploys to GitHub Pages
    4. Changes are live within minutes

  - **Monitoring and Validation:**
    - GitHub Actions status checks
    - Build success/failure notifications
    - Documentation preview URLs
    - Deployment status tracking

## ⚠ Risks, Security and Dependencies
- **Risks:**
  - **Team Adoption:** Resistance to new documentation workflow
  - **Sync Conflicts:** Potential issues with automated sync
  - **Migration Complexity:** Challenges in migrating existing documentation
  - **Performance:** Documentation site performance with large content
  - **React Learning Curve:** Team adaptation to React-based Docusaurus
  - **Deployment Failures:** Potential issues with GitHub Actions workflows

- **Security:**
  - Repository access controls
  - Documentation access levels
  - Content validation
  - API key management
  - Algolia search API security
  - GitHub Actions token security
  - Submodule update security

- **Dependencies:**
  - GitHub infrastructure
  - Docusaurus and React ecosystem
  - Team availability for migration
  - Existing documentation quality
  - Algolia search service

## 🔓 QA Plan
- **Pre-Migration Analysis:**
  - Documentation audit
  - Quality assessment
  - Migration planning

- **Testing:**
  - Sync mechanism validation
  - Documentation site testing
  - Performance testing
  - Cross-browser testing
  - Search functionality testing
  - Versioning system validation

- **Validation:**
  - Content accuracy
  - Link validation
  - Search functionality
  - Navigation testing
  - React component testing

## Cost Plan
- **Development Costs:**
  - Initial setup and configuration
  - Migration effort
  - Training and support
  - React/Docusaurus training

- **Infrastructure Costs:**
  - GitHub repository space
  - CI/CD minutes
  - Hosting costs
  - Algolia search service

- **Long-term Benefits:**
  - Reduced maintenance overhead
  - Improved documentation quality
  - Better team efficiency
  - Enhanced LLM integration
  - Better search capabilities

## 📦 NPM Package Strategy

### Package Structure
```
@hostelworld/docs-hub/
├── bin/
│   └── setup.js           # CLI setup script
├── templates/
│   ├── child/            # Child repository templates
│   │   ├── docs/
│   │   └── workflows/
│   └── parent/           # Parent repository templates
│       ├── website/
│       └── workflows/
├── src/
│   ├── generators/       # Code generators
│   ├── validators/       # Documentation validators
│   └── utils/           # Utility functions
└── package.json
```

### Usage Example
```bash
# Install the package
npm install @hostelworld/docs-hub

# Initialize documentation in a child project
npx docs-hub init-child

# Initialize parent documentation hub
npx docs-hub init-parent

# Add a child project to parent
npx docs-hub add-child <child-repo-url>
```

### Package Features
1. **CLI Commands**
   ```javascript
   // docs-hub.config.js
   module.exports = {
     projectName: 'my-project',
     documentationPath: 'docs',
     parentRepo: 'org/docs-parent',
     templates: {
       // Custom templates
     }
   }
   ```

2. **Automated Setup**
   - Creates documentation structure
   - Sets up GitHub Actions
   - Configures Docusaurus
   - Initializes Git submodules

3. **Validation Tools**
   - Documentation structure validation
   - Link checking
   - Markdown linting
   - Custom rule validation

4. **Integration Helpers**
   - GitHub Actions workflow generation
   - Docusaurus configuration
   - Search setup
   - Versioning configuration

### Implementation Plan
1. **Phase 1: Core Package**
   - Basic CLI setup
   - Template generation
   - GitHub Actions setup
   - Documentation validation

2. **Phase 2: Enhanced Features**
   - Custom template support
   - Advanced validation rules
   - Search integration
   - Versioning support

3. **Phase 3: Integration Features**
   - CI/CD pipeline integration
   - Analytics integration
   - LLM integration
   - Custom plugin support

### Benefits
- **Standardization:** Enforces consistent documentation structure
- **Automation:** Reduces setup time and manual configuration
- **Maintenance:** Centralized updates and improvements
- **Scalability:** Easy to add new projects
- **Quality:** Built-in validation and best practices

### Example Implementation
```javascript
// In child project
const { DocsHub } = require('@hostelworld/docs-hub');

const hub = new DocsHub({
  projectName: 'my-project',
  parentRepo: 'org/docs-parent'
});

// Initialize documentation
hub.initChild();

// Add new documentation
hub.addDoc({
  title: 'API Documentation',
  path: 'api/README.md',
  content: '# API Documentation\n\n...'
});

// Validate documentation
hub.validate();
```

## ❔ FAQ
- **Q: How will teams maintain documentation in their repositories?**
  A: Teams will follow standardized documentation structure and use automated tools for validation and sync.

- **Q: What happens if sync conflicts occur?**
  A: Automated conflict resolution will be implemented, with manual review for complex cases.

- **Q: How will existing documentation be migrated?**
  A: Documentation will be migrated incrementally, with automated tools and manual review.

- **Q: How will the team handle the React learning curve?**
  A: Basic React training will be provided, and Docusaurus's documentation-first approach minimizes the need for complex React knowledge.

- **Q: How does the deployment process work?**
  A: When documentation is updated in a child repository, it triggers a GitHub Action that notifies the parent repository. The parent repository then updates its submodules, rebuilds the documentation, and deploys the changes automatically.

- **Q: What happens if a deployment fails?**
  A: The GitHub Actions workflow includes error handling and notifications. Failed deployments are logged and can be retried. The previous version remains live until a successful deployment is completed.

- **Q: How will the NPM package help with documentation management?**
  A: The package will provide a standardized way to set up and manage documentation across projects, with built-in validation, automation, and best practices.

- **Q: Can the package be customized for different project needs?**
  A: Yes, the package will support custom templates, validation rules, and configuration options to adapt to different project requirements.

## 🧾 ADR (Architectural Decision Records)
*Key decisions to be documented as the project progresses:*
- Choice of Docusaurus as documentation tool
- Git submodule implementation details
- Documentation structure standards
- Sync mechanism design
- Validation and quality check implementation
- Migration strategy and tools
- Search implementation with Algolia
- Versioning strategy: MVP to include lean versioning (e.g., "Latest" and one initial "Stable" version), with full multi-version support as a stretch goal.
