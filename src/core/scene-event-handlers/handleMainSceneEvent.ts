import { playAudio, useStore } from "../../store";
import sleep from "../../utils/sleep";
import * as audio from "../../static/sfx";
import { NodeDataType } from "../../components/MainScene/Site";
import {
  nodeKnock,
  nodeKnockAndFall,
  nodeRip,
  nodeThrow,
  nodeTouchAndScare,
} from "../../utils/node-animations";

type MainSceneMutations = {
  level?: string;
  node?: NodeDataType;
};

const handleMainSceneEvent = (eventState: any) => {
  const setState = useStore.setState;

  switch (eventState.event) {
    case "site_up":
    case "site_down":
      (async () => {
        setState({
          lainMoveState: eventState.event,
          activeLevel: eventState.level,
        });
        playAudio(audio.sound13);

        await sleep(1300);
        playAudio(audio.sound10);
        playAudio(audio.sound9);

        await sleep(1400);
        playAudio(audio.sound8);

        await sleep(1200);
        setState({ activeNode: eventState.node });
      })();
      break;
    case "site_left":
    case "site_right":
      (async () => {
        setState({
          lainMoveState: eventState.event,
          siteRot: [0, eventState.siteRotY, 0],
        });

        await sleep(1100);
        playAudio(audio.sound6);
        playAudio(audio.sound34);

        await sleep(2800);
        setState({ activeNode: eventState.node });
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
        });
      })();
      break;
    case "touch_and_scare":
      (async () => {
        setState({
          lainMoveState: "touch_and_scare",
        });
        nodeTouchAndScare(eventState.siteRotY);

        await sleep(2400);
        playAudio(audio.sound17);

        await sleep(750);
        playAudio(audio.sound33);
      })();
      break;
    case "knock":
      (async () => {
        setState({ lainMoveState: "knock" });
        nodeKnock(eventState.siteRotY);

        await sleep(1200);
        playAudio(audio.sound18);
      })();
      break;
    case "knock_and_fall":
      (async () => {
        setState({ lainMoveState: "knock_and_fall" });
        nodeKnockAndFall(eventState.siteRotY);

        await sleep(1200);
        playAudio(audio.sound18);

        await sleep(1100);

        playAudio(audio.sound19);

        await sleep(850);
        playAudio(audio.sound33);
      })();
      break;
    case "enter_level_selection":
      (async () => {
        setState({
          selectedLevel: eventState.level,
          mainSubscene: "level_selection",
        });
        playAudio(audio.sound1);
      })();
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
        });

        await sleep(1300);
        playAudio(audio.sound10);
        playAudio(audio.sound9);

        await sleep(1400);
        playAudio(audio.sound8);

        await sleep(1200);
        setState({ activeNode: eventState.node });
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
        });
        playAudio(audio.sound7);

        await sleep(3400);
        playAudio(audio.sound23);

        await sleep(200);
        useStore.getState().setSiteRotX(Math.PI / 2);
      })();
      break;
    case "pause_up":
    case "pause_down":
      setState({ pauseComponentMatrixIdx: eventState.pauseMatrixIdx });
      playAudio(audio.sound1);
      break;
    case "pause_exit_select":
      (async () => {
        setState({
          pauseExitAnimation: true,
          pauseComponentMatrixIdx: 2,
          siteRot: eventState.siteRot,
        });
        playAudio(audio.sound0);

        await sleep(1100);
        setState({ mainSubscene: "site" });
      })();
  }
};

export default handleMainSceneEvent;
