import React, { useEffect, useState } from "react";
import LainSpeak from "../components/LainSpeak";
import * as THREE from "three";
import { useMediaStore, useSceneStore } from "../store";

const TaKScene = () => {
  const setAudioAnalyser = useMediaStore((state) => state.setAudioAnalyser);
  const setScene = useSceneStore((state) => state.setScene);

  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);

  const percentageElapsed = useMediaStore(
    (state) => state.mediaPercentageElapsed
  );

  useEffect(() => {
    if (percentageElapsed === 100) {
      setIsOutro(true);
      setTimeout(() => {
        setScene("main");
      }, 4600);
    }
  }, [percentageElapsed, setScene]);

  useEffect(() => {
    setTimeout(() => {
      const mediaElement = document.getElementById("media") as HTMLMediaElement;

      const listener = new THREE.AudioListener();
      const audio = new THREE.Audio(listener);

      audio.setMediaElementSource(mediaElement);

      setAudioAnalyser(new THREE.AudioAnalyser(audio, 2048));

      if (mediaElement) {
        mediaElement.currentTime = 0;
        mediaElement.play();
        setIsIntro(false);
      }
    }, 3800);
  }, [setAudioAnalyser]);

  return <LainSpeak intro={isIntro} outro={isOutro} />;
};

export default TaKScene;
