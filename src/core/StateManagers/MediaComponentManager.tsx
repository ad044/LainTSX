import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaStore, useMediaWordStore } from "../../store";
import * as THREE from "three";

const MediaComponentManager = (props: StateManagerProps) => {
  const toggleSide = useMediaStore((state) => state.toggleSide);
  const setLeftComponentMatrixIdx = useMediaStore(
    (state) => state.setLeftComponentMatrixIdx
  );
  const setRightComponentMatrixIdx = useMediaStore(
    (state) => state.setRightComponentMatrixIdx
  );
  const setWordPosStateIdx = useMediaWordStore((state) => state.setPosStateIdx);

  const resetComponentMatrixIndices = useMediaStore(
    (state) => state.resetComponentMatrixIndices
  );
  const resetWordPosStateIdx = useMediaWordStore(
    (state) => state.resetPosStateIdx
  );

  const setAudioAnalyser = useMediaStore((state) => state.setAudioAnalyser);

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
    (newRightSideComponentIdx: number, newWordPosStateIdx: number) => {
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
    (
      event: string,
      newLeftSideComponentIdx: number,
      newRightSideComponentIdx: number,
      newWordPosStateIdx: number
    ) => {
      switch (event) {
        case "media_rightside_down":
        case "media_rightside_up":
          return {
            action: updateRightSide,
            value: [newRightSideComponentIdx, newWordPosStateIdx],
          };
        case "media_leftside_down":
        case "media_leftside_up":
          return {
            action: setLeftComponentMatrixIdx,
            value: [newLeftSideComponentIdx],
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
      const eventAction = props.eventState.event;
      const newLeftSideComponentIdx = props.eventState.newLeftSideComponentIdx;
      const newRightSideComponentIdx =
        props.eventState.newRightSideComponentIdx;
      const newWordPosStateIdx = props.eventState.newWordPosStateIdx;

      const dispatchedObject = dispatchObject(
        eventAction,
        newLeftSideComponentIdx,
        newRightSideComponentIdx,
        newWordPosStateIdx
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;
