import { handleEvent } from "@/core";
import {
  enterScene,
  incrementFinalVideoViewCount,
  setAudioAnalyser,
  setInputCooldown,
  setNodeViewed,
} from "@/core/events";
import usePrevious from "@/hooks/usePrevious";
import { useStore } from "@/store";
import { GameScene, MediaComponent, Position, TextType } from "@/types";
import { createAudioAnalyser } from "@/utils/audio";
import Images from "@canvas/objects/Images";
import Loading from "@canvas/objects/Loading";
import AudioVisualizer from "@canvas/objects/MediaScene/AudioVisualizer";
import LeftSide from "@canvas/objects/MediaScene/LeftSide";
import NodeNameContainer from "@canvas/objects/MediaScene/NodeNameContainer";
import RightSide from "@canvas/objects/MediaScene/RightSide";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import TextRenderer from "../objects/TextRenderer/TextRenderer";
import AnimatedBigTextRenderer from "../objects/TextRenderer/AnimatedBigTextRenderer";
import ProgressBar from "../objects/ProgressBar";
import { isAudioOnly } from "@/utils/node";

const MediaScene = () => {
  const progressBarContainer = useTexture(
    "/sprites/media/media_loading_bar_container.png"
  );

  const [progress, setProgress] = useState(0);
  const percentageElapsed = useStore((state) => state.mediaPercentageElapsed);
  const language = useStore((state) => state.language);

  const node = useStore((state) => state.node);

  const endrollPlayingRef = useRef(false);
  const mediaSceneGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (node && percentageElapsed === 100) {
      const mediaElement = document.getElementById("media") as HTMLMediaElement;
      const trackElement = document.getElementById("track") as HTMLTrackElement;

      // accessing it this way since using the hook and adding it to the
      // dependency array makes this useEffect loop infinitely
      const gameProgress = useStore.getState().gameProgress;

      if (!isAudioOnly(node.media_file) && mediaElement) {
        mediaElement.currentTime = 0;
        mediaElement.pause();
      }

      handleEvent(setNodeViewed(gameProgress, node));

      if (endrollPlayingRef.current) {
        handleEvent(enterScene(GameScene.End));
      } else if (!endrollPlayingRef.current && node.triggers_final_video) {
        if (mediaSceneGroupRef.current) {
          mediaSceneGroupRef.current.visible = false;
        }

        mediaElement.currentTime = 0;

        trackElement.src = `/media/webvtt/${language}/Endroll.vtt`;
        mediaElement.src = `/media/movie/ENDROLL1.STR[0].mp4`;
        mediaElement.load();
        mediaElement.play();

        handleEvent(incrementFinalVideoViewCount(gameProgress));

        endrollPlayingRef.current = true;
      }
    }
  }, [node, language, percentageElapsed]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (node && mediaElement) {
      handleEvent(setAudioAnalyser(createAudioAnalyser()));

      mediaElement.currentTime = 0;

      trackElement.src = `/media/webvtt/${language}/${node.name}.vtt`;

      if (isAudioOnly(node.media_file)) {
        mediaElement.src = `media/audio/${node.media_file}.mp4`;
      } else {
        mediaElement.src = `media/movie/${node.media_file}.mp4`;
      }
      mediaElement.load();
    }
  }, [node, language]);

  const [loaded, setLoaded] = useState(false);
  const activeComponent = useStore((state) => state.mediaComponent);

  const [text, setText] = useState(MediaComponent[activeComponent]);
  const [textPos, setTextPos] = useState<Position>([-0.8, 0.05, -8.7]);
  const [textShrinked, setTextShrinked] = useState(false);
  const prev = usePrevious({ activeComponent });

  useEffect(() => {
    if (
      (activeComponent === MediaComponent.Play &&
        prev?.activeComponent === MediaComponent.Exit) ||
      (activeComponent === MediaComponent.Exit &&
        prev?.activeComponent === MediaComponent.Play)
    ) {
      setTextShrinked(true);
      setTimeout(() => setTextShrinked(false), 1200);

      setTimeout(() => {
        if (activeComponent === MediaComponent.Play) {
          setTextPos([-0.8, 0.05, -8.7]);
        } else {
          setTextPos([-0.8, -0.08, -8.7]);
        }
      }, 400);

      setTimeout(() => {
        const componentStr = MediaComponent[activeComponent];
        setText(componentStr);
      }, 1000);
    }
  }, [activeComponent, prev?.activeComponent]);

  useEffect(() => {
    setLoaded(true);
    setTimeout(() => handleEvent(setInputCooldown(500)), 1000);
  }, []);

  useEffect(() => {
    if (percentageElapsed % 5 === 0) {
      setProgress(percentageElapsed / 5);
    }
  }, [percentageElapsed]);

  return (
    <group position-z={3} ref={mediaSceneGroupRef}>
      {node && loaded ? (
        <group position={[0.4, -0.3, 0]}>
          <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 0]} />
          <LeftSide />
          <group position={[0, 0.5, -3]}>
            <sprite
              scale={[5.2, 0.5, 1]}
              position={[2.15, 3.005, 0]}
              renderOrder={3}
            >
              <spriteMaterial map={progressBarContainer} />
            </sprite>
            <group position={[-0.2, 2.945, 0]}>
              <ProgressBar progress={progress} />
            </group>
            <NodeNameContainer />
          </group>
          <group scale={[0.06, 0.12, 0]} position={[0.8, 1.37, 0]}>
            <TextRenderer
              type={TextType.MediumGreen}
              text={node.name}
              scale={[1.7, 1, 1.7]}
            />
          </group>
          <AnimatedBigTextRenderer
            text={text}
            position={textPos}
            scale={[0.04, 0.06, 0.04]}
            shrinked={textShrinked}
            type={TextType.BigYellow}
          />

          <group visible={isAudioOnly(node.media_file)}>
            <RightSide words={node.words} />
            <AudioVisualizer />
            <Images imageTableIndices={node.image_table_indices} />
          </group>
        </group>
      ) : (
        <Loading />
      )}
    </group>
  );
};

export default MediaScene;
