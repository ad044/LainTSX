import gameProgressJson from "@/json/initial_progress.json";
import {
  GameSite,
  BootSubscene,
  EndComponent,
  GameScene,
  Key,
  LainAnimation,
  MainMenuComponent,
  MainSubscene,
  MediaComponent,
  MediaSide,
  PauseComponent,
  PromptComponent,
  SsknComponent,
  State,
  SaveStatus,
} from "@/types";
import { filterInvisibleNodes, getNode } from "@/utils/node";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLayout } from "@/utils/site";

const initialState = {
  // scene data
  scene: GameScene.Boot,

  // game progress
  gameProgress: gameProgressJson,

  // main subscene
  mainSubscene: MainSubscene.Site,

  // whether or not to play the intro anim on main scene
  intro: true,

  nodeMatrixIndex: { row: 1, col: 0 },
  node: getNode("0414a"),

  // lain
  lainAnimation: LainAnimation.Standing,

  // extra node data display
  protocolLinesEnabled: false,

  // camera tilt
  lastCameraTiltValue: -0.08,
  cameraTiltValue: 0,

  // site
  siteSegment: 6,
  site: GameSite.A,
  // layouts with invisible nodes filtered out (set to null)
  // this is basically  used as a global cache to avoid needlessly
  // recomputing/checking node visibility
  // (need to share it between navigation calculations & rendering).
  siteLayouts: {
    [GameSite.A]: filterInvisibleNodes(getLayout(GameSite.A), gameProgressJson),
    [GameSite.B]: filterInvisibleNodes(getLayout(GameSite.B), gameProgressJson),
  },

  // level
  level: 4,

  // level selection
  selectedLevel: 4,

  // end scene
  endComponent: EndComponent.End,
  endSceneSelectionVisible: false,

  // pause
  pauseComponent: PauseComponent.Change,
  showingAbout: false,
  permissionDenied: false,

  // media scene
  audioAnalyser: undefined,
  mediaPercentageElapsed: 0,

  mediaSide: MediaSide.Left,
  mediaComponent: MediaComponent.Play,
  lastMediaComponents: {
    left: MediaComponent.Play,
    right: MediaComponent.FirstWord,
  },
  wordStateIdx: 0,
  wordSelected: false,

  // idle scene
  idleStarting: false,
  idleSceneData: { mediaFile: "INS01.STR[0]" },

  // sskn scene
  ssknComponent: SsknComponent.Ok,
  ssknLoading: false,

  // player name
  playerName: "",

  // boot scene
  mainMenuComponent: MainMenuComponent.AuthorizeUser,
  letterMatrixIndex: { row: 1, col: 7 },
  bootSubscene: BootSubscene.MainMenu,

  // prompt
  promptVisible: false,
  promptComponent: PromptComponent.No,

  // word not found notification thing
  wordNotFound: false,

  // indicator for displaying save/load states
  saveStatus: SaveStatus.None,

  // save states for loading the game/changing sites
  siteSaveState: {
    [GameSite.A]: {
      node: getNode("0414a"),
      siteSegment: 6,
      nodeMatrixIndex: { row: 1, col: 0 },
      level: 4,
    },
    [GameSite.B]: {
      node: getNode("0105b"),
      siteSegment: 5,
      nodeMatrixIndex: { row: 2, col: 0 },
      level: 1,
    },
  },

  // keybindings
  keybindings: {
    ArrowDown: Key.Down,
    ArrowLeft: Key.Left,
    ArrowUp: Key.Up,
    ArrowRight: Key.Right,
    x: Key.Circle,
    z: Key.Cross,
    d: Key.Triangle,
    s: Key.Square,
    t: Key.R2,
    e: Key.L2,
    w: Key.L1,
    r: Key.R1,
    v: Key.Start,
    c: Key.Select,
  },

  language: "en",

  inputCooldown: -1,
};

export const useStore = create<State>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    prev: initialState,
    applyMutation: (mutation: Partial<State>) =>
      set((state) => {
        const curr = Object.fromEntries(
          Object.keys(mutation).map((key) => [
            key,
            state[key as keyof typeof state],
          ])
        );

        return { ...mutation, prev: { ...state.prev, curr } };
      }),
  }))
);
