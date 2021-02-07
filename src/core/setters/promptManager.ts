import { useStore } from "../../store";

const promptManager = (eventState: any) => {
  const setComponentMatrixIdx = useStore.getState().setPromptComponentMatrixIdx;
  const setPromptVisible = useStore.getState().setPromptVisible;

  const dispatchAction = (eventState: { event: string; scene: string }) => {
    switch (eventState.event) {
      case "display_prompt": {
        return { action: () => setPromptVisible(true) };
      }
      case "prompt_right":
        return {
          action: () => setComponentMatrixIdx(1),
        };
      case "prompt_left":
        return { action: () => setComponentMatrixIdx(0) };
      case "pause_change_select":
        return { action: () => setPromptVisible(false) };
      case "exit_prompt":
        return { action: () => setPromptVisible(false) };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default promptManager;
