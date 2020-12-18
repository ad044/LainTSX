import React, { useCallback, useMemo } from "react";
import { useLevelStore, useMediaWordStore, useNodeStore } from "../../../store";
import Word from "./RightSide/Word";
import { useSpring, a } from "@react-spring/three";
import word_position_states from "../../../resources/word_position_states.json";
import * as THREE from "three";
import site_a from "../../../resources/site_a.json";
import { SiteType } from "../../MainScene/Site";

type RightSideProps = {
  activeMediaComponent: string;
};

const RightSide = (props: RightSideProps) => {
  const activeLevel = useLevelStore((state) => state.activeLevel);
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);

  const words = (site_a as SiteType)[activeLevel][activeNodeId].words;

  const posStateIdx = useMediaWordStore(
    (state) => state.posStateIdx
  ).toString();

  const wordPositionState = useMediaWordStore(
    useCallback(
      () =>
        word_position_states[posStateIdx as keyof typeof word_position_states],
      [posStateIdx]
    )
  );

  const wordPositionStateSpring = useSpring({
    fstWordPosX: wordPositionState.fstWord.posX,
    fstWordPosY: wordPositionState.fstWord.posY,
    sndWordPosX: wordPositionState.sndWord.posX,
    sndWordPosY: wordPositionState.sndWord.posY,
    thirdWordPosX: wordPositionState.thirdWord.posX,
    thirdWordPosY: wordPositionState.thirdWord.posY,
    crossPosX: wordPositionState.cross.posX,
    crossPosY: wordPositionState.cross.posY,
    config: { duration: 300 },
  });

  const horizontalPoints = useMemo(
    () => [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)],
    []
  );
  const verticalPoints = useMemo(
    () => [new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, -10, 0)],
    []
  );

  return (
    <group position={[0, 0, -3]}>
      <a.group
        position-x={wordPositionStateSpring.crossPosX}
        position-y={wordPositionStateSpring.crossPosY}
      >
        <line>
          <geometry attach="geometry" vertices={horizontalPoints} />
          <lineBasicMaterial
            attach="material"
            color={0xc9d6d5}
            transparent={true}
            opacity={0.8}
          />
        </line>
        <line>
          <geometry attach="geometry" vertices={verticalPoints} />
          <lineBasicMaterial
            attach="material"
            color={0xc9d6d5}
            transparent={true}
            opacity={0.8}
          />
        </line>
      </a.group>
      <Word
        word={words[1]}
        posX={wordPositionStateSpring.fstWordPosX}
        posY={wordPositionStateSpring.fstWordPosY}
        active={props.activeMediaComponent === "fstWord"}
      />
      <Word
        word={words[2]}
        posX={wordPositionStateSpring.sndWordPosX}
        posY={wordPositionStateSpring.sndWordPosY}
        active={props.activeMediaComponent === "sndWord"}
      />
      <Word
        word={words[3]}
        posX={wordPositionStateSpring.thirdWordPosX}
        posY={wordPositionStateSpring.thirdWordPosY}
        active={props.activeMediaComponent === "thirdWord"}
      />
    </group>
  );
};

export default RightSide;
