import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/store";
import { createAudioAnalyser } from "@/utils/audio";
import EndSelectionScreen from "@canvas/objects/EndScene/EndSelectionScreen";
import LainSpeak from "@canvas/objects/LainSpeak";
import EndSphere from "@canvas/objects/EndScene/EndSphere";
import EndCylinder from "@canvas/objects/EndScene/EndCylinder";
import sleep from "@/utils/sleep";
import { handleEvent } from "@/core";
import {
  setAudioAnalyser,
  setEndSelectionVisible,
  setInputCooldown,
} from "@/core/events";
import { getVoiceFilenames } from "@/utils/end";
import { useFrame } from "@react-three/fiber";

const EndScene = () => {
  const mainCylinderRef = useRef<THREE.Group>(null);
  const language = useStore((state) => state.language);

  const audioAnalyser = useStore((state) => state.audioAnalyser);

  useFrame((_, delta) => {
    if (mainCylinderRef.current) {
      mainCylinderRef.current.rotation.y -= 0.1 * delta;
      if (sceneOutro) {
        mainCylinderRef.current.position.z -= 12.5 * delta;
        mainCylinderRef.current.rotation.y -= 2.5 * delta;
        if (mainCylinderRef.current.scale.y > 0.6) {
          mainCylinderRef.current.scale.y -= delta / 2;
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
  const playerNameVoices = useMemo(
    () => getVoiceFilenames(playerName),
    [playerName]
  );

  useEffect(() => {
    if (!audioAnalyser) {
      handleEvent(setAudioAnalyser(createAudioAnalyser()));
    }
  }, [audioAnalyser]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLMediaElement;

    if (mediaElement) {
      const playMedia = async (idx: number) => {
        if (idx === 0) {
          // intro speech
          setObjectsVisible(true);
          setIsIntro(true);

          await sleep(3800);

          trackElement.src = `/media/webvtt/${language}/Xa0001.vtt`;

          mediaElement.src = `/media/audio/LAIN21.XA[31].mp4`;
          mediaElement.load();
          mediaElement.play();
          setIsIntro(false);
        } else if (idx === playerNameVoices.length + 1) {
          // outro laugh
          mediaElement.src = `/media/audio/LAIN21.XA[16].mp4`;
          mediaElement.load();
          mediaElement.play();

          setIsOutro(true);

          await sleep(4000);
          setSceneOutro(true);

          await sleep(3000);
          setObjectsVisible(false);
          setShowSelectionScreen(true);
          handleEvent(setEndSelectionVisible(true));
          handleEvent(setInputCooldown(0));
        } else {
          // name pronounciation syllable by syllable
          mediaElement.src = `/media/voice/${playerNameVoices[idx - 1]}.mp4`;
          mediaElement.load();
          mediaElement.play();
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
  }, [language, playerNameVoices]);

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
