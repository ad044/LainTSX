import { useStore } from "../../store";
import sleep from "../../utils/sleep";

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
          action: async () => {
            // todo check if data exists
            setLoadSuccessful(true);

            await sleep(1200);
            //todo actually load
            setLoadSuccessful(undefined);
          },
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  action && action();
};

export default gameLoader;
