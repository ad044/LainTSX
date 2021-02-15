import { useStore } from "../../../store";

const bootManager = (eventState: any) => {
  const setMainMenuComponentMatrixIdx = useStore.getState()
    .setMainMenuComponentMatrixIdx;

  const setAuthorizeUserLetterIdx = useStore.getState()
    .setAuthorizeUserLetterIdx;

  const setPlayerName = useStore.getState().setPlayerName;

  const dispatchAction = (eventState: {
    event: string;
    authorizeUserLetterIdx: number;
    playerName: string;
  }) => {
    switch (eventState.event) {
      case "main_menu_up":
        return {
          action: () => setMainMenuComponentMatrixIdx(0),
        };
      case "main_menu_down":
        return {
          action: () => setMainMenuComponentMatrixIdx(1),
        };
      case "main_menu_authorize_user_select":
        return { action: () => setAuthorizeUserLetterIdx(0) };
      case "authorize_user_up":
      case "authorize_user_down":
      case "authorize_user_left":
      case "authorize_user_right":
        return {
          action: () =>
            setAuthorizeUserLetterIdx(eventState.authorizeUserLetterIdx),
        };
      case "authorize_user_back":
        return {
          action: () => setPlayerName(""),
        };
      case "update_player_name":
        return {
          action: () => setPlayerName(eventState.playerName),
        };
      case "remove_last_char":
        return {
          action: () => setPlayerName(eventState.playerName),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) action();
};

export default bootManager;
