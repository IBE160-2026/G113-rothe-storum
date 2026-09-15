# Addendum: WORLDBOUND: NOMAD

Supporting depth pulled from `.docs/worldbound-grunnlag.md` and the IBE160 requirements. This material belongs to downstream work — architecture, sprint planning, UX, and the reflection report — rather than the executive brief itself. Nothing here is a locked decision.

## Candidate technology direction (input to Architecture — not decided)

The source document lists a provisional direction, explicitly pending detailed system requirements:

- Claude / Claude Code — AI-assisted programming and dev support
- Visual Studio Code — development environment
- Git + GitHub — version control, collaboration, traceability
- Node.js + npm — JS/TS web application layer
- Python + uv — possible backend, data handling, simulation
- Docker — reproducible/consistent dev environment
- Supabase — database, auth, player-data storage

`bmad-architecture` should treat this as a starting point to validate against actual requirements, not a foregone conclusion.

## AI-agent development team (process design input)

The source material sketches specific agent roles for the development process itself:

- **System architect** — plans system structure, components, data flow, architecture
- **Programming agent** — writes/implements code from requirements and specs
- **Test agent** — builds and runs tests, finds bugs, proposes fixes
- **Code-review agent** — evaluates AI-generated code for quality, structure, security, improvement opportunities
- **Content agent** — helps develop destinations, quiz content, tasks
- **Documentation agent** — documents the system, the development process, and key technical decisions

Across all roles, the human team retains control of requirements, system choices, code-review judgment, testing, approval, prioritization, and quality assurance. This maps directly to the reflection report's requirement to show how AI was used and how output was quality-assured.

## Draft phased build sketch (input to Sprint Planning — not a commitment)

The source document proposes six phases, each testable before the next is built:

1. **Core system** — project structure, player, economy, map
2. **Travel mechanics** — destinations, transport, costs, time
3. **Game mechanics** — work, tasks, quiz, inventory, progression
4. **Persistence** — database, save, player profile, travel journal
5. **Testing & QA** — automated tests, manual testing, code review, debugging, stabilization
6. **AI functionality** — possible AI travel assistant, situation analysis, recommendations

This should be treated as a rough shape for `bmad-sprint-planning` / epic breakdown, not a fixed roadmap — it predates the PRD and architecture work that will actually determine sequencing.

## Ethics, legal, and quality considerations (input to the reflection report)

- **Ownership/copyright** of AI-generated code, text, and graphics, and of any third-party libraries used
- **Correctness risk**: AI output can look right while being wrong — factual errors about countries/cultures, hidden code bugs, incomplete solutions, false assumptions
- **Bias risk**: AI-generated content (destination descriptions, quiz content) can carry cultural stereotypes or skew
- **Human accountability**: regardless of how much AI contributes, the team remains responsible for final code, quality, testing, content, technical choices, and the finished product
- **Inspiration vs. copying**: the product must remain independently developed — own code, graphics, text, and content — relative to Backpacker 2 and similar games

## Central research questions (for the reflection report)

Drawn directly from the source document's framing of what the project is meant to investigate:

- How well does AI-generated code function within a larger software system?
- What happens when several AI-generated modules have to work together?
- What errors and limitations arise?
- How much human testing and control is actually necessary?
- How can code quality be assured when AI is used actively?
- How can Git be used to make AI-assisted development traceable?
- When is AI an effective development tool — and when does it create more work than it saves?

## Visual/brand direction (input to UX work)

World map, compass, travel routes, planes/transport, passport and travel stamps, destinations, backpacking, adventure and exploration — combining a sense of travel/adventure with a modern digital/tech feel. Logo and visual identity should carry across the app, any presentation materials, and documentation. Not yet developed — input for `bmad-ux`.

## Course learning-outcome mapping (for reflection-report framing)

The source document ties the project to IBE160's learning outcomes across three categories — useful scaffolding when writing the reflection report:

- **Knowledge**: AI-assisted programming; capabilities/limits of AI-generated code; the full requirements-to-software process; ethical and legal issues
- **Skills**: configuring a dev environment; writing detailed system specs; using AI for programming; evaluating/debugging AI-generated code; integrating modules into a larger system; testing and optimizing; using Git/GitHub
- **General competence**: judging when AI is the right tool; developing software under human control; understanding AI's strengths and limits; collaborating on a complex project; explaining technical and AI-related choices to others
