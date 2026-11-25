# FR → test map (SM-1)

Story 4.1. One row per testable consequence in PRD §4
(`.docs/planning-artifacts/prds/prd-worldbound-nomad-2026-10-12/prd.md`) for the
SM-1 requirements FR-1, FR-4, FR-6 – FR-14, FR-21 and FR-22. A consequence with
both a rules part and a UI part has one row per part. Story 4.4's test report
links here.

`tests/traceability.test.ts` keeps this map honest: it fails when an SM-1 FR
has no row, or when a named test file does not exist or no longer contains
every title in the row's `describe › it` path. Titles are written exactly as
in the source, so an `it.each` row shows its template (`$name`, `%s`). The
marker `pending Story 3.3` in the file column is allowed only for FR-14 (spec
4.1, decision CSE 2026-11-25); Story 3.3 must replace those rows with tests.
The number of rows per FR is pinned in `EXPECTED_ROWS` in the guard, so a
deleted row fails by name; change the count together with the map.

The SM-3 balance test (`tests/balance/balance.test.ts`) deliberately excludes
call home: a journey counts only when it travels home (PRD addendum §6 model,
decision CSE 2026-11-25). Under the real rules call home is a loophole; issue
#66 tracks it.

Consequences that cannot be tested yet are listed under
[Flagged](#flagged-consequences-with-no-test-yet) below the table, outside it,
with the story that owns them.

| FR | Consequence | Test file | Test (`describe › it`) |
| --- | --- | --- | --- |
| FR-1 | A new Explorer journey starts at home with 0 days used, 0 stamps and an empty album | `tests/rules/startJourney.test.ts` | FR-1 start a journey › starts at home with the fixture's Explorer values |
| FR-1 | The real Explorer journey has €1,500 and 30 days | `tests/rules/startJourney.test.ts` | FR-1 start a journey › uses the real content: €1,500 and 30 days |
| FR-1 | Starting a new journey replaces the one in progress (rules part; the confirmation is [EXT]) | `tests/rules/startJourney.test.ts` | FR-1 start a journey › restarts from an existing state with a fresh state |
| FR-1 | The traveller name is optional and capped at 14 characters | `tests/rules/startJourney.test.ts` | FR-1 start a journey › traveller name › keeps the first 14 of 20 graphemes, including æøå |
| FR-1 | Without a name, "Traveller" is used | `tests/rules/startJourney.test.ts` | FR-1 start a journey › traveller name › uses Traveller for %j |
| FR-1 | The name never affects the rules | `tests/rules/startJourney.test.ts` | FR-1 start a journey › traveller name › never affects the rules: the same actions give the same journey |
| FR-1 | The name field caps input at 14 and shows the name on the passport preview | `tests/ui/NameField.test.tsx` | FR-1 name rule in the field › updates the counter and the passport preview as the player types |
| FR-4 | Only routes in the route data are shown, with each mode's price and days | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › route query › lists Copenhagen's routes from the real content |
| FR-4 | A place with no route from here cannot be a travel target | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › rejected › $position → $to by $mode: NO_ROUTE |
| FR-4 | Unaffordable modes and modes longer than the days remaining are unavailable with the reason | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › rejected › $name: $reason in query and apply |
| FR-4 | The route query and `apply` agree on every option | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › query and apply agree (AD-3) › gives the same reason for every option, and accepts every available one |
| FR-4 | An option after which home is out of reach warns but is not blocked | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › home-unreachable warning › warns but stays available when home is out of reach after travel |
| FR-4 | The warning uses the shortest route home in days, ignoring money | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › home-unreachable warning › uses the fewest days per route, ignoring money |
| FR-6 | Travel deducts exactly the price, adds exactly the days and moves to the other end | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › travel › travels home to alpha by bus |
| FR-6 | Travel is rejected when the price exceeds money or the days exceed days remaining, state unchanged | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › rejected › $name: $reason in query and apply |
| FR-6 | Money equal to the price and days equal to the days remaining are allowed | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › travel › allows days equal to the days remaining |
| FR-6 | A whole journey of travel on the real content (UJ-1) | `tests/rules/journeys.test.ts` | FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content) › ends home after 16 days with €423, 5 stamps, 2 photos and the goal reached |
| FR-7 | Arriving home ends the journey (rules part) | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › arriving home › ends the journey with goalNotReached and 0 stamps |
| FR-7 | No action except a new journey is possible after arriving home | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › arriving home › rejects further travel after arriving home |
| FR-8 | A city day deducts base × cost factor, rounded halves up | `tests/rules/money.test.ts` | FR-8 AD-5 accommodationPrice › accommodationPrice(%d, %s) is %d |
| FR-8 | The real stays match PRD addendum §2 | `tests/rules/money.test.ts` | FR-8 AD-5 accommodationPrice › gives the stays of PRD addendum §2 for the real content |
| FR-8 | A city day deducts the stay and adds 1 day | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › stay and stamp › spends a city day in Paris with the real content |
| FR-8 | A city day is unavailable when money is below the stay or 0 days remain; not possible at home | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › rejected › $name: $reason |
| FR-8 | Money equal to the stay is allowed | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › stay and stamp › allows money equal to the stay |
| FR-8 | Fixed order: the stay first, then the sights from the money left | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › sights › rejects a sight the money left cannot pay |
| FR-8 | A draft charges nothing until the day is confirmed; the plan says what `apply` would decide | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › query and apply agree (AD-3) › agrees in every cell of the grid over %s |
| FR-9 | No action takes money below €0: money equal to the cost reaches exactly €0 | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › travel › allows money equal to the price |
| FR-9 | No action takes money below €0: a stay and both sights equal to the money | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › sights › allows money equal to the stay and both sights |
| FR-9 | Every action whose cost exceeds money is unavailable with the reason (travel) | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › query and apply agree (AD-3) › gives the same reason for every option, and accepts every available one |
| FR-9 | Every action whose cost exceeds money is unavailable with the reason (city day and sights) | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › query and apply agree (AD-3) › agrees in every cell of the grid over %s |
| FR-9 | Every action whose cost exceeds money is unavailable with the reason (call home) | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › query and apply agree (AD-3) › gives the same availability and reason as apply in every case |
| FR-10 | The first city day at a destination adds one stamp | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › stay and stamp › spends a city day in Paris with the real content |
| FR-10 | Later city days at the same destination add no stamp | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › stay and stamp › gives no new stamp on a repeat city day |
| FR-10 | Later visits add no stamp (UJ-2: three New York city days, one stamp) | `tests/rules/end.test.ts` | FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content) › calls home at 10 days: 17 days, 3 stamps, €20, goal not reached |
| FR-10 | Home never gives a stamp | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › rejected › $name: $reason |
| FR-10 | Arriving without a city day gives no stamp | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › travel › leaves stamps, album, cityDays and calledHome unchanged |
| FR-10 | Arriving without a city day gives no stamp (UJ-1, real content) | `tests/rules/journeys.test.ts` | FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content) › arrives in Copenhagen with €1,430 on Day 3 and in Paris with €1,270 on Day 6 |
| FR-11 | Home with at least the goal's stamps within the days is goalReached | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › arriving home › ends the journey with goalReached when stamps meet the goal |
| FR-11 | Home one stamp short is goalNotReached | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › arriving home › ends the journey with goalNotReached one stamp short of the goal |
| FR-11 | Home with enough stamps but more days than the total is goalNotReached | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › evaluateEnd › home with enough stamps but more days than the total is goalNotReached |
| FR-11 | Home with 5 stamps in 16 days on the real content is goalReached (UJ-1) | `tests/rules/journeys.test.ts` | FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content) › ends home after 16 days with €423, 5 stamps, 2 photos and the goal reached |
| FR-11 | Stamps removed by call home are not counted | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › goes home, uses the days, removes the last stamp and keeps the money |
| FR-11 | The stamps left after call home still count when they meet the goal | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › reaches the goal when the stamps left still meet it (FR-11 literal) |
| FR-12 | Call home is not offered when money equals the cheapest fare | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › rejects, with state unchanged, in the fixed order › CALL_HOME_NOT_OFFERED when money equals the cheapest fare |
| FR-12 | Call home is not offered at home or after the end | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › callHomeStatus › is not offered at home or after the end |
| FR-12 | Call home is offered at a destination with no routes | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › is offered at a destination with no routes, whatever the money |
| FR-12 | The offer shows its cost (7 days, one stamp) before the player confirms (rules part) | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › callHomeStatus › shows the cost before confirming |
| FR-12 | Call home adds the days, removes one stamp, costs no money and moves home | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › goes home, uses the days, removes the last stamp and keeps the money |
| FR-12 | Call home with no stamps removes none | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › keeps empty stamps empty with no stamps |
| FR-12 | 7 days, 1 stamp, €0 on the real content (UJ-2) | `tests/rules/end.test.ts` | FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content) › calls home at 10 days: 17 days, 3 stamps, €20, goal not reached |
| FR-12 | Call home that does not fit the days remaining is unavailable (stranded) | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › callHomeStatus › shows offered but not fitting (stranded) as unavailable |
| FR-12 | Call home that does not fit ends the journey stranded (UJ-2 at 24 days) | `tests/rules/end.test.ts` | FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content) › the same situation at 24 days used ends stranded with 4 stamps |
| FR-12 | While offered, call home stays available after a rejected action and a city day, until used (rules part) | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › stays offered after a rejected action and a city day until it is used |
| FR-12 | The end state marks the journey as called home (rules part of the summary mark) | `tests/rules/end.test.ts` | FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content) › calls home at 10 days: 17 days, 3 stamps, €20, goal not reached |
| FR-12 | The most recently earned stamp is removed | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › removes the last stampPenalty stamps, or fewer if there are fewer |
| FR-13 | The journey ends when the player arrives home by travel | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › arriving home › ends the journey with goalNotReached and 0 stamps |
| FR-13 | The journey ends when the player arrives home by call home | `tests/rules/callHome.test.ts` | FR-12 FR-11 call home › apply › goes home, uses the days, removes the last stamp and keeps the money |
| FR-13 | Stranded: call home offered but not fitting ends the journey | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › stranded › a city day that leaves call home offered but not fitting ends stranded |
| FR-13 | Stranded even if a city day is still affordable | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › stranded › ends stranded even if a city day is still affordable |
| FR-13 | Not stranded while call home is offered and fits | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › stranded › continues while call home is offered and fits |
| FR-13 | Out of days: no travel that fits, no city day, no call home | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › out of days › affordable routes but none fits and 0 days left ends outOfDays |
| FR-13 | Out of days when call home is offered and fits but cannot be paid | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › out of days › ends outOfDays when call home is offered and fits but cannot be paid |
| FR-13 | Not out of days while a city day is still possible | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › out of days › continues while a city day is still possible |
| FR-13 | Not out of days while an affordable route still fits | `tests/rules/end.test.ts` | FR-13 FR-11 end rules › out of days › continues while an affordable route still fits |
| FR-13 | A journey that ends away from home is failed with its reason (rules part; the copy is FR-14) | `tests/rules/end.test.ts` | FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content) › the same situation at 24 days used ends stranded with 4 stamps |
| FR-13 | After the end, no action is possible except a new journey | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › rejected › rejects everything but startJourney after the journey ended |
| FR-14 | The end state holds everything the summary reads: name, stamps, album, days used, money, outcome, `calledHome` (rules part, UJ-1) | `tests/rules/journeys.test.ts` | FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content) › ends home after 16 days with €423, 5 stamps, 2 photos and the goal reached |
| FR-14 | The end state holds `calledHome` and goal not reached after call home (rules part, UJ-2) | `tests/rules/end.test.ts` | FR-11 FR-12 FR-13 UJ-2 Jonas calls home from Rome (real content) › calls home at 10 days: 17 days, 3 stamps, €20, goal not reached |
| FR-14 | A new journey can be started from an ended one (rules part of "New journey") | `tests/rules/travel.test.ts` | FR-4 FR-6 FR-7 FR-9 travel › rejected › rejects everything but startJourney after the journey ended |
| FR-14 | The summary shows the traveller name, stamps with destination names, the photo album, days used and money left | pending Story 3.3 | — |
| FR-14 | The summary shows "Goal reached" or "Goal not reached", and "Called home" when relevant (also FR-12) | pending Story 3.3 | — |
| FR-14 | The summary names the failure reason, "Stranded in {city} …" or "Out of days in {city}." (copy part of FR-13) | pending Story 3.3 | — |
| FR-14 | The summary offers "New journey" | pending Story 3.3 | — |
| FR-21 | A sight deducts its ticket price and adds no days | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › sights › pays both sights and adds them to the album in order |
| FR-21 | A sight is unavailable when the money left after the stay is below its price | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › sights › rejects a sight the money left cannot pay |
| FR-21 | The draft shows the money left for each sight | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › queries › measures moneyLeft from the other selected sights |
| FR-21 | Each of the 8 destinations has exactly 2 sights at €8–20 | `tests/content/content.test.ts` | NFR-7 AR-6 content › real content › has 2 sights for each destination, priced as in PRD addendum §3 |
| FR-21 | Each sight has a photo and a fact in English | `tests/content/content.test.ts` | NFR-7 AR-6 content › real content › FR-21 NFR-8 gives every sight a fact, image and licence record |
| FR-21 | Sights in a whole journey on the real content (UJ-1: Eiffel Tower and Louvre) | `tests/rules/journeys.test.ts` | FR-6 FR-8 FR-10 FR-11 FR-21 FR-22 UJ-1 Ingrid reaches the goal (real content) › ends home after 16 days with €423, 5 stamps, 2 photos and the goal reached |
| FR-22 | Each visited sight joins the album once, in order | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › sights › keeps the given order in the album |
| FR-22 | A sight already in the album cannot be chosen again | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › sights › rejects a sight already in the album |
| FR-22 | A sight in the album is marked and left out of the draft's total | `tests/rules/cityDay.test.ts` | FR-8 FR-9 FR-10 FR-21 FR-22 city day › queries › marks a sight in the album and leaves it out of the total |
| FR-22 | The album is empty at the start of a journey | `tests/rules/startJourney.test.ts` | FR-1 start a journey › starts at home with the fixture's Explorer values |

