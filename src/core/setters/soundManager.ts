import { playAudio } from "../../store";
import * as audio from "../../static/sfx";

const soundManager = (eventState: any) => {
  const dispatchAction = (eventState: { event: string; scene: string }) => {
    switch (eventState.event) {
      case "throw_node_media":
      case "throw_node_gate":
      case "throw_node_sskn":
      case "throw_node_tak":
      case "throw_node_polytan":
        return {
          action: () => {
            playAudio(audio.sound0);

            setTimeout(() => {
              playAudio(audio.sound12);
            }, 1600);

            setTimeout(() => {
              playAudio(audio.sound13);
              playAudio(audio.sound14);
            }, 2800);
          },
        };

      case "update_player_name":
      case "update_player_name_denied":
      case "main_menu_authorize_user_select":
      case "main_menu_load_data_select":
        return {
          action: () => playAudio(audio.sound0),
        };
      case "site_left":
      case "site_right":
        return {
          action: () => {
            setTimeout(() => {
              playAudio(audio.sound6);
            }, 1100);
          },
        };
      case "site_up":
      case "site_down":
        return {
          action: () => {
            playAudio(audio.sound13);
            setTimeout(() => {
              playAudio(audio.sound10);
              playAudio(audio.sound9);
            }, 1300);

            setTimeout(() => {
              playAudio(audio.sound8);
            }, 2700);
          },
        };
      case "main_menu_down":
      case "main_menu_up":
      case "prompt_left":
      case "prompt_right":
      case "change_node":
        return {
          action: () => playAudio(audio.sound1),
        };
      case "authorize_user_back":
      case "remove_last_char":
      case "load_data_no":
        return {
          action: () => playAudio(audio.sound29),
        };
      case "load_data_yes":
        return {
          action: () => playAudio(audio.sound28),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default soundManager;
