# WORLDBOUND: NOMAD — Grunnlagsdokument

## 1. Prosjektidé

WORLDBOUND: NOMAD er en moderne, webbasert reise- og beslutningssimulator inspirert av klassiske reisespill som Backpacker 2.

Spilleren starter med begrensede økonomiske ressurser og en viss mengde tid. Spilleren reiser mellom ulike destinasjoner, arbeider for å tjene penger, håndterer reisekostnader og tar valg som påvirker videre progresjon.

Underveis møter spilleren oppgaver, quiz, muligheter og uforutsette hendelser knyttet til land, byer og kulturer.

Det sentrale i produktet er ikke bare selve reisen, men beslutningene spilleren må ta underveis. Begrenset tid, penger og ressurser gjør at spilleren kontinuerlig må prioritere mellom ulike alternativer.

Produktet skal utvikles som en selvstendig applikasjon med egen kode, grafikk, tekst og spillmekanikk. Inspirasjonen fra klassiske reisespill skal brukes som et konseptuelt utgangspunkt, ikke som en direkte gjenskaping.

---

## 2. Produktmål og faglig mål

Prosjektet har to parallelle mål:

### Produktmål
Utvikle en fungerende og engasjerende reise- og beslutningssimulator.

### Faglig mål
Undersøke hvordan KI-agenter kan benyttes gjennom hele utviklingssyklusen for å utvikle en kompleks programvareapplikasjon, og hvilke muligheter, begrensninger og utfordringer som oppstår når KI-generert kode integreres, testes og kvalitetssikres av en menneskelig utvikler.

Prosjektet skal derfor ikke bare undersøke hvor raskt KI kan produsere kode, men også hva som skjer når KI-generert kode inngår i et større system, må fungere sammen med annen kode, inneholder feil, må testes, gjennomgås, korrigeres og vedlikeholdes over tid.

---

## 3. Grunnleggende spill-loop

Den grunnleggende spill-loopen er:

**PLANLEGG → REIS → OPPLEV/LÆR → JOBB → TJEN PENGER → PLANLEGG PÅ NYTT**

Spilleren må hele tiden balansere:

**Tid + penger + risiko + opplevelser**

Eksempler på beslutninger spilleren må ta:

- Hvor bør jeg reise videre?
- Hvilket transportmiddel bør jeg velge?
- Hvor mye vil reisen koste?
- Hvor lang tid tar reisen?
- Bør jeg jobbe før jeg reiser videre?
- Hvilke aktiviteter gir best uttelling?
- Hvordan bør pengene fordeles?
- Hvordan bør en uforutsett hendelse håndteres?

Penger bestemmer hvilke valg som er mulige. Tid bestemmer hvor langt spilleren rekker. Valg i én by kan påvirke neste etappe.

---

## 4. MVP — første fungerende versjon

MVP-en er minimumsmålet. Prosjektet skal ikke gjøres unødvendig stort før grunnsystemet fungerer.

MVP-en skal inneholde:

### Kart og destinasjoner
- Kart
- Flere internasjonale destinasjoner
- Oversikt over tilgjengelige reisemål
- Mulighet til å bevege seg mellom destinasjoner

### Reise
- Ulike transportalternativer
- Reisekostnad
- Tidsbruk
- Oppdatering av spillerens posisjon

### Økonomi
- Startbudsjett
- Inntekter
- Utgifter
- Løpende økonomisk status

### Arbeid
- Tilgjengelige jobber på ulike destinasjoner
- Forskjellig inntekt
- Forskjellig tidsbruk
- Valg mellom å arbeide og reise videre

### Oppgaver og læring
- Quiz
- Oppgaver knyttet til destinasjoner
- Informasjon om land, byer og kulturer

### Spillerdata
- Inventar
- Reisejournal
- Progresjon
- Lagring av spilldata

Prinsippet er:

**Bygg lite → test → kvalitetssikre → utvid**

---

## 5. Mulige videreutvidelser

