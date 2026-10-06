# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G113 – G113-rothe-storum |
| **Product brief** | `.docs/planning-artifacts/briefs/brief-worldbound-nomad-2026-09-15/brief.md` (commit `72b7f65`), lest sammen med `addendum.md` i samme mappe |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Gruppen kan gå videre og innarbeide punktene under.

**Det som er bra:**

1. Kjernen i spillet er tydelig: tid, penger og muligheter er knappe, og hvert valg bytter det ene mot det andre. Prioriteringen i Scope er svært god – kart og destinasjoner, reise og grunnleggende økonomi må fungere fra start til slutt før arbeid, quiz og lagring legges til. Prinsippet «build little → test → quality-assure → expand» er akkurat riktig.
2. Dere har et bevisst forhold til prosessen. Forskningsmålet om hvordan KI-agenter fungerer gjennom hele utviklingssyklusen, med «AI proposes, humans decide» og sporbarhet i Git fra prompt til rettet versjon, passer godt med det sensor ser etter i prosess og KI-styring. Addendumet tar også opp etikk, for eksempel kulturelle stereotypier i KI-generert innhold og forskjellen mellom inspirasjon og kopi av Backpacker 2.

**De viktigste endringene:**

1. Definer reglene i spillet konkret nok til å teste dem. Suksesskriteriene sier at spilleren skal nå «a meaningful end state» og at det skal føles som «a real, coherent game». Skriv hva sluttilstanden er (for eksempel tom for penger, tom for tid eller nådd et mål), og gi eksempler på regler: «en flyreise fra Oslo til Bangkok koster X kroner og Y dager», «en arbeidsdag i Sydney gir Z kroner og bruker én dag».
2. Avklar innholdsmengden for MVP. Dere har selv markert «[OPEN] How much content … is ‘enough’». Bestem et konkret antall destinasjoner (for eksempel 6–8) og transportmåter for MVP, og la resten komme senere. Det gjør PRD og stories mye enklere.
3. Gjør briefen konsistent og spiss brukeren. Briefen viser flere ganger til «MVP-of-the-MVP under Scope», men Scope heter «MVP – the playable core». Bruk ett begrep. Spillerpersonaen er bevisst bred («anyone interested in travel …»); velg likevel én primærspiller å designe for, for eksempel en ung, budsjettbevisst reisende som spiller på mobil.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Middels**

**Sammenlignbart med:** 3) KI-styrt simulering av prosjektledelse (vanskelig), men i en enklere og mer avgrenset form. Som simuleringen har spillet en tilstand med ressurser (tid og penger), beslutninger og konsekvenser som henger sammen over flere steg. Reglene er deres egne og krever ikke fagkunnskap som må stemme med virkeligheten, og MVP har ingen KI-funksjon i selve appen. Det gir middels.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | Middels | Reisekostnad og reisetid, økonomi, arbeid, sluttilstand og senere vanskelighetsgrader (Explorer/Nomad). Reglene er deres egne, men må henge sammen og balanseres. |
| Datamodell – antall entiteter og relasjoner mellom dem | Middels | Spiller, spilltilstand, destinasjon, rute/transport, jobb, oppgave/quiz og lagret spill. |
| Brukere, roller og innlogging | Lav | Ingen kontoer i MVP. Supabase-autentisering er nevnt som kandidat, men bør vente. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | Lav | Ingen KI i MVP. KI-reiseassistenten er tydelig utsatt. KI brukes til utvikling og eventuelt innhold. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | Lav | Ingen påkrevd. Supabase er bare en kandidat. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | Lav | Enspillerspill, ingen flerspiller. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | Lav | Ingen filhåndtering. Grafikk og kart er ressurser i repoet. |
| Sikkerhet og personvern | Lav | Ingen personopplysninger i MVP. |

**Hva vanskelighetsgraden betyr for dere:**

- _Middels:_ Et godt balansert valg. Pass på at kjerneflyten blir ferdig og stabil før dere legger til mer: start med budsjett og tid → velg destinasjon → reis → se tid og penger endres → nå en sluttilstand. Dere har allerede beskrevet nettopp dette.

### Gjennomførbarhet med BMAD og Claude Code

