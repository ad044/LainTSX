import { playAudio, useStore } from "../../store";
import sleep from "../../utils/sleep";
import * as audio from "../../static/sfx";
import { NodeData } from "../../components/MainScene/Site";
import {
  nodeKnock,
  nodeKnockAndFall,
  nodeRip,
  nodeThrow,
  nodeTouchAndScare,
} from "../../utils/node-animations";

type MainSceneMutations = {
  level?: string;
  node?: NodeData;
};

const handleMainSceneEvent = (eventState: any) => {
  const setState = useStore.setState;

  const changeSite = useStore.getState().changeSite;

  switch (eventState.event) {
    case "site_up":
    case "site_down":
      (async () => {
        setState({
          lainMoveState: eventState.event,
          activeLevel: eventState.level,
          inputCooldown: true,
        });
        playAudio(audio.sound13);

        await sleep(1300);
        playAudio(audio.sound10);
        playAudio(audio.sound9);

        await sleep(1400);
        playAudio(audio.sound8);

        await sleep(1200);
        setState({
          activeNode: eventState.node,
          lainMoveState: "standing",
          inputCooldown: false,
        });
      })();
      break;
    case "site_left":
    case "site_right":
      (async () => {
        setState({
          lainMoveState: eventState.event,
          siteRot: [0, eventState.siteRotY, 0],
          inputCooldown: true,
        });

        await sleep(1100);
        playAudio(audio.sound6);
        playAudio(audio.sound34);

        await sleep(2800);
        setState({
          activeNode: eventState.node,
          lainMoveState: "standing",
          inputCooldown: false,
        });
      })();
      break;
    case "change_node":
      setState({ activeNode: eventState.node });
      playAudio(audio.sound1);
      break;
    case "throw_node_media":
    case "throw_node_sskn":
    case "throw_node_gate":
    case "throw_node_tak":
    case "throw_node_polytan":
      (async () => {
        setState({
          lainMoveState: "throw_node",
          oldLevel: eventState.level,
          oldSiteRot: [eventState.siteRotY, 0],
          inputCooldown: true,
        });

        nodeThrow(eventState.siteRotY);

        playAudio(audio.sound0);

        await sleep(1600);
        playAudio(audio.sound12);

        await sleep(1200);
        playAudio(audio.sound13);
        playAudio(audio.sound14);

        await sleep(650);

        setState({
          currentScene: eventState.event.split("_")[2],
          intro: false,
          lainMoveState: "standing",
        });
      })();
      break;
    case "rip_node_media":
    case "rip_node_gate":
    case "rip_node_sskn":
    case "rip_node_tak":
    case "rip_node_polytan":
      (async () => {
        setState({
          lainMoveState: "rip_node",
          oldLevel: eventState.level,
          oldSiteRot: [eventState.siteRotY, 0],
          inputCooldown: true,
        });
        nodeRip(eventState.siteRotY);
        playAudio(audio.sound0);

        await sleep(1600);
        playAudio(audio.sound12);

        await sleep(2400);
        playAudio(audio.sound15);
        playAudio(audio.sound13);

        await sleep(2000);
        setState({
          currentScene: eventState.event.split("_")[2],
          intro: false,
          lainMoveState: "standing",
        });
      })();
      break;
    case "touch_and_scare":
      (async () => {
        setState({
          lainMoveState: "touch_and_scare",
          inputCooldown: true,
        });
        nodeTouchAndScare(eventState.siteRotY);

        await sleep(2400);
        playAudio(audio.sound17);

        await sleep(750);
        playAudio(audio.sound33);

        await sleep(650);
        setState({
          lainMoveState: "standing",
          inputCooldown: false,
        });
      })();
      break;
    case "knock":
      (async () => {
        setState({ lainMoveState: "knock", inputCooldown: true });
        nodeKnock(eventState.siteRotY);

        await sleep(1200);
        playAudio(audio.sound18);

        await sleep(1700);
        setState({ lainMoveState: "standing", inputCooldown: false });
      })();
      break;
    case "knock_and_fall":
      (async () => {
        setState({ lainMoveState: "knock_and_fall", inputCooldown: true });
        nodeKnockAndFall(eventState.siteRotY);

        await sleep(1200);
        playAudio(audio.sound18);

        await sleep(1100);

        playAudio(audio.sound19);

        await sleep(850);
        playAudio(audio.sound33);

        await sleep(3350);
        setState({ lainMoveState: "standing", inputCooldown: false });
      })();
      break;
    case "enter_level_selection":
      setState({
        selectedLevel: eventState.level,
        mainSubscene: "level_selection",
      });
      playAudio(audio.sound1);
      break;
    case "level_selection_up":
    case "level_selection_down":
      setState({ selectedLevel: eventState.selectedLevelIdx });
      break;
    case "level_selection_back":
      setState({ mainSubscene: "site" });
      playAudio(audio.sound1);
      break;
    case "select_level_up":
    case "select_level_down":
      (async () => {
        setState({
          lainMoveState: eventState.event,
          activeLevel: eventState.level,
          mainSubscene: "site",
          inputCooldown: true,
        });

        await sleep(1300);
        playAudio(audio.sound10);
        playAudio(audio.sound9);

        await sleep(1400);
        playAudio(audio.sound8);

        await sleep(1200);
        setState({
          activeNode: eventState.node,
          lainMoveState: "standing",
          inputCooldown: false,
        });
      })();
      break;
    case "exit_not_found":
      setState({ mainSubscene: "site" });
      break;
    case "pause_game":
      (async () => {
        setState({
          lainMoveState: "pause_game",
          pauseExitAnimation: false,
          mainSubscene: "pause",
          inputCooldown: true,
        });
        playAudio(audio.sound7);

        await sleep(3600);
        useStore.getState().setSiteRotX(Math.PI / 2);
        playAudio(audio.sound23);
      })();
      break;
    case "pause_up":
    case "pause_down":
      setState({ activePauseComponent: eventState.activePauseComponent });
      playAudio(audio.sound1);
      break;
    case "pause_exit_select":
      setState({
        pauseExitAnimation: true,
        activePauseComponent: "change",
        siteRot: eventState.siteRot,
        inputCooldown: true,
      });
      playAudio(audio.sound0);

      setTimeout(
        () =>
          setState({
            mainSubscene: "site",
            inputCooldown: false,
            lainMoveState: "standing",
          }),
        1200
      );
      break;
    case "pause_about_select":
      setState({ showingAbout: true });
      playAudio(audio.sound0);
      break;
    case "exit_about":
      setState({ showingAbout: false });
      break;
    case "display_prompt":
      setState({ promptVisible: true });
      playAudio(audio.sound0);
      break;
    case "exit_prompt":
      setState({ promptVisible: false, activePromptComponent: "no" });
      playAudio(audio.sound28);
      break;
    case "prompt_left":
      setState({ activePromptComponent: "yes" });
      playAudio(audio.sound1);
      break;
    case "prompt_right":
      setState({ activePromptComponent: "no" });
      playAudio(audio.sound1);
      break;
    case "show_permission_denied":
      setState({ permissionDenied: true });
      playAudio(audio.sound0);

      setTimeout(() => setState({ permissionDenied: false }), 1200);
      break;
    case "pause_save_select":
      setState({ saveSuccessful: true });
      playAudio(audio.sound28);

      //todo actually save
      setTimeout(() => setState({ saveSuccessful: undefined }), 1200);
      break;
    case "pause_load_select":
      // todo check if data exists
      setState({ loadSuccessful: true });
      playAudio(audio.sound28);

      //todo actually load
      setTimeout(() => setState({ loadSuccessful: undefined }), 1200);
      break;
    case "pause_change_select":
      const siteToLoad: "a" | "b" = eventState.site;
      changeSite(siteToLoad);
  }
};

export default handleMainSceneEvent;