Dersom MVP-en fungerer godt og prosjektet har tilstrekkelig fremdrift, kan løsningen utvides med:

- Tilfeldige hendelser
- Ferdigheter og progresjonssystem
- Handel og gjenstander
- Dynamiske priser
- Mer avansert økonomi
- Alternative reiseruter
- Flere transportformer
- Mer avanserte oppgaver
- Flere destinasjoner
- Mer dynamiske spillverdener
- KI-basert reiseassistent

Utvidelser skal prioriteres etter hvor mye de bidrar til produktet og prosjektets faglige mål.

MVP først – mer dybde når grunnsystemet fungerer.

---

## 6. KI-agenter som utviklingsteam

Et sentralt element i prosjektet er at KI ikke bare skal brukes til enkelte kodeoppgaver. Flere KI-agenter skal kunne ha ulike roller gjennom utviklingsprosessen.

### Systemarkitekt
Planlegger systemstruktur, komponenter, dataflyt og arkitektur.

### Programmeringsagent
Skriver og implementerer kode basert på systemkrav og spesifikasjoner.

### Testagent
Utvikler og gjennomfører tester, finner feil og foreslår løsninger.

### Code-review-agent
Vurderer KI-generert kode med fokus på kvalitet, struktur, sikkerhet og forbedringsmuligheter.

### Innholdsagent
Hjelper med å utvikle destinasjoner, quiz, oppgaver og annet innhold.

### Dokumentasjonsagent
Dokumenterer systemet, utviklingsprosessen og viktige tekniske beslutninger.

KI-agentene skal fungere som et slags digitalt utviklingsteam, men mennesket skal være ansvarlig for helheten.

**KI lager forslag. Mennesket avgjør.**

Mennesket skal ha kontroll over:

- Krav
- Systemvalg
- Vurdering av kode
- Testing
- Godkjenning
- Prioriteringer
- Kvalitetssikring

---

## 7. KI gjennom hele utviklingsprosessen

Den ønskede arbeidsprosessen er:

**KRAV → SYSTEMDESIGN → KODE → TEST → CODE REVIEW → FEILSØKING → FORBEDRING → GIT**

Git og GitHub skal bidra til å gjøre utviklingen sporbar.

Prosjektet ønsker å kunne se sammenhengen mellom:

**prompt → KI-generert løsning → testing → feil → vurdering → forbedring → ny versjon**

Dette gir prosjektet en tydelig eksperimentell dimensjon.

---

## 8. KI i selve applikasjonen

En mulig utvidelse er en KI-basert reiseassistent inne i WORLDBOUND: NOMAD.

Eksempel:

> «Jeg har 3500 kr, 7 dager igjen og er i Berlin. Hva bør jeg gjøre?»

KI-en kan analysere:

- Økonomi
- Gjenværende tid
- Nåværende posisjon
- Transportmuligheter
- Tilgjengelige jobber
- Aktiviteter
- Spillerens mål og prioriteringer

Deretter kan KI-en foreslå en mulig strategi.

Dette gjør KI interessant på to nivåer:

1. KI som utviklingsverktøy
2. KI som funksjon i selve produktet

KI-reiseassistenten er foreløpig en mulig utvidelse, ikke et krav for MVP.

---

## 9. Teknologi og utviklingsmiljø

Prosjektet planlegges som en moderne webapplikasjon.

Foreløpig teknologisk retning:

- **Claude / Claude Code** — KI-assistert programmering, kodegenerering og utviklingsstøtte
- **Visual Studio Code** — utviklingsmiljø
- **Git + GitHub** — versjonskontroll, samarbeid, historikk og sporbarhet
- **Node.js + npm** — JavaScript/TypeScript-miljø og webapplikasjon
- **Python + uv** — eventuell backend, databehandling og simulering
- **Docker** — reproducerbart og konsistent utviklingsmiljø
- **Supabase** — database, autentisering og lagring av spillerdata

Den endelige arkitekturen skal fastsettes når systemkrav og funksjonelle behov er detaljert.

---

