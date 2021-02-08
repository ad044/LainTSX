import { useStore } from "../../store";

const gameLoader = (eventState: any) => {
  const loadSiteSaveState = useStore.getState().loadSiteSaveState;
  const setLoadSuccessful = useStore.getState().setLoadSuccessful;

  const dispatchAction = (eventState: { event: string; site: "a" | "b" }) => {
    switch (eventState.event) {
      case "pause_change_select":
        return {
          action: () => loadSiteSaveState(eventState.site === "a" ? "b" : "a"),
        };
      case "pause_load_select":
      case "load_data_yes":
        return {
          action: () => {
            // todo check if data exists
            setLoadSuccessful(true);

            setTimeout(() => {
              //todo actually load
              setLoadSuccessful(undefined);
            }, 1200);
          },
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default gameLoader;
