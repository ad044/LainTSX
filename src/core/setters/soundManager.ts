import { playAudio } from "../../store";
import * as audio from "../../static/sfx";

const soundManager = (eventState: any) => {
  const dispatchAction = (eventState: { event: string; scene: string }) => {
    switch (eventState.event) {
      case "knock_and_fall":
        return {
          action: () => {
            setTimeout(() => {
              playAudio(audio.sound14);
            }, 1200);

            setTimeout(() => {
              playAudio(audio.sound19);
            }, 2300);

            setTimeout(() => {
              playAudio(audio.sound33);
            }, 3150);
          },
        };
      case "knock":
        return {
          action: () => {
            setTimeout(() => {
              playAudio(audio.sound18);
            }, 1200);
          },
        };
      case "touch_and_scare":
        return {
          action: () => {
            setTimeout(() => {
              playAudio(audio.sound17);
            }, 2400);
            setTimeout(() => {
              playAudio(audio.sound33);
            }, 3150);
          },
        };
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
      case "rip_node_media":
      case "rip_node_gate":
      case "rip_node_sskn":
      case "rip_node_tak":
      case "rip_node_polytan":
        return {
          action: () => {
            playAudio(audio.sound0);

            setTimeout(() => {
              playAudio(audio.sound12);
            }, 1600);

            setTimeout(() => {
              playAudio(audio.sound15);
              playAudio(audio.sound13);
            }, 4000);
          },
        };

      case "update_player_name":
      case "update_player_name_denied":
      case "main_menu_authorize_user_select":
      case "main_menu_load_data_select":
      case "show_permission_denied":
      case "pause_about_select":
      case "display_prompt":
      case "pause_exit_select":
        return {
          action: () => playAudio(audio.sound0),
        };
      case "site_left":
      case "site_right":
        return {
          action: () => {
            setTimeout(() => {
              playAudio(audio.sound6);
              playAudio(audio.sound34);
            }, 1100);
          },
        };
      case "pause_game":
        return {
          action: () => {
            playAudio(audio.sound7);
            setTimeout(() => {
              playAudio(audio.sound23);
            }, 3400);
          },
        };
      case "select_level_up":
      case "select_level_down":
        return {
          action: () => {
            setTimeout(() => {
              playAudio(audio.sound10);
              playAudio(audio.sound9);
            }, 1300);

            setTimeout(() => {
              playAudio(audio.sound8);
            }, 2700);
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
      case "toggle_level_selection":
      case "level_selection_back":
      case "pause_up":
      case "pause_down":
      case "media_leftside_down":
      case "media_leftside_up":
      case "media_rightside_down":
      case "media_rightside_up":
        return {
          action: () => playAudio(audio.sound1),
        };
      case "authorize_user_back":
      case "remove_last_char":
      case "load_data_no":
      case "media_fstWord_select":
      case "media_sndWord_select":
      case "media_thirdWord_select":
      case "media_exit_select":
        return {
          action: () => playAudio(audio.sound29),
        };
      case "load_data_yes":
      case "exit_prompt":
      case "pause_save_select":
      case "pause_load_select":
      case "pause_change_select":
        return {
          action: () => playAudio(audio.sound28),
        };
      case "word_node_not_found":
        return {
          action: () => playAudio(audio.sound30),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default soundManager;
