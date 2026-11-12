# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G113 – G113-rothe-storum |
| **PRD vurdert** | `.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md` (status `final`, sist endret 2026-10-14, commit f39a03b), lest sammen med `addendum.md` |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

Dette er en sterk PRD med egen tese, konkrete regler og testbare konsekvenser under nesten hvert FR. Valg og avveininger er synlige (§9.3 og §9.5), og scope er ærlig. Største risiko er at kjernespillet ikke leverer avveiningen mellom tid og penger som visjonen lover, og at noen få detaljer i bykortet ("city day") og i UJ-3 må strammes inn før stories skrives.

## 2. Dette fungerer godt

- **Regler med tall som kan kontrolleres.** UJ-1 og UJ-2 stemmer med addendumets priser og ruter (Ingrid ender med €423 etter 16 dager, Jonas med €20 før "Call home"). Dermed kan de brukes direkte som akseptansetester. Det er en klar oppfølging av briefen-tilbakemeldingens ønske om konkrete regler.
- **Ærlige beslutninger.** §9.3 "Decision: Time in the Core" sier hva dere gir opp ("a core where time already hurts") og når dere vil vurdere det på nytt. §9.5 A–E begrunner hvorfor Bergen bare er start og slutt. Addendum §6 dokumenterer en balansekontroll, og SM-3 gjør den til en automatisk test.
- **KI og kvalitetssikring er tatt på alvor.** NFR-1 (determinisme), NFR-2 (regler adskilt fra UI), NFR-3 (ingen nøkler, mock i tester) og NFR-8 (faktasjekk og kildekrav) gjør innholdet og reglene kontrollerbare. Ingen KI i selve appen er en bevisst og dokumentert avgrensning.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet | sterk | Beslutninger A–E og §9.3 viser hva som er valgt og gitt opp. Åpne spørsmål (§11) er reelt åpne. |
| Substans | sterk | Personaer erstattet av tre reiser som styrer regler (call home, arbeid). NFR-ene har spillspesifikke terskler (375 px, 44 px). |
| Strategisk sammenheng | god | Tydelig tese om tid mot penger, men kjernen når den bare delvis (se 4.1). |
| Testbarhet | sterk | Nesten alle FR-er har konkrete konsekvenser. Små hull i dekning (se 4.5). |
| Scope og avgrensning | sterk | Kjerne/utvidelse med rekkefølge, Non-Goals, motmål (SM-C1–C3). Innholdsmengden i utvidelsen er tung (se 4.3). |
| Brukbarhet for neste fase | god | Glossar og ID-er holder. Rekkefølge av handlinger i bykortet og UJ-3 må strammes (4.2, 4.4). |
| Formtilpasning | sterk | Brukerreiser med navngitte hovedpersoner passer for et spill. Ingen unødvendige bedriftsseksjoner. |

## 4. Viktigste forbedringer

### 4.1 Kjernen leverer ikke avveiningen "tid mot penger"
- **Alvorlighet:** høy
- **Hvor:** §1 ("the plane is fast and expensive, the bus is cheap and slow") mot §9.3 ("winning journeys use 14–16 of 30 days, and money is the binding constraint") og Open Question 1 (Tokyo og Sydney inngår ikke i noen vinnende kjernereise).
- **Problem og hvorfor det betyr noe:** Når bare 14–16 av 30 dager brukes, er bussen nesten alltid riktig valg der den finnes. Da er flyet ikke et reelt alternativ i kjernen. I tillegg er to av åtte destinasjoner (og fire av 16 severdigheter) uten vinnerreise. Dere har sett dette selv, men SM-2 måler bare om spillerne kan fullføre, ikke om de merker klokka. Utløseren "if players never feel the clock" kan dermed aldri utløses.
- **Forslag:** Legg til en observerbar playtest-måling, for eksempel: "SM-2b: minst 3 av 5 playtestere sier at de minst én gang valgte dyrere og raskere transport (eller billigere og tregere) på grunn av dagene". Bestem også spaken på forhånd, for eksempel at balansetesten kjøres med 21 dager og at dere velger 21 hvis færre enn tre ulike femstemplers-sett overlever.

### 4.2 Status `final` med uløste punkter og en UJ som ikke går opp
- **Alvorlighet:** medium
- **Hvor:** UJ-3 ("Sydney costs €300", "With €336 she can now afford Sydney") og Open Question 5; §2.4 ("illustrative `[ASSUMPTION]` … to be confirmed by the team").
- **Problem og hvorfor det betyr noe:** UJ-3 er den eneste reisen som viser arbeid, og dere skriver selv at Amira kommer til Sydney med €36, mindre enn en bydag (€85). Stories og tester for FR-15 vil hente eksempeltall herfra. Reisene er heller ikke bekreftet av teamet.
- **Forslag:** Rett eksempelet: "Amira jobber to skift (4 rette = €96, 5 rette = €120). Hun har €456, flyr til Sydney (€300) og har €156, nok til en bydag (€85)." Når dette er rettet og UJ-ene er bekreftet, kan dere stryke forbeholdet i §2.4 og Open Question 5, eller sette status til `draft` til det er gjort.

