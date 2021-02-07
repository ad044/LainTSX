import { useStore } from "../../../../store";

type PauseManagerProps = { event: string; pauseMatrixIdx: number };

const pauseManager = (eventState: any) => {
  const setComponentMatrixIdx = useStore.getState().setPauseComponentMatrixIdx;
  const setExitAnimation = useStore.getState().setPauseExitAnimation;
  const setShowingAbout = useStore.getState().setShowingAbout;
  const setPermissionDenied = useStore.getState().setPermissionDenied;

  const dispatchAction = (eventState: PauseManagerProps) => {
    switch (eventState.event) {
      case "pause_up":
      case "pause_down":
        return {
          action: () => setComponentMatrixIdx(eventState.pauseMatrixIdx),
        };
      case "pause_exit_select":
        return {
          action: () => {
            setExitAnimation(true);
            setComponentMatrixIdx(2);
          },
        };
      case "show_permission_denied":
        return {
          action: () => {
            setPermissionDenied(true);
            setTimeout(() => {
              setPermissionDenied(false);
            }, 1200);
          },
        };
      case "pause_about_select":
        return {
          action: () => setShowingAbout(true),
        };
      case "exit_about":
        return {
          action: () => setShowingAbout(false),
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
