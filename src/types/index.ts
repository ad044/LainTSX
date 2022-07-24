import gameProgressJson from "@/json/initial_progress.json";
import legacyGameProgressJson from "@/json/legacy/initial_progress.json";
import { AudioAnalyser } from "three";
import nodesJson from "@/json/nodes.json";

export enum Key {
  Left,
  Right,
  Up,
  Down,
  L1,
  L2,
  R1,
  R2,
  Circle,
  Triangle,
  Cross,
  Square,
  Select,
  Start,
}

export enum SaveStatus {
  None,
  SaveSuccessful,
  LoadFailure,
  LoadSuccessful,
}

export type GameProgress = typeof gameProgressJson;

export enum LainAnimation {
  Standing,
  MoveLeft,
  MoveRight,
  JumpUp,
  JumpDown,
  KnockAndFall,
  TouchNodeAndGetScared,
  Knock,
  SelectLevelDown,
  SelectLevelUp,
  ThrowNode,
  RipMiddleRing,
  RipNode,
  Prayer,
  ScratchHead,
  Spin,
  Stretch,
  Stretch2,
  Thinking,
  TouchSleeve,
  Blush,
  HandsBehindHead,
  HandsOnHips,
  HandsOnHips2,
  HandsTogether,
  LeanForward,
  LeanLeft,
  LeanRight,
  LookAround,
  PlayWithHair,
}

export type NodeID = keyof typeof nodesJson;

export type State = {
  scene: GameScene;

  gameProgress: GameProgress;

  mainSubscene: MainSubscene;

  intro: boolean;

  nodeMatrixIndex: MatrixIndex2D;
  node: NodeData | null;

  protocolLinesEnabled: boolean;

  lainAnimation: LainAnimation;

  lastCameraTiltValue: number;
  cameraTiltValue: number;

  siteSegment: number;
  site: GameSite;
  siteLayouts: Record<GameSite, SiteLayout>;

  level: number;

  selectedLevel: number;

  endComponent: EndComponent;
  endSceneSelectionVisible: boolean;

  pauseComponent: PauseComponent | null;
  showingAbout: boolean;
  permissionDenied: boolean;

  audioAnalyser: AudioAnalyser | undefined;
  mediaPercentageElapsed: number;
  mediaSide: MediaSide;
  mediaComponent: MediaComponent;
  lastMediaComponents: { left: MediaComponent; right: MediaComponent };
  wordStateIdx: number;
  wordSelected: boolean;

  idleStarting: boolean;
  idleSceneData: IdleSceneData;

  ssknComponent: SsknComponent;
  ssknLoading: boolean;

  playerName: string;

  mainMenuComponent: MainMenuComponent;
  letterMatrixIndex: MatrixIndex2D;
  bootSubscene: BootSubscene;

  promptVisible: boolean;
  promptComponent: PromptComponent;

  saveStatus: SaveStatus;

  wordNotFound: boolean;

  siteSaveState: SiteSaveState;

  keybindings: Record<string, Key>;

  language: string;

  inputCooldown: number;

  prev: Omit<State, "applyMutation" | "prev">;

  applyMutation: (mutation: Partial<State>) => void;
};

export type IdleSceneData = {
  mediaFile: string;
  nodeName?: string;
  imageTableIndices?: NodeData["image_table_indices"];
};

export enum GameScene {
  Main,
  Media,
  Tak,
  Sskn,
  Polytan,
  Idle,
  Gate,
  Boot,
  ChangeDisc,
  End,
  None,
}

export enum MainSubscene {
  Site,
  Pause,
  LevelSelection,
}

export enum GameSite {
  A = "A",
  B = "B",
}

export enum EndComponent {
  End,
  Continue,
}

export enum PauseComponent {
  Load,
  About,
  Change,
  Save,
  Exit,
}

export enum MediaSide {
  Left,
  Right,
}

export enum MediaComponent {
  Play,
  Exit,
  FirstWord,
  SecondWord,
  ThirdWord,
}

export type NodeData = {
  id: NodeID;
  image_table_indices: (number | null)[];
  triggers_final_video: number;
  required_final_video_viewcount: number;
  media_file: string;
  name: string;
  site: GameSite;
  type: number;
  title: string;
  unlocked_by: NodeID | null;
  upgrade_requirement: number;
  words: (string | null)[];
  protocol_lines: (string | null)[];
  position: number;
  level: number;
};

