import type {
  AbilityContent,
  BubbleContent,
  MilestoneContent,
  MomentContent,
  UniverseObject,
} from "@/types/chapter";

/**
 * ALL narrative content lives here — design.md §6.3 / §15.
 * Every personal detail is a clearly marked [PLACEHOLDER: …].
 * Replacing content never requires touching animation code.
 */

export const content = {
  /* ---- CH 01 — THE AWAKENING ---- */
  ch01: {
    edition: "VOL. 06",
    brand: "BIZARRE LOVE",
    headline: "OUR BIZARRE ADVENTURE!",
    tagline: "SIX MONTHS. ONE STORY.",
    sfx: ["GOROGORO", "DODODO"],
    scrollCue: "SCROLL TO BEGIN",
    beginLabel: "BEGIN THE STORY",
    panels: [
      { id: "p1", label: "CHAPTER 01" },
      { id: "p2", label: "SIX MONTHS" },
      { id: "p3", label: "[PLACEHOLDER: PHOTO 01]" },
      { id: "p4", label: "EST. VOL. 06" },
    ],
  },

  /* ---- CH 02 — THE FIRST ENCOUNTER ---- */
  ch02: {
    kicker: "CHAPTER 02 — THE FIRST ENCOUNTER",
    headline: "IT STARTED WITH A HELLO.",
    intro:
      "[PLACEHOLDER: Replace this with the real story of how you two met — the place, the date, the first message. Keep it as long or short as you like; the panels below will print in as you scroll.]",
    panels: [
      {
        id: "e1",
        label: "PANEL 01",
        caption: "[PLACEHOLDER: where you first met]",
        art: "scene" as const,
      },
      {
        id: "e2",
        label: "PANEL 02",
        caption: "[PLACEHOLDER: the first conversation]",
        art: "blocks" as const,
      },
      {
        id: "e3",
        label: "PANEL 03",
        caption: "[PLACEHOLDER: the first laugh together]",
        art: "dots" as const,
      },
      {
        id: "e4",
        label: "PANEL 04",
        caption: "[PLACEHOLDER: the moment you both knew]",
        art: "burst" as const,
      },
    ],
    bubbles: [
      {
        id: "b1",
        speaker: "HIM",
        text: "[PLACEHOLDER: his first message]",
      },
      {
        id: "b2",
        speaker: "YOU",
        text: "[PLACEHOLDER: your first reply]",
      },
      {
        id: "b3",
        speaker: "BOTH",
        text: "[PLACEHOLDER: the message that changed everything]",
      },
    ] satisfies BubbleContent[],
  },

  /* ---- CH 03 — THE STAND AWAKENS ---- */
  ch03: {
    kicker: "CHAPTER 03 — THE STAND AWAKENS",
    standName: "[PLACEHOLDER: STAND NAME]",
    standUser: "[PLACEHOLDER: STAND USER]",
    standCall: "THE STAND OF US.",
    intro:
      "[PLACEHOLDER: Describe your relationship as a Stand — a power that manifests from your bond. Replace these abilities with your own.]",
    abilities: [
      {
        id: "a1",
        name: "DEVOTION",
        rank: "A",
        detail: "[PLACEHOLDER: ability description]",
      },
      {
        id: "a2",
        name: "LAUGHING POWER",
        rank: "S",
        detail: "[PLACEHOLDER: ability description]",
      },
      {
        id: "a3",
        name: "ALWAYS THERE",
        rank: "A",
        detail: "[PLACEHOLDER: ability description]",
      },
      {
        id: "a4",
        name: "NO STAND CAN BEAT",
        rank: "?",
        detail: "[PLACEHOLDER: ability description]",
      },
    ] satisfies AbilityContent[],
    inspectHint: "DRAG / HOVER TO INSPECT",
  },

  /* ---- CH 04 — OUR BIZARRE MOMENTS ---- */
  ch04: {
    kicker: "CHAPTER 04 — OUR BIZARRE MOMENTS",
    headline: "CERTIFIED UNHINGED.",
    hint: "CLICK A PANEL TO OPEN THE MEMORY",
    moments: [
      {
        id: "m1",
        title: "[PLACEHOLDER: inside joke #1]",
        body: "[PLACEHOLDER: Describe the funny moment — what happened, why it was ridiculous, and the catchphrase it produced.]",
        tag: "LEGENDARY",
      },
      {
        id: "m2",
        title: "[PLACEHOLDER: chaotic day out]",
        body: "[PLACEHOLDER: The plan that went off the rails and became a core memory.]",
        tag: "CHAOS",
      },
      {
        id: "m3",
        title: "[PLACEHOLDER: the 2AM conversation]",
        body: "[PLACEHOLDER: The unhinged late-night thread neither of you can forget.]",
        tag: "2 AM",
      },
      {
        id: "m4",
        title: "[PLACEHOLDER: reaction of the year]",
        body: "[PLACEHOLDER: The face, the scream, the sound effect — document it here.]",
        tag: "WHAAT",
      },
      {
        id: "m5",
        title: "[PLACEHOLDER: our worst idea]",
        body: "[PLACEHOLDER: It sounded good at the time. Tell the whole story.]",
        tag: "DO NOT",
      },
      {
        id: "m6",
        title: "[PLACEHOLDER: victory lap]",
        body: "[PLACEHOLDER: A win you celebrated like a championship final.]",
        tag: "GOAT",
      },
    ] satisfies MomentContent[],
    sfx: "BAM! BAM!",
  },

  /* ---- CH 05 — THE QUIET BETWEEN BATTLES ---- */
  ch05: {
    kicker: "CHAPTER 05",
    headline: "In the quiet, I still choose you.",
    lines: [
      "[PLACEHOLDER: a soft memory — a rainy afternoon, a long walk, a held hand]",
      "[PLACEHOLDER: what you notice about him when nobody else is looking]",
      "[PLACEHOLDER: the sentence you'd say if the world went silent]",
    ],
    signature: "— [PLACEHOLDER: your name / signature]",
    footnote: "THE QUIET BETWEEN BATTLES",
  },

  /* ---- CH 06 — OUR UNIVERSE ---- */
  ch06: {
    kicker: "CHAPTER 06 — OUR UNIVERSE",
    headline: "EVERYTHING WE ORBIT.",
    hint: "TAP AN OBJECT TO READ ITS FILE",
    objects: [
      {
        id: "o1",
        label: "FAVORITE CHARACTER",
        detail:
          "[PLACEHOLDER: who is his favorite JoJo character and why he loves them]",
        icon: "star" as const,
      },
      {
        id: "o2",
        label: "OUR REWATCH LIST",
        detail: "[PLACEHOLDER: the episodes/arcs you always return to]",
        icon: "planet" as const,
      },
      {
        id: "o3",
        label: "THE SONG",
        detail: "[PLACEHOLDER: the track that is officially ours]",
        icon: "cassette" as const,
      },
      {
        id: "o4",
        label: "OUR STAND OFF",
        detail: "[PLACEHOLDER: the harmless rivalry that never ends]",
        icon: "bolt" as const,
      },
      {
        id: "o5",
        label: "THE PROMISE",
        detail: "[PLACEHOLDER: a promise you made to each other]",
        icon: "ring" as const,
      },
      {
        id: "o6",
        label: "NEXT ARC",
        detail: "[PLACEHOLDER: a plan you're both saving up for]",
        icon: "diamond" as const,
      },
    ] satisfies UniverseObject[],
  },

  /* ---- CH 07 — GOLDEN MEMORIES ---- */
  ch07: {
    kicker: "CHAPTER 07 — GOLDEN MEMORIES",
    headline: "SIX MONTHS, MILESTONED.",
    hint: "SCROLL TO ADVANCE THE TIMELINE",
    milestones: [
      {
        id: "ms1",
        marker: "MILESTONE 01",
        date: "[PLACEHOLDER: DATE]",
        title: "[PLACEHOLDER: how it started]",
        body: "[PLACEHOLDER: The first milestone — what officially happened and how it felt.]",
      },
      {
        id: "ms2",
        marker: "MILESTONE 02",
        date: "[PLACEHOLDER: DATE]",
        title: "[PLACEHOLDER: first date / first meetup]",
        body: "[PLACEHOLDER: The moment you met in person — sights, sounds, stomach full of butterflies.]",
      },
      {
        id: "ms3",
        marker: "MILESTONE 03",
        date: "[PLACEHOLDER: DATE]",
        title: "[PLACEHOLDER: the inside-joke origin]",
        body: "[PLACEHOLDER: The day a joke was born that will outlive us all.]",
      },
      {
        id: "ms4",
        marker: "MILESTONE 04",
        date: "[PLACEHOLDER: DATE]",
        title: "[PLACEHOLDER: the hard day you got through]",
        body: "[PLACEHOLDER: A tough day made survivable because you had each other.]",
      },
      {
        id: "ms5",
        marker: "MILESTONE 05",
        date: "TODAY",
        title: "SIX MONTHS TOGETHER",
        body: "[PLACEHOLDER: what this milestone means to you, in your own words]",
      },
    ] satisfies MilestoneContent[],
  },

  /* ---- CH 08 — THE LETTER ---- */
  ch08: {
    kicker: "CHAPTER 08 — THE LETTER",
    headline: "A letter, at last.",
    paragraphs: [
      "[PLACEHOLDER: Opening — address him by name and say why you're writing this.]",
      "[PLACEHOLDER: Middle — the thing you've wanted to say for a while: what he means to you, what you've learned together, what you noticed when nobody was watching.]",
      "[PLACEHOLDER: Middle — a specific memory you keep replaying, told simply and honestly.]",
      "[PLACEHOLDER: Ending — what you want the next six months, and the ones after that, to look like.]",
    ],
    signOff: "[PLACEHOLDER: love, your name]",
    seal: "VOL. 06",
  },

  /* ---- CH 09 — TO BE CONTINUED ---- */
  ch09: {
    kicker: "CHAPTER 09",
    lines: ["SIX MONTHS DOWN.", "OUR STORY CONTINUES."],
    final: "TO BE CONTINUED...",
    sentiment: "[PLACEHOLDER: one closing sentence, in your own words]",
    cta: "READ IT AGAIN FROM THE TOP",
    footerNote: "BIZARRE LOVE — VOL. 06 · SIX MONTHS. ONE STORY.",
  },
};
