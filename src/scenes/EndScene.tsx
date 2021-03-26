import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { useStore } from "../store";
import createAudioAnalyser from "../utils/createAudioAnalyser";
import EndSelectionScreen from "../components/EndScene/EndSelectionScreen";
import introSpeechVtt from "../static/media/webvtt/Xa0001.vtt";
import introSpeech from "../static/media/audio/LAIN21.XA[31].mp4";
import outroSpeech from "../static/media/audio/LAIN21.XA[16].mp4";
import LainSpeak from "../components/LainSpeak";
import EndSphere from "../components/EndScene/EndSphere";
import EndCylinder from "../components/EndScene/EndCylinder";
import sleep from "../utils/sleep";

const EndScene = () => {
  const mainCylinderRef = useRef<THREE.Object3D>();

  const setSelectionVisible = useStore(
    (state) => state.setEndSceneSelectionVisible
  );
  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);
  const audioAnalyser = useStore((state) => state.audioAnalyser);

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

  const setInputCooldown = useStore((state) => state.setInputCooldown);

  useEffect(() => {
    if (!audioAnalyser) setAudioAnalyser(createAudioAnalyser());
  }, [audioAnalyser, setAudioAnalyser]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLMediaElement;

    if (mediaElement) {
      const playMedia = async (idx: number) => {
        switch (idx) {
          // intro speech
          case 0:
            setObjectsVisible(true);
            setIsIntro(true);

            await sleep(3800);
            mediaElement.src = introSpeech;
            trackElement.src = introSpeechVtt;

            mediaElement.load();
            mediaElement.play();
            setIsIntro(false);
            break;
          // name pronounciation syllable by syllable
          default:
            import("../static/voice/" + playerNameVoices[idx - 1] + ".mp4")
              .then((media) => {
                mediaElement.src = media.default;
                mediaElement.load();
                mediaElement.play();
              })
              .catch((e) => console.log(e));
            break;
          // outro laugh
          case playerNameVoices.length + 1:
            mediaElement.src = outroSpeech;
            mediaElement.load();
            mediaElement.play();

            setIsOutro(true);

            await sleep(4000);
            setSceneOutro(true);

            await sleep(3000);
            setObjectsVisible(false);
            setShowSelectionScreen(true);
            setSelectionVisible(true);
            setInputCooldown(0);
        }
      };

      playMedia(0);
      mediaElement.addEventListener("ended", () => {
        playedMediaCountRef.current++;
        if (playedMediaCountRef.current === 1) {
          trackElement.removeAttribute("src");
        }
        if (playedMediaCountRef.current <= playerNameVoices.length + 1)
          playMedia(playedMediaCountRef.current);
      });
    }
  }, [
    playerNameVoices,
    setAudioAnalyser,
    setInputCooldown,
    setSelectionVisible,
  ]);

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
      <EndSelectionScreen visible={showSelectionScreen} />
    </>
  );
};

export default EndScene;
