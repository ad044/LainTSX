import { useStore } from "../../../../../store";

type PauseManagerProps = { event: string; pauseMatrixIdx: number };

const pauseManager = (eventState: any) => {
  const setComponentMatrixIdx = useStore.getState().setPauseComponentMatrixIdx;
  const setExitAnimation = useStore.getState().setPauseExitAnimation;

  const dispatchAction = (eventState: PauseManagerProps) => {
    switch (eventState.event) {
      case "pause_up":
      case "pause_down":
        return {
          action: () => setComponentMatrixIdx(eventState.pauseMatrixIdx),
        };
      case "pause_exit_select":
        return {
          action: () => setExitAnimation(true),
        };
      case "pause_game":
        return { action: () => setExitAnimation(false) };
    }
  };
  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default pauseManager;
