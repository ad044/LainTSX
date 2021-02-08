import { useStore } from "../../store";

const promptManager = (eventState: any) => {
  const setComponentMatrixIdx = useStore.getState().setPromptComponentMatrixIdx;
  const setPromptVisible = useStore.getState().setPromptVisible;

  const exitAndResetPrompt = () => {
    setPromptVisible(false);
    setComponentMatrixIdx(1);
  };

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
        return { action: () => exitAndResetPrompt() };
      case "exit_prompt":
      case "load_data_no":
        return { action: () => exitAndResetPrompt() };
      case "main_menu_load_data_select":
        return {
          action: () => {
            setTimeout(() => {
              setPromptVisible(true);
            }, 500);
          },
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default promptManager;
