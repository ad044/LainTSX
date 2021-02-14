import { useStore } from "../../store";
import { NodeDataType } from "../../components/MainScene/Site";
import sleep from "../../utils/sleep";

const progressManager = (eventState: any) => {
  const updateNodeViewed = useStore.getState().setNodeViewed;
  const setPolytanPartUnlocked = useStore.getState().setPolytanPartUnlocked;
  const incrementGateLvl = useStore.getState().incrementGateLvl;
  const incrementSSknLvl = useStore.getState().incrementSSknLvl;

  const nodesThatTurnInvisibleAfterWatching = ["SSkn", "GaTE", "P2"];

  const dispatchAction = (eventState: {
    event: string;
    bodyPart: string;
    node: NodeDataType;
  }) => {
    switch (eventState.event) {
      case "throw_node_tak":
      case "rip_node_tak":
        return {
          action: () =>
            updateNodeViewed(eventState.node.node_name, {
              is_viewed: 1,
              is_visible: Number(
                !nodesThatTurnInvisibleAfterWatching.some((node) =>
                  eventState.node.node_name.includes(node)
                )
              ),
            }),
          delay: 8000,
        };
      case "rip_node_gate":
      case "throw_node_gate":
        return {
          action: () => {
            updateNodeViewed(eventState.node.node_name, {
              is_viewed: 1,
              is_visible: Number(
                !nodesThatTurnInvisibleAfterWatching.some((node) =>
                  eventState.node.node_name.includes(node)
                )
              ),
            });
            incrementGateLvl();
          },
        };
      case "throw_node_polytan":
      case "rip_node_polytan":
        return {
          action: () => {
            updateNodeViewed(eventState.node.node_name, {
              is_viewed: 1,
              is_visible: Number(
                !nodesThatTurnInvisibleAfterWatching.some((node) =>
                  eventState.node.node_name.includes(node)
                )
              ),
            });
            setPolytanPartUnlocked(eventState.bodyPart);
          },
        };
      case "media_play_select":
        return {
          action: () =>
            updateNodeViewed(eventState.node.node_name, {
              is_viewed: 1,
              is_visible: Number(
                !nodesThatTurnInvisibleAfterWatching.some((node) =>
                  eventState.node.node_name.includes(node)
                )
              ),
            }),
        };
      case "sskn_ok_select":
        return {
          action: () => {
            updateNodeViewed(eventState.node.node_name, {
              is_viewed: 1,
              is_visible: Number(
                !nodesThatTurnInvisibleAfterWatching.some((node) =>
                  eventState.node.node_name.includes(node)
                )
              ),
            });
            incrementSSknLvl();
          },
        };
    }
  };

  const { action, delay } = { ...dispatchAction(eventState) };

  (async () => {
    delay && (await sleep(delay));
    action && action();
  })();
};

export default progressManager;
