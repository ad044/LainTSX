import game_progress from "../resources/initial_progress.json";

export type GameProgress = typeof game_progress;

export type NodeAttributes = {
  interactedWith: boolean;
  exploding: boolean;
  shrinking: boolean;
  visible: boolean;
};

export type GameScene =
  | "main"
  | "media"
  | "tak"
  | "sskn"
  | "polytan"
  | "idle_media"
  | "gate"
  | "boot"
  | "change_disc"
  | "end"
  | "null";

export type MainSubscene = "site" | "pause" | "level_selection";

export type ActiveSite = "a" | "b";

export type EndComponent = "end" | "continue";

export type PauseComponent = "load" | "about" | "change" | "save" | "exit";

export type MediaSide = "left" | "right";

export type LeftMediaComponent = "play" | "exit";

export type RightMediaComponent = "fstWord" | "sndWord" | "thirdWord";

export type MediaComponent = LeftMediaComponent | RightMediaComponent;

export type NodeMatrixIndices = {
  matrixIdx: number;
  rowIdx: number;
  colIdx: number;
};

export type NodeData = {
  id: string;
  image_table_indices: { 1: string; 2: string; 3: string };
  triggers_final_video: number;
  required_final_video_viewcount: number;
  media_file: string;
  node_name: string;
  site: string;
  type: number;
  title: string;
  unlocked_by: string;
  upgrade_requirement: number;
  words: { 1: string; 2: string; 3: string };
  matrixIndices?: NodeMatrixIndices;
  is_viewed?: number;
};

export type SiteSaveState = {
  a: {
    activeNode: NodeData;
    siteRot: number[];
    activeLevel: string;
  };
  b: {
    activeNode: NodeData;
    siteRot: number[];
    activeLevel: string;
  };
};

export type SsknComponent = "ok" | "cancel";

export type MainMenuComponent = "authorize_user" | "load_data";

export type BootSubscene = "main_menu" | "load_data" | "authorize_user";

export type PromptComponent = "yes" | "no";

export type PolytanBodyParts = {
  body: boolean;
  head: boolean;
  leftArm: boolean;
  rightArm: boolean;
  leftLeg: boolean;
  rightLeg: boolean;
};

type PromptContext = {
  activePromptComponent: PromptComponent;
  promptVisible: boolean;
};

export interface MainSceneContext extends PromptContext {
  activeNode: NodeData;
  showingAbout: boolean;
  level: number;
  activePauseComponent: PauseComponent;
  gameProgress: GameProgress;
  subscene: string;
  siteRotY: number;
  activeSite: ActiveSite;
  selectedLevel: number;
  wordNotFound: boolean;
  siteSaveState: SiteSaveState;
  canLainMove: boolean;
}

export type SsknSceneContext = {
  activeSsknComponent: SsknComponent;
  activeNode: NodeData;
};

export type MediaSceneContext = {
  wordPosStateIdx: number;
  currentMediaSide: MediaSide;
  activeMediaComponent: MediaComponent;
  activeNode: NodeData;
  gameProgress: GameProgress;
  lastActiveMediaComponents: {
    left: LeftMediaComponent;
    right: RightMediaComponent;
  };
  activeSite: ActiveSite;
};

export type AuthorizeUserMatrixIndices = {
  rowIdx: number;
  colIdx: number;
};

export interface BootSceneContext extends PromptContext {
  playerName: string;
  subscene: BootSubscene;
  activeMainMenuComponent: MainMenuComponent;
  authorizeUserMatrixIndices: AuthorizeUserMatrixIndices;
}

export type EndSceneContext = {
  activeEndComponent: EndComponent;
  selectionVisible: boolean;
  siteSaveState: SiteSaveState;
  activeNode: NodeData;
  siteRot: number[];
  activeLevel: string;
};

export type Level = {
  [key: string]: NodeData;
};

export type SiteData = {
  [key: string]: Level;
};

type Effect = () => void;
type Mutation = {
  mutation: object;
  delay?: number;
};
type EventAudio = {
  sfx: HTMLAudioElement[];
  delay?: number;
};
export type GameEvent = {
  state?: Mutation[];
  audio?: EventAudio[];
  effects?: Effect[];
};

export type HUDData = {
  mirrored: number;
  long: {
    position: number[];
    initial_position: number[];
  };
  boring: {
    position: number[];
    initial_position: number[];
  };
  big: {
    position: number[];
    initial_position: number[];
  };
  big_text: number[];
  medium_text: {
    position: number[];
    initial_position: number[];
  };
};

export type UserSaveState = {
  siteSaveState: SiteSaveState;
  activeNode: NodeData;
  siteRot: number[];
  activeLevel: string;
  activeSite: ActiveSite;
  gameProgress: GameProgress;
  playerName: string;
  polytanUnlockedParts: PolytanBodyParts;
};
