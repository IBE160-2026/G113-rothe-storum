## Sesjonslogg

Når en oppgave eller økt avsluttes, før sluttoppsummeringen, bruk `sesjonslogg`-skillen: dokumenter Oppgave + Plan + Resultat + åpne punkter i `.logs/<bruker>/`, og før åpne punkter i `.logs/<bruker>/issues.md`. Skillen committer loggfila lokalt; push gjør du selv. Gruppens egne regler for commit og språk gjelder foran dette.

# Worldbound – Project Development Guidelines

## 1. Academic Assessment – IBE160

The project is developed as part of IBE160 – Programming with AI, autumn 2026.

The assessment guide is stored in:

- `.docs/reference/sensorveiledning-ibe160-del1.pdf`
- `.docs/reference/sensorveiledning-ibe160-del1.txt`

The assessment guide is an important reference throughout project development.

Read and use it when planning, implementing, reviewing and testing Worldbound.

### Assessment criteria

Del 1 accounts for 70% of the overall course grade and is assessed using seven criteria:

| Criterion | Weight |
|---|---:|
| Process and AI governance | 30% |
| Functionality and scope | 20% |
| Quality assurance and testing | 15% |
| Design and user experience | 10% |
| Code quality and architecture | 10% |
| README and runnability | 10% |
| Repository cleanliness | 5% |

The assessment guide emphasizes that process, traceability and quality assurance are essential.

Use the criteria as guidance, not as a mechanical checklist. Apply sound engineering judgement and consider the project's actual scope and ambitions.

## 2. BMAD Development Methodology

BMAD is the project's primary development methodology.

- Respect the existing BMAD structure and workflow.
- Read relevant planning artifacts before making implementation decisions.
- Maintain consistency between product brief, PRD, architecture, epics, stories and implementation.
- Keep planning artifacts updated when requirements or decisions change.
- Document important deviations from the original plans.
- Do not introduce architectural changes without understanding their impact on existing decisions.

BMAD documentation must reflect actual development decisions and work performed.

## 3. AI Governance and Traceability

The group is responsible for directing, evaluating and quality-assuring AI-assisted development.

- Document significant prompts and AI-assisted development sessions.
- Explain important technical and architectural decisions.
- Record when AI-generated suggestions are rejected, corrected or improved.
- Connect implementation work to relevant requirements and stories.
- Maintain meaningful Git commits that reflect actual development progress.
- Never invent development history, prompts, tests or decisions retrospectively.

Follow the existing session logging instructions and group conventions.

## 4. Quality Assurance and Testing

AI-generated code must be reviewed and validated.

- Test meaningful functionality, not just trivial cases.
- Run relevant automated tests after implementation changes.
- Document manual testing when automated testing is unsuitable.
- Record discovered bugs and how they were resolved.
- Check error handling, input validation and security.
- Verify that changes do not break existing functionality.

Never claim that functionality has been tested unless the tests have actually been executed.

## 5. Documentation and Repository Quality

Maintain a project that another developer can understand, run and continue developing.

- Keep README.md accurate and updated.
- Document installation, configuration, dependencies and startup commands.
- Keep architecture documentation consistent with the actual implementation.
- Maintain a clear separation between source code, documentation and resources.
- Never commit secrets, API keys or local environment files.
- Avoid unnecessary duplicate files, obsolete code and generated artifacts.

## 6. Working Principles

Before starting significant work:

1. Understand the existing project structure.
2. Read relevant BMAD documentation.
3. Identify the relevant requirements and assessment criteria.
4. Explain the proposed approach before making significant changes.

After completing significant work:

1. Verify the implementation.
2. Run relevant tests.
3. Update affected documentation.
4. Record the work using the existing session logging workflow.
5. Summarize completed work, outstanding issues and suggested next steps.

Always distinguish between:
- Explicit assessment requirements.
- Recommendations from the assessment guide.
- Technical recommendations made by Claude.

The goal is to develop a coherent, functional and well-documented application while demonstrating responsible and critical use of AI.
