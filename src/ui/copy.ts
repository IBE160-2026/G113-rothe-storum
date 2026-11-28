// All player-facing text (AD-9). Keys follow the EXPERIENCE copy keys; the
// `error.*` keys are new in Story 1.3 (fallback screen of the error boundary).
// Story 1.5 adds `start.*`, `intro.*`, the "How to play" row of `menu` and the
// hidden map heading. Strings not in the EXPERIENCE copy table come from the
// mockups and are listed in spec-1-5 (intro steps from screens-core S2, the
// passport help line from screens-ext-1 X1a).
// Story 1.6 adds `map.*` (panel, chips, key), `status.*` and `route.*`.

/** `{money}`, `{price}`: "€" + whole euros with a thousands comma. */
function euros(amount: number): string {
  return `€${amount.toLocaleString("en-US")}`;
}

/** `{days}`: "1 day" / "{n} days". */
function dayCount(n: number): string {
  return n === 1 ? "1 day" : `${n} days`;
}

export const copy = {
  start: {
    title: "WORLDBOUND: NOMAD",
    tagline: "Round trip or one-way ticket?",
    newJourney: "New journey",
    howToPlay: "How to play",
    name: {
      label: "Your name",
      optional: "optional",
      placeholder: "Traveller",
      counter: (count: number, max: number) => `${count}/${max}`,
      atLimit: (max: number) => `${max} characters, the maximum.`,
      help: "Goes on your passport:",
      passportMode: "EXPLORER PASSPORT",
    },
  },
  intro: {
    heading: "How to play",
    caption: "Your journey",
    goalCaption: "The goal",
    goal: (stamps: number, days: number) =>
      `Collect ${stamps} passport stamps and get home to Bergen within ${days} days.`,
    moneyLabel: "You start with",
    money: (euros: number) => `€${euros.toLocaleString("en-US")}`,
    daysLabel: "To get home",
    days: (days: number) => `${days} days`,
    steps: [
      {
        title: "Travel",
        body: "Plane is fast, bus is cheap. Every trip costs days and money.",
      },
      {
        title: "Spend city days",
        body: "Stay a day to earn that city's stamp. Add sights for your album.",
      },
      {
        title: "Get home",
        body: "Travel back to Bergen. Your journey ends when you land.",
      },
    ],
    letsGo: "Let's go",
    backToJourney: "Back to my journey",
    gotIt: "Got it",
    reopenHint: "You can open this again from the menu.",
    close: "Close",
  },
  menu: {
    open: "Menu",
    title: "Menu",
    howToPlay: "How to play",
    close: "Close",
  },
  map: {
    heading: "Map",
    srWhere: (city: string) => `You're in ${city}. Routes are listed below.`,
    panelTitle: (place: string) => `You're in ${place}`,
    panelHint: "Tap a city to see routes",
    panelCaption: (place: string) =>
      `From ${place} you can reach · cheapest fare`,
    chipFrom: (price: number) => `from ${euros(price)}`,
    chipHome: (price: number) => `${euros(price)} · ends the journey`,
    // Decision (Thomas, 2026-11-24, spec-1-6): the short chip names the reason
    // reported by routesFrom() instead of an amount the UI would compute.
    chipShort: "Not enough money",
    key: {
      here: "You're here",
      home: "Home",
      stamped: "Stamped",
      notYet: "Not yet",
    },
  },
  status: {
    day: (day: number, total: number) => `Day ${day} of ${total}`,
    left: (n: number) =>
      n <= 0 ? "No days left" : n === 1 ? "1 day left" : `${n} days left`,
    money: "Money",
    moneyValue: (amount: number) => euros(amount),
    strip: (stamps: number, goal: number) => `EXPLORER · ${stamps}/${goal}`,
    stripLabel: (stamps: number, goal: number, cities: readonly string[]) =>
      `Explorer passport, ${stamps} of ${goal} stamps` +
      (cities.length > 0 ? `: ${cities.join(", ")}` : ""),
  },
  route: {
    header: (from: string, to: string) => `${from} → ${to}`,
    notStamped: (to: string) => `${to} isn't stamped yet.`,
    stamped: (to: string) => `You already have your ${to} stamp.`,
    modeName: { plane: "Plane", train: "Train", bus: "Bus" },
    row: (days: number, arrivalDayLabel: number) =>
      `${dayCount(days)} · arrive Day ${arrivalDayLabel}`,
    price: (price: number) => euros(price),
    choose: "Choose how to travel",
    verb: {
      plane: "Take the plane",
      train: "Take the train",
      bus: "Take the bus",
    },
    primary: (verb: string, price: number) => `${verb} · ${euros(price)}`,
    continueHome: (price: number) => `Continue · ${euros(price)}`,
    notEnoughMoney: (money: number) =>
      `Not enough money (you have ${euros(money)})`,
    notEnoughDays: (daysAfter: number, total: number) =>
      `You'd use ${daysAfter} days, over the ${total}-day limit.`,
    // routesFrom() returns only the two codes above for a running journey; no
    // EXPERIENCE string exists for the rest. Placeholder noted in spec-1-6.
    unavailable: "Not available",
    warning: "Heads up: after this trip you can't get home in time.",
    noneFits: (city: string, money: number) =>
      `No route from ${city} fits your ${euros(money)}.`,
    options: "How to travel",
    close: "Close",
  },
  // Story 2.3 (EXPERIENCE → Copy templates: arrival, arrival.repeat,
  // arrival.unavailable = map.card.unavailable; DESIGN → Fact card caption).
  arrival: {
    eyebrow: (day: number, total: number, money: number) =>
      `You've arrived · Day ${day} of ${total} · ${euros(money)}`,
    welcome: (city: string) => `Welcome to ${city}`,
    backIn: (city: string) => `Back in ${city}`,
    trip: (
      mode: "plane" | "train" | "bus",
      from: string,
      days: number,
      price: number,
    ) =>
      `${{ plane: "Plane", train: "Train", bus: "Bus" }[mode]} from ${from} · ${dayCount(days)} · ${euros(price)}`,
    about: (city: string) => `About ${city}`,
    planDay: "Plan the day",
    costFirst: (price: number, city: string) =>
      `A city day here costs ${euros(price)} and 1 day, and earns your ${city} stamp.`,
    costRepeat: (price: number) =>
      `A city day here costs ${euros(price)} and 1 day. No new stamp this time.`,
    passThrough: "Just passing through",
    noStampYet: "No stamp unless you spend a day here",
    stamped: (city: string) => `You already have your ${city} stamp.`,
    notEnoughMoney: (money: number) =>
      `Not enough for a night here (you have ${euros(money)})`,
    noDays: "No days left for a city day",
    close: "Close",
  },
  error: {
    title: "Travel interrupted",
    // #37: a reload cannot fix invalid content (it is bundled at build time),
    // so the text does not promise that it will.
    body: "Something went wrong. Reload the page, or try again later.",
    reload: "Reload",
  },
} as const;
