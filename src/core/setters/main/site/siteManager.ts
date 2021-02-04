import { useStore } from "../../../../store";

const siteManager = (eventState: any) => {
  const setRotY = useStore.getState().setSiteRotY;
  const setRotX = useStore.getState().setSiteRotX;
  const setOldRot = useStore.getState().setOldSiteRot;

  const dispatchAction = (eventState: any) => {
    switch (eventState.event) {
      case "throw_node_media":
      case "rip_node_media":
        return {
          action: () => setOldRot([0, eventState.siteRotY, 0]),
        };
      case "site_left":
      case "site_right":
      case "media_fstWord_select":
      case "media_sndWord_select":
      case "media_thirdWord_select":
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
