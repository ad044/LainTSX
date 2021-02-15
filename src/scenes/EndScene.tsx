import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { useStore } from "../store";
import EndSelectionScreen from "../components/EndScene/EndSelectionScreen";
import endroll from "../static/movie/ENDROLL1.STR[0].webm";
import endrollVtt from "../static/webvtt/Endroll.vtt";
import Xa0001 from "../static/audio/Xa0001.mp4";
import Xa0006 from "../static/audio/Xa0006.mp4";
import LainSpeak from "../components/LainSpeak";
import EndSphere from "../components/EndScene/EndSphere";
import EndCylinder from "../components/EndScene/EndCylinder";
import sleep from "../utils/sleep";

const EndScene = () => {
  const mainCylinderRef = useRef<THREE.Object3D>();

  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);
  const setSelectionVisible = useStore(
    (state) => state.setEndSceneSelectionVisible
  );

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
  const [showSelectionScreen, setShowSelectionScreen] = useState(false);

  const playedMediaCountRef = useRef(0);

  const playerName = useStore((state) => state.playerName);
  const playerNameVoices = useMemo(() => playerName.split(""), [playerName]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    const playNextMedia = async () => {
      playedMediaCountRef.current++;
      mediaElement.currentTime = 0;
      if (playedMediaCountRef.current === 1) {
        setObjectsVisible(true);
        setIsIntro(true);

        await sleep(3800);
        mediaElement.src = Xa0001;

        mediaElement.load();
        mediaElement.play();
        setIsIntro(false);
      }

      if (
        playedMediaCountRef.current > 1 &&
        playedMediaCountRef.current < playerNameVoices.length + 1
      ) {
        import(
          "../static/voice/" +
            playerNameVoices[playedMediaCountRef.current - 1] +
            ".WAV"
        ).then((media) => {
          mediaElement.src = media.default;
          mediaElement.load();
          mediaElement.play();
        });
      }

      if (playedMediaCountRef.current === playerNameVoices.length + 1) {
        mediaElement.src = Xa0006;

        mediaElement.load();
        mediaElement.play();

        await sleep(4000);
        setIsOutro(true);
        setSceneOutro(true);

        await sleep(3000);
        setObjectsVisible(false);
        setShowSelectionScreen(true);
        setSelectionVisible(true);
      }
    };

    mediaElement.addEventListener("ended", playNextMedia);
  }, [playerNameVoices, setSelectionVisible]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (mediaElement) {
      mediaElement.currentTime = 0;

      trackElement.src = endrollVtt;
      mediaElement.src = endroll;

      mediaElement.load();
      mediaElement.play();
    }
  }, [setAudioAnalyser]);

  return (
    <>
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
      <group visible={showSelectionScreen}>
        <EndSelectionScreen />
      </group>
    </>
  );
};

export default EndScene;
