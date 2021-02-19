import { playAudio, useStore } from "../../store";
import * as audio from "../../static/sfx";

const handleMediaSceneEvent = (eventState: any) => {
  const setState = useStore.setState;

  const setNodeViewed = useStore.getState().setNodeViewed;
  const updateLeftSide = useStore.getState().updateLeftSide;
  const updateRightSide = useStore.getState().updateRightSide;

  const setPercentageElapsed = useStore.getState().setPercentageElapsed;

  const playMedia = () => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    if (mediaElement && mediaElement.paused) {
      setPercentageElapsed(0);

      mediaElement.play();
    }
  };

  const exitMedia = () => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    if (mediaElement) {
      mediaElement.pause();
      mediaElement.currentTime = 0;
    }
  };

  switch (eventState.event) {
    case "media_rightside_down":
    case "media_rightside_up":
      setState({
        activeMediaComponent: eventState.newActiveComponent,
        mediaWordPosStateIdx: eventState.wordPosStateIdx,
      });
      playAudio(audio.sound1);
      break;
    case "media_leftside_right":
      updateLeftSide(
        eventState.newActiveComponent,
        eventState.lastActiveComponent
      );
      break;
    case "media_rightside_left":
      updateRightSide(
        eventState.newActiveComponent,
        eventState.lastActiveComponent
      );
      break;
    case "media_play_select":
      setNodeViewed(eventState.node.node_name, {
        is_viewed: 1,
        is_visible: 1,
      });
      playMedia();
      break;
    case "media_exit_select":
      exitMedia();
      playAudio(audio.sound29);
      break;
    case "media_word_select":
      exitMedia();
      playAudio(audio.sound29);
      setState({
        wordSelected: true,
        activeLevel: eventState.level,
        siteRot: [0, eventState.siteRotY, 0],
        activeNode: eventState.node,
        currentScene: "main",
      });
      break;
    case "word_node_not_found":
      exitMedia();
      playAudio(audio.sound30);
      setState({
        mainSubscene: "not_found",
        currentScene: "main",
      });
  }
};

export default handleMediaSceneEvent;
