import { useStore } from "../../../../store";
import { useCallback } from "react";
import * as THREE from "three";

const mediaManager = (eventState: any) => {
  const toggleSide = useStore.getState().toggleMediaSide;
  const setLeftComponentMatrixIdx = useStore.getState()
    .setMediaLeftComponentMatrixIdx;

  const updateRightSide = useStore.getState().updateRightSide;

  const resetScene = useStore.getState().resetMediaScene;

  const setAudioAnalyser = useStore.getState().setAudioAnalyser;

  const playMedia = () => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    if (mediaElement && mediaElement.paused) {
      const listener = new THREE.AudioListener();
      const audio = new THREE.Audio(listener);

      audio.setMediaElementSource(mediaElement);

      setAudioAnalyser(new THREE.AudioAnalyser(audio, 2048));

      mediaElement.play();
    }
  };

  const exitMedia = () => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    if (mediaElement) {
      mediaElement.pause();
      mediaElement.currentTime = 0;
    }
    resetScene();
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
          action: () => toggleSide,
        };
      case "media_play_select":
        return { action: () => playMedia };
      case "media_exit_select":
        return { action: () => exitMedia };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default mediaManager;