## 10. Overordnet systemarkitektur

Løsningen kan organiseres rundt noen hovedkomponenter:

**Frontend / webapplikasjon**
- Brukergrensesnitt
- Kart
- Spillopplevelse

**Backend / spillogikk**
- Reiser
- Økonomi
- Jobber
- Oppgaver
- Spillstatus

**Database**
- Spillerdata
- Destinasjoner
- Oppgaver
- Progresjon

**KI-lag**
- KI-agenter i utviklingsprosessen
- Eventuell KI-reiseassistent

Arkitekturen skal ikke låses endelig før systemkravene er spesifisert.

---

## 11. Utviklingsstrategi

Prosjektet skal bygges i faser:

### Fase 1 – Grunnsystem
- Prosjektstruktur
- Spiller
- Økonomi
- Kart

### Fase 2 – Reisemekanikk
- Destinasjoner
- Transport
- Kostnader
- Tidsbruk

### Fase 3 – Spillmekanikk
- Arbeid
- Oppgaver
- Quiz
- Inventar
- Progresjon

### Fase 4 – Lagring
- Database
- Lagring
- Spillerprofil
- Reisejournal

### Fase 5 – Testing og kvalitetssikring
- Automatiserte tester
- Manuell testing
- Code review
- Feilsøking
- Stabilisering

### Fase 6 – KI-funksjonalitet
- Eventuell KI-reiseassistent
- Analyse av spillerens situasjon
- Anbefalinger

Hver fase skal kunne testes før neste lag bygges.

---

## 12. Brukeropplevelse og visuell identitet

WORLDBOUND: NOMAD skal ha et tydelig verdenspreget og reiseorientert uttrykk.

Visuell identitet kan bygge på:

- Verdenskart
- Kompass
- Reiseruter
- Fly og transport
- Pass og reisestempler
- Destinasjoner
- Backpacking
- Eventyr og utforskning

Designet skal kombinere en følelse av reise og eventyr med et moderne digitalt/teknologisk uttrykk.

Logo og visuell profil skal gjøre produktet gjenkjennelig på tvers av applikasjonen, presentasjonen og eventuell dokumentasjon.

---

## 13. Etikk, juss og ansvar

Prosjektet skal vurdere utfordringer knyttet til KI-generert programvare.

Aktuelle temaer:

### Opphavsrett og eierskap
- KI-generert kode
- KI-generert tekst
- KI-generert grafikk
- Tredjepartskode og biblioteker

### Kvalitet og fakta
KI kan produsere kode eller innhold som virker korrekt, men som inneholder feil.

Dette gjelder blant annet:

- Fakta om land og kulturer
- Kode med skjulte feil
- Ufullstendige løsninger
- Feilaktige antakelser

### Bias og stereotypier
KI-generert innhold kan inneholde kulturelle stereotypier eller skjevheter.

### Menneskelig ansvar
Selv om KI brukes i store deler av utviklingen, er mennesket ansvarlig for:

- Endelig kode
- Kvalitet
- Testing
- Innhold
- Tekniske valg
- Ferdig produkt

### Inspirasjon kontra kopiering
WORLDBOUND: NOMAD er inspirert av klassiske reisespill, men skal utvikles som et selvstendig produkt med egen kode, grafikk, tekst og innhold.

---

## 14. Hva gjør prosjektet faglig interessant?

Prosjektet kombinerer:

- Programmering — utvikling av en større webapplikasjon
- KI — bruk av flere KI-agenter gjennom utviklingsprosessen
- Systemutvikling — arkitektur, integrasjon og versjonskontroll
- Testing — validering av KI-generert kode
- Beslutningsstøtte — spilleren må prioritere ressurser
- Simulering — reiser, økonomi, tid og hendelser påvirker hverandre

Prosjektet handler derfor ikke bare om å lage en applikasjon, men om å undersøke hvordan en kompleks applikasjon faktisk kan utvikles ved hjelp av KI.

---

## 15. Sentrale problemstillinger