## Flagged: consequences with no test yet

These consequences are UI behaviour whose screens are still in the backlog, or
[EXT]. They have no row above because no test can exist before the UI does.
When the owning story adds a test, it adds the row to the main table above,
raises that FR's count in `EXPECTED_ROWS` in `tests/traceability.test.ts`,
and removes the entry here.

| FR | Consequence | Owner |
| --- | --- | --- |
| FR-1 | The name is shown on the passport and in the journey summary (the start-screen preview is mapped above) | Stories 2.5, 3.3 |
| FR-1 | Starting a new journey discards one in progress after the player confirms | [EXT] saved journeys |
| FR-4 | The Route sheet shows each mode's price and days, unavailable modes with the reason, and the warning | Story 1.6 |
| FR-7 | Before travel home, the game shows the stamp count and whether the goal will be reached, and asks for confirmation | Story 1.7 |
| FR-7 | Arriving home shows the journey summary | Story 3.3 |
| FR-8 | The city-day home-unreachable warning (PRD Decision M, #39); no rules query exists yet | Story 2.4 |
| FR-8 | The UI lets the player pick sights before "End the day" | Story 2.4 |
| FR-9 | Every action whose cost exceeds money is shown as unavailable with the reason on screen (the rules reasons are mapped above) | Stories 1.6, 2.4, 3.2 |
| FR-12 | The Call home sheet shows the cost, says when it cannot bring the player home in time, and "Not now" does not remove the offer | Story 3.2 |
| FR-22 | The album shows each sight's photo and fact, and an album sight opens for free | Story 2.5 |
