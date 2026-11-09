/* Chapter system types — design.md §6 / §7 (data-driven chapters) */

export type ChapterTone =
  | "explosive"
  | "playful"
  | "theatrical"
  | "energetic"
  | "intimate"
  | "adventurous"
  | "triumphant"
  | "editorial"
  | "cathartic";

export type TransitionKind =
  | "angularWipe"
  | "panelPrint"
  | "chromaticFlash"
  | "stackSnap"
  | "sheetSlide"
  | "gridExtend"
  | "milestoneRelease"
  | "sealStamp"
  | "none";

/** Visual theme of a chapter's ground */
export type ChapterGround = "yellow" | "ink" | "paper";

export interface ChapterTheme {
  ground: ChapterGround;
  /** Text color on this ground */
  fg: "ink" | "paper";
  /** Supporting accent used by this chapter */
  accent: "impact" | "electric" | "primary";
}

export interface ChapterMeta {
  /** 1..9 */
  index: number;
  /** DOM id — navigation target */
  id: string;
  /** Two-digit display number, e.g. "01" */
  number: string;
  title: string;
  subtitle: string;
  /** Placeholder — real character list never invented (design.md §6.3) */
  characterTheme: string;
  tone: ChapterTone;
  theme: ChapterTheme;
  transitionIn: TransitionKind;
  transitionOut: TransitionKind;
  /** Emotional chapters collapse the navigator (design.md §10.4) */
  minimizeNavigator: boolean;
}

/* ---------- Per-chapter content shapes (all placeholder) ---------- */

export interface PanelContent {
  id: string;
  label: string;
  caption: string;
  /** Procedural art variant key */
  art: "blocks" | "burst" | "dots" | "portrait" | "scene" | "strip";
}

export interface BubbleContent {
  id: string;
  speaker: string;
  text: string;
}

export interface AbilityContent {
  id: string;
  name: string;
  rank: string;
  detail: string;
}

export interface MomentContent {
  id: string;
  title: string;
  body: string;
  tag: string;
}

export interface UniverseObject {
  id: string;
  label: string;
  detail: string;
  icon: "star" | "ring" | "diamond" | "bolt" | "cassette" | "planet";
}

export interface MilestoneContent {
  id: string;
  marker: string;
  date: string;
  title: string;
  body: string;
}
