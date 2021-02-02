import { useStore } from "../../store";

const gameLoader = (eventState: any) => {
  const loadSiteSaveState = useStore.getState().loadSiteSaveState;

  const dispatchAction = (eventState: { event: string; site: "a" | "b" }) => {
    switch (eventState.event) {
      case "pause_change_select":
        return {
          action: () => loadSiteSaveState(eventState.site === "a" ? "b" : "a"),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default gameLoader;
