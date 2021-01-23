import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useMainSceneStore, useMediaWordStore } from "../../../store";
import * as THREE from "three";

const MediaComponentManager = (props: StateManagerProps) => {
  const toggleSide = useMainSceneStore((state) => state.toggleMediaSide);
  const setLeftComponentMatrixIdx = useMainSceneStore(
    (state) => state.setMediaLeftComponentMatrixIdx
  );
  const setRightComponentMatrixIdx = useMainSceneStore(
    (state) => state.setMediaRightComponentMatrixIdx
  );
  const setWordPosStateIdx = useMediaWordStore((state) => state.setPosStateIdx);

  const resetComponentMatrixIndices = useMainSceneStore(
    (state) => state.resetMediaComponentMatrixIndices
  );
  const resetWordPosStateIdx = useMediaWordStore(
    (state) => state.resetPosStateIdx
  );

  const setAudioAnalyser = useMainSceneStore((state) => state.setAudioAnalyser);

  const playMedia = useCallback(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    if (mediaElement && mediaElement.paused) {
      const listener = new THREE.AudioListener();
      const audio = new THREE.Audio(listener);

      audio.setMediaElementSource(mediaElement);

      setAudioAnalyser(new THREE.AudioAnalyser(audio, 2048));

      mediaElement.play();
    }
  }, [setAudioAnalyser]);

  const exitMedia = useCallback(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    if (mediaElement) {
      mediaElement.pause();
      mediaElement.currentTime = 0;
    }
  }, []);

  const updateRightSide = useCallback(
    (newRightSideComponentIdx: 0 | 1 | 2, newWordPosStateIdx: number) => {
      setRightComponentMatrixIdx(newRightSideComponentIdx);
      setWordPosStateIdx(newWordPosStateIdx);
    },
    [setRightComponentMatrixIdx, setWordPosStateIdx]
  );

  const resetMediaState = useCallback(() => {
    resetComponentMatrixIndices();
    resetWordPosStateIdx();
  }, [resetComponentMatrixIndices, resetWordPosStateIdx]);

  const dispatchObject = useCallback(
    (eventState: {
      event: string;
      leftSideComponentIdx: number;
      rightSideComponentIdx: number;
      wordPosStateIdx: number;
    }) => {
      switch (eventState.event) {
        case "media_rightside_down":
        case "media_rightside_up":
          return {
            action: updateRightSide,
            value: [
              eventState.rightSideComponentIdx,
              eventState.wordPosStateIdx,
            ],
          };
        case "media_leftside_down":
        case "media_leftside_up":
          return {
            action: setLeftComponentMatrixIdx,
            value: [eventState.leftSideComponentIdx],
          };
        case "media_leftside_right":
        case "media_rightside_left":
          return {
            action: toggleSide,
          };
        case "throw_node_media":
          return {
            action: resetMediaState,
          };
        case "media_play_select":
          return { action: playMedia };
        case "media_exit_select":
          return { action: exitMedia };
      }
    },
    [
      exitMedia,
      playMedia,
      resetMediaState,
      setLeftComponentMatrixIdx,
      toggleSide,
      updateRightSide,
    ]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;
