// All player-facing text (AD-9). Keys follow the EXPERIENCE copy keys; the
// `error.*` keys are new in Story 1.3 (fallback screen of the error boundary).
// Story 1.5 adds `start.*`, `intro.*`, the "How to play" row of `menu` and the
// hidden map heading. Strings not in the EXPERIENCE copy table come from the
// mockups and are listed in spec-1-5 (intro steps from screens-core S2, the
// passport help line from screens-ext-1 X1a).
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
  },
  error: {
    title: "Travel interrupted",
    // #37: a reload cannot fix invalid content (it is bundled at build time),
    // so the text does not promise that it will.
    body: "Something went wrong. Reload the page, or try again later.",
    reload: "Reload",
  },
} as const;
