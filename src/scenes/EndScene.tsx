import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { createAudioAnalyser, useStore } from "../store";
import EndSelectionScreen from "../components/EndScene/EndSelectionScreen";
import endroll from "../static/movie/ENDROLL1.STR[0].webm";
import endrollVtt from "../static/webvtt/Endroll.vtt";
import Xa0001 from "../static/audio/Xa0001.mp4";
import Xa0006 from "../static/audio/Xa0006.mp4";
import LainSpeak from "../components/LainSpeak";
import EndSphere from "../components/EndScene/EndSphere";
import EndCylinder from "../components/EndScene/EndCylinder";

const EndScene = () => {
  const mainCylinderRef = useRef<THREE.Object3D>();

  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);

  useFrame(() => {
    if (mainCylinderRef.current) {
      mainCylinderRef.current.rotation.y -= 0.01;
      if (sceneOutro) {
        mainCylinderRef.current.position.z -= 0.25;
        mainCylinderRef.current.rotation.y -= 0.05;
        if (mainCylinderRef.current.scale.y > 0.6) {
          mainCylinderRef.current.scale.y -= 0.01;
        }
      }
    }
  });

  const [objectsVisible, setObjectsVisible] = useState(false);
  const [isIntro, setIsIntro] = useState(false);
  const [isOutro, setIsOutro] = useState(false);
  const [sceneOutro, setSceneOutro] = useState(false);

  const playedMediaCountRef = useRef(0);

  const mediaList = useMemo(() => [Xa0001, Xa0006], []);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    const playNextMedia = () => {
      playedMediaCountRef.current++;
      mediaElement.currentTime = 0;
      if (playedMediaCountRef.current === 1) {
        setObjectsVisible(true);
        setIsIntro(true);

        setTimeout(() => {
          mediaElement.src = Xa0001;

          mediaElement.load();
          mediaElement.play();
          setIsIntro(false);
        }, 3800);
      }

      if (playedMediaCountRef.current === mediaList.length) {
        mediaElement.src = Xa0006;

        mediaElement.load();
        mediaElement.play();
        setIsOutro(true);
        setTimeout(() => {
          setSceneOutro(true);
        }, 4000);
      }
    };

    mediaElement.addEventListener("ended", playNextMedia);
  }, [mediaList]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (mediaElement) {
      setAudioAnalyser(createAudioAnalyser());
      mediaElement.currentTime = 0;

      trackElement.src = endrollVtt;
      mediaElement.src = endroll;

      mediaElement.load();
      mediaElement.play();
    }
  }, [setAudioAnalyser]);

  return (
    <group visible={objectsVisible}>
      <pointLight position={[0, 0, 5]} intensity={0.9} />
      <pointLight position={[0, 0, -5]} intensity={0.9} />

      <group ref={mainCylinderRef} position={[0, -1, 2.2]}>
        <EndCylinder />
      </group>
      <EndSphere position={[-1.8, -1.6, 1.4]} outroAnim={sceneOutro} />
      <EndSphere position={[1.8, -0.5, 0]} outroAnim={sceneOutro} />
      <EndSphere position={[2, -1.7, 1]} outroAnim={sceneOutro} />
      <EndSphere position={[-1.6, 1.4, 1.5]} outroAnim={sceneOutro} />
      <EndSphere position={[2, 1.7, -0.5]} outroAnim={sceneOutro} />
      <LainSpeak intro={isIntro} outro={isOutro} />
    </group>
  );
};

export default EndScene;
