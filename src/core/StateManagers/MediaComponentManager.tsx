import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaStore } from "../../store";
import * as THREE from "three";

const MediaComponentManager = (props: StateManagerProps) => {
  const toggleSide = useMediaStore((state) => state.toggleSide);
  const toggleLeftComponent = useMediaStore(
    (state) => state.toggleLeftComponent
  );
  const addToRightComponentMatrixIdx = useMediaStore(
    (state) => state.addToRightComponentMatrixIdx
  );

  const resetComponentMatrixIndices = useMediaStore(
    (state) => state.resetComponentMatrixIndices
  );

  const setAudioAnalyser = useMediaStore((state) => state.setAudioAnalyser);

  const playMedia = useCallback(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);

    audio.setMediaElementSource(
      document.getElementById("media") as HTMLMediaElement
    );

    setAudioAnalyser(new THREE.AudioAnalyser(audio, 2048));

    if (mediaElement) {
      mediaElement.play();
    }
  }, [setAudioAnalyser]);

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "fstWord_down":
        case "sndWord_down":
        case "thirdWord_down":
          return {
            action: addToRightComponentMatrixIdx,
            value: [1],
          };
        case "fstWord_up":
        case "thirdWord_up":
        case "sndWord_up":
          return {
            action: addToRightComponentMatrixIdx,
            value: [-1],
          };
        case "play_down":
        case "exit_up":
          return {
            action: toggleLeftComponent,
          };
        case "play_right":
        case "exit_right":
        case "fstWord_left":
        case "sndWord_left":
        case "thirdWord_left":
          return {
            action: toggleSide,
          };
        case "throw_node_media":
          return {
            action: resetComponentMatrixIndices,
          };
        case "play_select":
          return { action: playMedia };
      }
    },
    [
      addToRightComponentMatrixIdx,
      playMedia,
      resetComponentMatrixIndices,
      toggleLeftComponent,
      toggleSide,
    ]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;
