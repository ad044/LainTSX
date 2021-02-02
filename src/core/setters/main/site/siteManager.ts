import { useStore } from "../../../../store";

const siteManager = (eventState: any) => {
  const setRotY = useStore.getState().setSiteRotY;
  const setRotX = useStore.getState().setSiteRotX;

  const dispatchAction = (eventState: any) => {
    switch (eventState.event) {
      case "site_left":
      case "site_right":
        return {
          action: () => setRotY(eventState.siteRotY),
          delay: 1100,
        };
      case "pause_game":
        return {
          action: () => setRotX(Math.PI / 2),
          delay: 3600,
        };
      case "pause_exit_select":
      case "pause_change_select":
        return {
          action: () => setRotX(0),
          delay: 0,
        };
    }
  };

  const { action, delay } = { ...dispatchAction(eventState) };

  if (action) {
    setTimeout(() => {
      action();
    }, delay);
  }
};

export default siteManager;
