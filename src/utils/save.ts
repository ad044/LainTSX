import {
  GameProgress,
  GameSite,
  LegacyGameProgress,
  LegacyNodeData,
  LegacyNodeMatrixIndex,
  LegacySaveState,
  MatrixIndex2D,
  NodeData,
  NodeID,
  SaveState,
  State,
} from "@/types";
import nodesJson from "@/json/nodes.json";

const isValidNodeId = (str: string): str is NodeID => {
  for (const id of Object.keys(nodesJson)) {
    if (id === str) {
      return true;
    }
  }
  return false;
};

const nodeNameToId = (name: string): NodeID => {
  for (const node of Object.values(nodesJson)) {
    if (node.name === name) {
      return node.id as NodeID;
    }
  }

  throw `Couldn't map node name ${name} to an ID`;
};

const legacyNodeToNew = (old: LegacyNodeData): NodeData => {
  const id = `${old.id}${old.site.toLowerCase()}`;
  if (!isValidNodeId(id)) {
    throw `Node ID ${id} is not valid`;
  }

  const imageTableIndices = Object.values(old.image_table_indices).map((v) => {
    if (v === "-1") {
      return null;
    } else {
      return parseInt(v);
    }
  });
  const words = Object.values(old.words).map((v) => {
    if (v === "") {
      return null;
    } else {
      return v;
    }
  });
  const protocolLines = Object.values(old.protocol_lines).map((v) => {
    if (v === "") {
      return null;
    } else {
      return v;
    }
  });

  const unlockedBy =
    old.unlocked_by === "" ? null : nodeNameToId(old.unlocked_by);

  return {
    id: id,
    image_table_indices: imageTableIndices,
    level: parseInt(old.id.substring(0, 2)),
    media_file: old.media_file,
    name: old.node_name,
    position: parseInt(old.id.substring(2, 4)),
    protocol_lines: protocolLines,
    required_final_video_viewcount: old.required_final_video_viewcount,
    site: GameSite[old.site],
    title: old.title,
    triggers_final_video: old.triggers_final_video,
    type: old.type,
    upgrade_requirement: old.upgrade_requirement,
    words: words,
    unlocked_by: unlockedBy,
  };
};

const legacyNodeMatrixToNew = (
  old: LegacyNodeMatrixIndex | undefined
): MatrixIndex2D => {
  if (old === undefined) {
    throw "Matrix Indices not found";
  }

  return { row: old.rowIdx, col: old.colIdx };
};

const segmentFromLegacyNodeMatrix = (
  old: LegacyNodeMatrixIndex | undefined
) => {
  if (old === undefined) {
    throw "Matrix Indices not found for extracting segment";
  }

  return old.matrixIdx - 1;
};

const isValidGameProgressNodes = (obj: {
  [key: string]: { is_viewed: boolean };
}): obj is GameProgress["nodes"] => {
  for (const node in obj) {
    if (!isValidNodeId(node)) {
      return false;
    }
  }
  return true;
};

const legacyGameProgressToNew = (old: LegacyGameProgress): GameProgress => {
  const nodes = Object.fromEntries(
    Object.entries(old.nodes).map(([k, v]) => {
      return [nodeNameToId(k), { is_viewed: Boolean(v.is_viewed) }];
    })
  );

  if (!isValidGameProgressNodes(nodes)) {
    throw "Couldn't convert game progress nodes to new.";
  }
  return { ...old, nodes: nodes };
};

// during the rewrite i changed the format of the save state along with many
// other things, fortunately the old ones can be upgraded automatically
// this function serves that purpose
export const upgradeLegacySave = (old: LegacySaveState): SaveState => {
  return {
    siteSaveState: {
      [GameSite.A]: {
        node: legacyNodeToNew(old.siteSaveState.a.activeNode),
        siteSegment: segmentFromLegacyNodeMatrix(
          old.siteSaveState.a.activeNode.matrixIndices
        ),
        nodeMatrixIndex: legacyNodeMatrixToNew(
          old.siteSaveState.a.activeNode.matrixIndices
        ),
        level: parseInt(old.siteSaveState.a.activeLevel),
      },
      [GameSite.B]: {
        node: legacyNodeToNew(old.siteSaveState.b.activeNode),
        siteSegment: segmentFromLegacyNodeMatrix(
          old.siteSaveState.b.activeNode.matrixIndices
        ),
        nodeMatrixIndex: legacyNodeMatrixToNew(
          old.siteSaveState.b.activeNode.matrixIndices
        ),
        level: parseInt(old.siteSaveState.b.activeLevel),
      },
    },
    nodeMatrixIndex: legacyNodeMatrixToNew(old.activeNode.matrixIndices),
    node: legacyNodeToNew(old.activeNode),
    siteSegment: segmentFromLegacyNodeMatrix(old.activeNode.matrixIndices),
    level: parseInt(old.activeLevel),
    site: old.activeSite === "a" ? GameSite.A : GameSite.B,
    playerName: old.playerName,
    gameProgress: legacyGameProgressToNew(old.gameProgress),
  };
};

export const saveUserProgress = (state: State) => {
  const saveState: Partial<State> = {
    siteSaveState: state.siteSaveState,
    node: state.node,
    siteSegment: state.siteSegment,
    level: state.level,
    site: state.site,
    gameProgress: state.gameProgress,
    playerName: state.playerName,
  };

  localStorage.setItem("lainSaveStateV2", JSON.stringify(saveState));
};
