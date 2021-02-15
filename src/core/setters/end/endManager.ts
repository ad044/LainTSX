import { useStore } from "../../../store";

const endManager = (eventState: any) => {
  const setComponentMatrixIdx = useStore.getState().setEndComponentMatrixIdx;

  const dispatchAction = (eventState: { event: string }) => {
    switch (eventState.event) {
      case "end_selection_up":
        return {
          action: () => setComponentMatrixIdx(0),
        };
      case "end_selection_down":
        return {
          action: () => setComponentMatrixIdx(1),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) action();
};

export default endManager;
