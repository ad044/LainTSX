import { useStore } from "../../../store";
import * as THREE from "three";

const mediaManager = (eventState: any) => {
  const toggleSide = useStore.getState().toggleMediaSide;
  const setLeftComponentMatrixIdx = useStore.getState()
    .setMediaLeftComponentMatrixIdx;

  const setWordSelected = useStore.getState().setWordSelected;

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

  const dispatchAction = (eventState: {
    event: string;
    leftSideComponentIdx: 0 | 1;
    rightSideComponentIdx: 0 | 1 | 2;
    wordPosStateIdx: number;
  }) => {
    switch (eventState.event) {
      case "media_rightside_down":
      case "media_rightside_up":
        return {
          action: () =>
            updateRightSide(
              eventState.rightSideComponentIdx,
              eventState.wordPosStateIdx
            ),
        };
      case "media_leftside_down":
      case "media_leftside_up":
        return {
          action: () =>
            setLeftComponentMatrixIdx(eventState.leftSideComponentIdx),
        };
      case "media_leftside_right":
      case "media_rightside_left":
        return {
          action: () => toggleSide(),
        };
      case "media_play_select":
        return { action: () => playMedia() };
      case "media_exit_select":
        return { action: () => exitMedia() };
      case "media_fstWord_select":
      case "media_sndWord_select":
      case "media_thirdWord_select":
        return {
          action: () => {
            exitMedia();
            setWordSelected(true);
          },
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  action && action();
};

export default mediaManager;
