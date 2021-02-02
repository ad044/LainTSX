import { getSiteState, useStore } from "../../store";

const gameSaver = (eventState: any) => {
  const setSiteSaveState = useStore.getState().setSiteSaveState;

  const dispatchAction = (eventState: { event: string; site: "a" | "b" }) => {
    switch (eventState.event) {
      case "pause_change_select":
        return {
          action: () =>
            setSiteSaveState(eventState.site, getSiteState(eventState.site)),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default gameSaver;
