import React, { useCallback, useMemo } from "react";
import { useMediaWordStore } from "../../../store";
import Word from "./RightSide/Word";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";

type RightSideProps = {
  activeMediaComponent: string;
};

const RightSide = (props: RightSideProps) => {
  const words = useMediaWordStore((state) => state.words);

  const wordPositionDataStructIdx = useMediaWordStore(
    (state) => state.wordPositionDataStructIdx
  );

  const wordPositionState = useMediaWordStore(
    useCallback(
      (state) => {
        return wordPositionDataStructIdx < 0
          ? state.wordPositionDataStruct[
              state.wordPositionDataStruct.length + wordPositionDataStructIdx
            ]
          : state.wordPositionDataStruct[wordPositionDataStructIdx];
      },
      [wordPositionDataStructIdx]
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
        word={words[0]}
        posX={wordPositionStateSpring.fstWordPosX}
        posY={wordPositionStateSpring.fstWordPosY}
        active={props.activeMediaComponent === "fstWord"}
      />
      <Word
        word={words[1]}
        posX={wordPositionStateSpring.sndWordPosX}
        posY={wordPositionStateSpring.sndWordPosY}
        active={props.activeMediaComponent === "sndWord"}
      />
      <Word
        word={words[2]}
        posX={wordPositionStateSpring.thirdWordPosX}
        posY={wordPositionStateSpring.thirdWordPosY}
        active={props.activeMediaComponent === "thirdWord"}
      />
    </group>
  );
};

export default RightSide;