### 4.3 Innholdsmengden i utvidelsen er tung for to personer
- **Alvorlighet:** medium
- **Hvor:** FR-19 ("150 questions in total"), NFR-8 (faktasjekk og stereotypigjennomgang av hver), Open Question 3 ("Who writes and fact-checks …").
- **Problem og hvorfor det betyr noe:** Arbeid er første planlagte utvidelse og krever 8 × 15 = 120 kontrollerte spørsmål før det gir mening. Uten eierskap og minimum blir "Work" en flaskehals som blokkerer lagring og Nomad.
- **Forslag:** Gjør arbeid tilgjengelig per destinasjon. Eksempel for FR-15: "Work is only offered at a destination whose full question sequence is merged and reviewed." Da kan dere levere arbeid trinnvis, og testene kan bruke små testsekvenser (NFR-7). Avklar Open Question 3 før epics.

### 4.4 Rekkefølgen i en bydag er uklar, og FR-21 og FR-22 sier litt ulikt
- **Alvorlighet:** medium
- **Hvor:** FR-8, FR-21 ("money left after the city day's accommodation price") og FR-22 ("revisiting a sight adds nothing and costs nothing extra" mot `[ASSUMPTION]` "an already visited sight is not offered again").
- **Problem og hvorfor det betyr noe:** Arkitektur og stories må vite når overnatting betales, når dagen går, når stemplet gis, og når sightseeing er stengt. Teksten antyder at overnatting betales først, men sier det ikke. "Costs nothing extra" antyder at man kan velge en besøkt severdighet på nytt, mens antakelsen sier det motsatte.
- **Forslag:** Definer bydagen som en sekvens: "1) spilleren velger bydag, overnatting trekkes, dagen og stemplet registreres; 2) spilleren kan kjøpe 0–2 severdigheter; 3) spilleren reiser videre eller avslutter. Etter steg 3 kan ingen severdighet kjøpes." Skriv FR-22 slik: "En besøkt severdighet tilbys ikke igjen i samme reise."

### 4.5 Reglene i FR-4 er utenfor testomfanget
- **Alvorlighet:** lav
- **Hvor:** NFR-2 ("FR-1, FR-6 – FR-18, FR-21 – FR-23") og SM-1 ("FR-1, FR-6 – FR-14 …") utelater FR-4.
- **Problem og hvorfor det betyr noe:** FR-4 inneholder regellogikk: utilgjengelig-med-årsak og advarselen når veien hjem ikke rekker. Det er nettopp slik logikk som bør testes automatisk, men den faller utenfor begge lister.
- **Forslag:** Ta FR-4 inn i NFR-2 og SM-1 (FR-2, FR-3 og FR-5 kan bli i UI-testing).

## 5. Mekaniske funn

- ID-ene er unike og krysshenvisningene løser seg, men FR-21 og FR-22 står mellom FR-9 og FR-10, og FR-23/FR-24 står i funksjonsgrupper utenfor rekkefølgen. Det er greit hvis FR-nummer er stabile, men legg inn en kort merknad om det eller en indeks i §9.
- Glossaret brukes konsekvent ("city day", "call home", "stamp", "journey"). Jeg fant ingen avvik.
- De innebygde `[ASSUMPTION]`-merkene står i indeksen i §12, og indeksen stemmer med teksten. Utkastet til rekkefølge i §9.2 (punkt 4) er merket og indeksert.
- Hver UJ har navngitt hovedperson. Ingen flytende UJ-er.

## 6. Før dere går videre

**Må avklares før UX, arkitektur og epics:**
- Rekkefølge og tilstandsmodell for bydagen (4.4).
- Eierskap og minimum for innhold i utvidelsen (4.3, Open Question 3).
- Beslutning eller playtest-utløser for tid i kjernen (4.1, Open Question 1).

**Kan vente:** Nomad-verdier og nattavganger (Open Question 2), AI-assistent (Open Question 4), balansering av Madrid og Cape Town.

**Oppfølging av briefen-tilbakemeldingen: ja.** Reglene og sluttilstanden er skrevet ned, innholdsmengden er bestemt (8 + 2 destinasjoner), Explorer/Nomad brukes konsekvent, primærspiller er en ung budsjettbevisst mobilspiller (§2.2), og innhold og `.env.example` er plassert i NFR-3 og NFR-7. Teknologistakk velges i arkitekturen.

## 7. Refleksjonsspørsmål

1. §2.4 sier at UJ-ene er skrevet av PM-agenten og skal bekreftes av teamet. Hva har dere kontrollert ved å regne gjennom dem mot addendumet, og hva avslørte kontrollen? (UJ-3 viser at noe slapp gjennom.)
2. Balansekontrollen i addendum §6 gir et konkret svar på "kan spillet vinnes". Hvordan vil dere avgjøre om det også er et *godt* spill, og hvilken del av den vurderingen kan KI ikke gjøre for dere?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._