type SiteSave = {
  node: State["node"];
  siteSegment: State["siteSegment"];
  nodeMatrixIndex: State["nodeMatrixIndex"];
  level: State["level"];
};

export type SiteSaveState = {
  [GameSite.A]: SiteSave;
  [GameSite.B]: SiteSave;
};

export enum SsknComponent {
  Ok,
  Cancel,
}

export enum MainMenuComponent {
  AuthorizeUser,
  LoadData,
}

export enum BootSubscene {
  MainMenu,
  LoadData,
  AuthorizeUser,
}

export enum PromptComponent {
  Yes,
  No,
}

export type SiteData = Record<string, NodeData>;

type Effect = () => void;

export type Mutation = Partial<State>;

type MutationData = {
  mutation: Mutation;
  delay?: number;
};

type EventAudio = {
  sfx: string[]; // filenames
  delay?: number;
};

type AdditionalGameEvent = {
  event: GameEvent;
  delay?: number;
};

export type GameEvent = {
  state?: MutationData[];
  audio?: EventAudio[];
  effects?: Effect[];
  additionalEvents?: AdditionalGameEvent[];
};

export type HUDData = {
  mirrored: boolean;
  long: Position;
  boring: Position;
  big: Position;
  text: Position;
  protocol_line_positions: [Position, Position, Position];
};

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export type MatrixIndex2D = {
  row: number;
  col: number;
};

export type Position = [number, number, number];

export type Scale = [number, number, number];

export type Rotation = [number, number, number];

export type NavigationResult = {
  node: State["node"];
  nodeMatrixIndex: State["nodeMatrixIndex"];
  siteSegment: State["siteSegment"];
  level: State["level"];
  didMove: boolean;
};

export type NodeRow = (NodeID | null)[];

export type NodeMatrix = NodeRow[];

export type SiteLayout = NodeMatrix[];

// flattened version of sitelayout, for easier iteration during render
export type FlattenedSiteLayout = NodeID[][];

export type ActiveNodeAttributes = {
  overrideTransform: boolean;
  exploding: boolean;
  shrinking: boolean;
  visible: boolean;
};

export type FontData = {
  glyphs: Record<string, number[]>;
};

export enum TextType {
  BigYellow,
  BigOrange,
  MediumGreen,
  MediumOrange,
  MediumBlack,
  MediumWhite,
  Jp,
}
export type SaveState = {
  siteSaveState: State["siteSaveState"];
  node: State["node"];
  nodeMatrixIndex: State["nodeMatrixIndex"];
  siteSegment: State["siteSegment"];
  level: State["level"];
  site: State["site"];
  gameProgress: State["gameProgress"];
  playerName: State["playerName"];
};

// legacy types for converting old data (save states) to new
// in a type-safe manner
export type LegacyGameProgress = typeof legacyGameProgressJson;

export type LegacyNodeMatrixIndex = {
  matrixIdx: number;
  rowIdx: number;
  colIdx: number;
};

export type LegacyNodeData = {
  id: string;
  image_table_indices: { 1: string; 2: string; 3: string };
  triggers_final_video: number;
  required_final_video_viewcount: number;
  media_file: string;
  node_name: string;
  site: "A" | "B";
  type: number;
  title: string;
  unlocked_by: string;
  upgrade_requirement: number;
  words: { 1: string; 2: string; 3: string };
  protocol_lines: {
    1: string;
    2: string;
    3: string;
  };
  matrixIndices?: LegacyNodeMatrixIndex;
  is_viewed?: number;
};

export type LegacySaveState = {
  siteSaveState: {
    a: {
      activeNode: LegacyNodeData;
      siteRot: number[];
      activeLevel: string;
    };
    b: {
      activeNode: LegacyNodeData;
      siteRot: number[];
      activeLevel: string;
    };
  };
  activeNode: LegacyNodeData;
  siteRot: number[];
  activeLevel: string;
  activeSite: "a" | "b";
  gameProgress: LegacyGameProgress;
  playerName: string;
};
