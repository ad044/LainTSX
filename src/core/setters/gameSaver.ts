import { getSiteState, useStore } from "../../store";
import sleep from "../../utils/sleep";

const gameSaver = (eventState: any) => {
  const setSiteSaveState = useStore.getState().setSiteSaveState;
  const setSaveSuccessful = useStore.getState().setSaveSuccessful;

  const dispatchAction = (eventState: { event: string; site: "a" | "b" }) => {
    switch (eventState.event) {
      case "pause_change_select":
        return {
          action: () =>
            setSiteSaveState(eventState.site, getSiteState(eventState.site)),
        };
      case "pause_save_select":
        return {
          action: async () => {
            setSaveSuccessful(true);

            await sleep(1200);
            //todo actually save
            setSaveSuccessful(undefined);
          },
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  action && action();
};

export default gameSaver;
