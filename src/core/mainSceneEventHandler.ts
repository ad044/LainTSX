import nodeSelector, { getNode, getNodeHud } from "./nodeSelector";

const handleMainSceneEvent = (gameContext: any) => {
  let event;

  const keyPress = gameContext.keyPress;
  const subscene = gameContext.mainSubscene;
  const selectedLevel = gameContext.selectedLevel;
  const pauseMatrixIdx = gameContext.pauseMatrixIdx;
  const activePauseComponent = gameContext.activePauseComponent;
  const gameProgress = gameContext.gameProgress;
  const currentSite = gameContext.currentSite;

  const siteASaveState = gameContext.siteASaveState;
  const siteBSaveState = gameContext.siteBSaveState;

  let activeNode = gameContext.activeNode;
  let activeHud;
  let nodeMatrixIndices = gameContext.nodeMatrixIndices;
  let level = parseInt(gameContext.activeLevel);
  let siteRotY = gameContext.siteRotY;
  let sitePosY = gameContext.sitePosY;
  let scene = gameContext.scene;

  if (subscene === "site") {
    let selectedNodeData;
    switch (keyPress) {
      case "LEFT":
      case "RIGHT":
      case "DOWN":
      case "UP":
        selectedNodeData = nodeSelector({
          action: `site_${keyPress.toLowerCase()}`,
          activeId: activeNode,
          nodeMatrixIndices: nodeMatrixIndices,
          level: level,
          siteRotY: siteRotY,
          sitePosY: sitePosY,
          gameProgress: gameProgress,
          currentSite: currentSite,
        });

        if (selectedNodeData) {
          event = selectedNodeData.event;
          activeNode = selectedNodeData.node;
          nodeMatrixIndices = selectedNodeData.newNodeMatrixIndices;
          siteRotY = selectedNodeData.newSiteRotY;
          sitePosY = selectedNodeData.newSitePosY;
          level = selectedNodeData.newLevel!;
          activeHud = selectedNodeData.newActiveHud;
        }

        break;
      case "CIRCLE":
        // in this case we have to check the type of the blue orb
        // and dispatch an action depending on that, so we have to precalculate the
        // new active blue orb here.
        activeNode = getNode(level, nodeMatrixIndices, currentSite);

        const nodeType = activeNode.type;

        const eventAnimation = Math.random() < 0.4 ? "rip_node" : "throw_node";

        switch (nodeType) {
          case 0:
          case 2:
          case 4:
          case 3:
          case 5:
            event = `${eventAnimation}_media`;
            scene = "media";
            break;
          case 6:
            if (activeNode.node_name.substr(0, 3) === "TaK") {
              event = `${eventAnimation}_tak`;
              scene = "tak";
            } else {
              event = `${eventAnimation}_media`;
              scene = "media";
            }
            break;
          case 8:
            event = `${eventAnimation}_gate`;
            scene = "gate";
            break;
          case 7:
            event = `${eventAnimation}_sskn`;
            scene = "sskn";
            break;
        }
        break;
      case "L2":
        return { event: "toggle_level_selection", level: level };
      case "TRIANGLE":
        return { event: "pause_game" };
      case "SPACE":
        return { event: "play_with_hair", siteRotY: siteRotY };
    }

    return {
      event: event,
      nodeMatrixIndices: nodeMatrixIndices,
      sitePosY: sitePosY,
      siteRotY: siteRotY,
      level: level.toString().padStart(2, "0"),
      scene: scene,
      node: activeNode,
      hud: activeHud,
    };
  } else if (subscene === "level_selection") {
    switch (keyPress) {
      case "UP":
        if (currentSite === "a") {
          if (selectedLevel + 1 <= 22)
            return {
              event: `level_selection_up`,
              selectedLevelIdx: selectedLevel + 1,
            };
        } else if (currentSite === "b") {
          if (selectedLevel + 1 <= 13)
            return {
              event: `level_selection_up`,
              selectedLevelIdx: selectedLevel + 1,
            };
        }
        break;
      case "DOWN":
        if (selectedLevel - 1 >= 1)
          return {
            event: `level_selection_down`,
            selectedLevelIdx: selectedLevel - 1,
          };
        break;
      case "X":
        return {
          event: "level_selection_back",
          node: getNode(level, nodeMatrixIndices, currentSite),
          hud: getNodeHud(nodeMatrixIndices),
        };
      case "CIRCLE":
        const selectedNodeData = nodeSelector({
          action: "select_level",
          activeId: activeNode,
          nodeMatrixIndices: nodeMatrixIndices,
          level: selectedLevel,
          siteRotY: siteRotY,
          sitePosY: sitePosY,
          gameProgress: gameProgress,
          currentSite: currentSite,
        });

        if (level === selectedLevel) break;
        if (selectedNodeData) {
          const event =
            selectedLevel < level ? "select_level_down" : "select_level_up";
          return {
            event: event,
            nodeMatrixIndices: selectedNodeData.nodeMatrixIndices,
            sitePosY: -selectedNodeData.sitePosY!,
            level: selectedLevel.toString().padStart(2, "0"),
            node: selectedNodeData.node,
            hud: selectedNodeData.activeHud,
          };
        }
    }
  } else if (subscene === "pause") {
    switch (keyPress) {
      case "UP":
        if (pauseMatrixIdx - 1 < 0) break;
        return {
          event: "pause_up",
          pauseMatrixIdx: pauseMatrixIdx - 1,
        };
      case "DOWN":
        if (pauseMatrixIdx + 1 > 4) break;
        return {
          event: "pause_down",
          pauseMatrixIdx: pauseMatrixIdx + 1,
        };
      case "CIRCLE":
        return {
          event: `pause_${activePauseComponent}_select`,
          currentSitePosY: sitePosY,
          currentSiteRotY: siteRotY,
          currentNodeId: activeNode,
          currentNodeMatrixIndices: nodeMatrixIndices,
          currentHud: getNodeHud(nodeMatrixIndices),
          currentLevel: level.toString().padStart(2, "0"),
          site: currentSite === "a" ? "b" : "a",
        };
    }
  }
};

export default handleMainSceneEvent;
