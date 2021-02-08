import { getSiteState, useStore } from "../../store";

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
          action: () => {
            setSaveSuccessful(true);

            setTimeout(() => {
              //todo actually save
              setSaveSuccessful(undefined);
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

export default gameSaver;
