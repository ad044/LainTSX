import { playAudio, useStore } from "../../store";
import * as audio from "../../static/sfx";

const handleBootSceneEvent = (eventState: any) => {
  const setState = useStore.setState;

  switch (eventState.event) {
    case "main_menu_up":
      setState({ activeMainMenuComponent: "authorize_user" });
      playAudio(audio.sound1);
      break;
    case "main_menu_down":
      setState({ activeMainMenuComponent: "load_data" });
      playAudio(audio.sound1);
      break;
    case "main_menu_load_data_select":
      setState({ bootSubscene: "load_data" });
      playAudio(audio.sound0);

      setTimeout(() => setState({ promptVisible: true }), 500);
      break;
    case "main_menu_authorize_user_select":
      setState({ authorizeUserLetterIdx: 0, bootSubscene: "authorize_user" });
      playAudio(audio.sound0);
      break;
    case "authorize_user_up":
    case "authorize_user_down":
    case "authorize_user_left":
    case "authorize_user_right":
      setState({
        authorizeUserLetterIdx: eventState.authorizeUserLetterIdx,
      });
      break;
    case "authorize_user_back":
      setState({
        playerName: "",
        bootSubscene: "main_menu",
      });
      playAudio(audio.sound29);
      break;
    case "update_player_name":
      setState({
        playerName: eventState.playerName,
      });
      playAudio(audio.sound0);
      break;
    case "update_player_name_denied":
      playAudio(audio.sound0);
      break;
    case "remove_last_char":
      setState({ playerName: eventState.playerName });
      playAudio(audio.sound29);
      break;
    case "load_data_no":
      setState({
        bootSubscene: "main_menu",
        promptVisible: false,
        activePromptComponent: "no",
      });
      playAudio(audio.sound29);
      break;
    case "load_data_yes":
      // todo check if data exists
      setState({ loadSuccessful: true });
      playAudio(audio.sound28);

      //todo actually load
      setTimeout(() => setState({ loadSuccessful: undefined }), 1200);
      break;
    case "prompt_left":
      setState({ activePromptComponent: "yes" });
      playAudio(audio.sound1);
      break;
    case "prompt_right":
      setState({ activePromptComponent: "no" });
      playAudio(audio.sound1);
      break;
    case "start_new_game":
      setState({ currentScene: "main", intro: true });
      break;
  }
};

export default handleBootSceneEvent;