Prosjektet ønsker blant annet å undersøke:

- Hvor godt fungerer KI-generert kode i et større programvaresystem?
- Hva skjer når flere KI-genererte moduler skal fungere sammen?
- Hvilke feil og begrensninger oppstår?
- Hvor mye menneskelig testing og kontroll er nødvendig?
- Hvordan kan kodekvalitet sikres når KI brukes aktivt?
- Hvordan kan Git brukes til å gjøre KI-assistert utvikling sporbar?
- Når er KI et effektivt utviklingsverktøy?
- Når skaper KI mer arbeid enn det sparer?

---

## 16. Kobling til læringsutbyttene

Prosjektet legger opp til praktisk arbeid med:

### Kunnskap
- KI-assistert programmering
- KI-generert kode og begrensninger
- Utviklingsprosessen fra krav til ferdig programvare
- Etiske og juridiske problemstillinger

### Ferdigheter
- Konfigurere utviklingsmiljø
- Skrive detaljerte systemspesifikasjoner
- Bruke KI til programmering
- Evaluere og feilsøke KI-generert kode
- Integrere moduler i et større system
- Teste og optimalisere løsninger
- Bruke Git og GitHub

### Generell kompetanse
- Vurdere når KI egner seg som utviklingsverktøy
- Utvikle programvare med menneskelig kontroll
- Forstå styrker og begrensninger ved KI
- Samarbeide om et komplekst utviklingsprosjekt
- Forklare tekniske og KI-relaterte valg til andre

---

## 17. Risikohåndtering og prosjektavgrensning

Den største risikoen er at prosjektet blir for omfattende.

Derfor brukes prinsippet:

**MVP først – utvidelser etter fremdrift.**

Først skal det sikres en fungerende kjerne med:

**kart + reise + økonomi + arbeid + oppgaver + lagring**

Deretter kan funksjoner som KI-reiseassistent, dynamisk økonomi og tilfeldige hendelser prioriteres.

Dette gjør prosjektet ambisiøst uten at hele prosjektet avhenger av at alle avanserte funksjoner blir ferdige.

---

## 18. Mål for sluttproduktet

Ved prosjektets slutt ønskes:

- En fungerende webbasert reise- og beslutningssimulator
- En tydelig og sammenhengende brukeropplevelse
- En fungerende teknisk arkitektur
- Dokumentert bruk av KI-agenter gjennom utviklingsprosessen
- Dokumentert testing og kvalitetssikring av KI-generert kode
- En tydelig versjonshistorikk gjennom Git/GitHub
- En vurdering av KI-verktøyenes styrker, svakheter og begrensninger
- Et produkt som viser hvordan KI kan brukes i utvikling av en mer kompleks applikasjon

---

## 19. Kort produktpitch

**WORLDBOUND: NOMAD** er en moderne reise- og beslutningssimulator der spilleren reiser mellom destinasjoner, jobber for å tjene penger, håndterer begrenset tid og økonomi og tar valg som påvirker videre progresjon.

Samtidig bruker prosjektet KI-agenter gjennom hele utviklingsprosessen – fra systemdesign og programmering til testing, code review og feilsøking.

Målet er å lage et fungerende produkt, samtidig som vi undersøker hvor godt KI kan brukes som utviklingspartner i byggingen og kvalitetssikringen av en kompleks programvareapplikasjon.

**Et spill. Et utviklingseksperiment. En ny måte å utforske verden på.**

---

## Viktig for BMAD

Dette dokumentet er **grunnlagsmateriale**, ikke en ferdig Product Brief, PRD eller systemarkitektur.

BMAD skal bruke materialet som utgangspunkt for å stille avklarende spørsmål, identifisere mangler og hjelpe med å strukturere prosjektet videre.

Ikke anta at teknologivalg eller mulige utvidelser er endelige krav.

MVP skal prioriteres foran videreutvidelser.

Mennesket skal beholde ansvar for krav, prioriteringer, tekniske valg, testing, kvalitetssikring og godkjenning.
