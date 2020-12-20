import React, { useEffect, useState } from "react";
import LainTaK from "../components/TaKScene/LainTaK";
import * as THREE from "three";
import { useMediaStore, useSceneStore } from "../store";

const TaKScene = () => {
  const setAudioAnalyser = useMediaStore((state) => state.setAudioAnalyser);
  const setScene = useSceneStore((state) => state.setScene);

  const [isIntro, setIntro] = useState(true);
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
        mediaElement.play();
        setIntro(false);
      }
    }, 3800);
  }, [setAudioAnalyser]);

  return <LainTaK intro={isIntro} outro={isOutro} />;
};

export default TaKScene;