Dere skal planlegge med BMAD (product brief → PRD → arkitektur → epics og stories) og implementere med Claude Code. Vurderingen under tar hensyn til at det må være tid til hele denne flyten, og til testing, retting og README til slutt.

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | OK | MVP-en er realistisk for to personer, og rekkefølgen beskytter kjerneflyten. Risikoen er de mange mulige utvidelsene – hold dem utenfor til MVP er testet. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | Risiko | Strukturen er god, men spillreglene, innholdsmengden og sluttilstanden er ikke beskrevet. Uten dem må PRD-en og KI-en finne på mye. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | Risiko | En nettbasert spill-app er godt egnet. Kandidatstakken i addendumet (Node.js, Python, Docker og Supabase samtidig) er mer enn MVP trenger. Velg én enkel stakk. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | OK | Dere definerer reglene selv og kan kontrollere dem. KI-generert land- og kulturinnhold må faktasjekkes, som dere selv påpeker. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | Risiko | Spillogikk (reisekostnad, tidsbruk, økonomi, sluttilstand) er svært godt egnet for automatiske tester – når reglene er skrevet ned. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | OK | Uten KI i appen og uten påkrevd backend kan spillet kjøres lokalt uten nøkler. Pass på at dette fortsatt gjelder hvis Supabase tas inn. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | OK | Ingen betalte tjenester i MVP. KI-reiseassistenten er utsatt; tas den inn senere, trengs en plan for nøkkel og testmodus. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart som beskrevet.**

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. Velg en enkel teknologistakk for MVP (for eksempel en ren nettleserapp i TypeScript med lagring i nettleseren eller en lokal database), og vent med Supabase og Python til dere ser at spillet trenger det.
2. Når MVP-en er stabil, velg én utvidelse som gir mest spill per arbeidstime – for eksempel tilfeldige hendelser eller de to vanskelighetsgradene – i stedet for flere halvferdige utvidelser. Det løfter både spillopplevelsen og testgrunnlaget.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | OK | Tydelig hva spillet er, og at det har både et produktmål og et forskningsmål. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | Juster | For et spill er «problemet» hvilken opplevelse som mangler. Skriv kort hva spilleren ikke får i dag, for eksempel at moderne, nettbaserte reise- og beslutningsspill er sjeldne. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | OK | «The Concept» og kjerneløkken beskriver spilleropplevelsen godt, uten å blande inn teknologi. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Kort og ærlig. At utviklingsprosessen er en del av historien, er et godt poeng for dette emnet. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | Juster | Bevisst bred målgruppe. Velg likevel én primærspiller (og hovedenhet, mobil eller PC) å designe for i v1. |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | Juster | Prosesskriteriene er gode. Produktkriteriene trenger en definert sluttilstand og konkrete regler for å kunne testes. |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | Juster | Svært god prioritering og tydelig «out of scope». Avklar antall destinasjoner og bruk ett navn på MVP-nivåene. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | OK | Det finnes ingen egen Vision-del, men utvidelsene og vanskelighetsgradene er tydelig merket som «ikke MVP». Det fungerer som visjon uten å blåse opp omfanget. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | OK | Forskningsmålet gir et svært godt grunnlag for sporbar KI-styring. Følg opp med PRD, og lagre prompts og KI-økter slik dere planlegger. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | OK | Tydelig kjerneflyt og realistisk omfang, med en klar plan for hva som legges til. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | Juster | Spillogikken egner seg godt for tester, men reglene og sluttilstanden må skrives ned først. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | Juster | Visuell retning er beskrevet i addendumet (verdenskart, kompass, passtempler). Velg primærspiller og hovedenhet, og skissér kart- og reiseskjermen på mobil. |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | Juster | Kandidatstakken er bredere enn MVP trenger. Velg og begrunn en enkel stakk i arkitekturen. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | OK | Ingen betalte tjenester eller nøkler i MVP gjør spillet lett å kjøre for sensor. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | Juster | Planleggingsdokumentene er ryddig plassert. Planlegg også hvor spillinnhold (destinasjoner, quiz) og grafikk skal ligge, og bruk `.env.example` hvis dere senere tar inn eksterne tjenester. |

## 3. Neste steg for gruppen

1. Skriv ned kjerneregler og sluttilstand for MVP (reisekostnad, reisetid, startbudsjett, arbeid og hva som avslutter et spill), og ta dem inn i suksesskriteriene.
2. Bestem innholdsmengden for MVP (antall destinasjoner og transportmåter), og rett opp begrepsbruken rundt MVP i Scope.
3. Lag PRD-en med BMAD, og velg en enkel teknologistakk i arkitekturen basert på hva MVP-en faktisk trenger.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.
