import { useStore } from "../../store";

const progressManager = (eventState: any) => {
  const updateNodeViewed = useStore.getState().setNodeViewed;

  const dispatchAction = (eventState: { event: string; nodeName: string }) => {
    switch (eventState.event) {
      case "media_exit_select":
      case "sskn_ok_select":
        return {
          action: () => updateNodeViewed(eventState.nodeName),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default progressManager;
