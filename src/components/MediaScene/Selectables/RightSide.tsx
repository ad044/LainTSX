import React, { memo, useCallback, useMemo } from "react";
import { useStore } from "../../../store";
import Word from "./RightSide/Word";
import { a, useSpring } from "@react-spring/three";
import word_position_states from "../../../resources/word_position_states.json";
import * as THREE from "three";
import Lof from "../Lof";

const RightSide = memo(() => {
  const words = useStore((state) => state.activeNode.words);

  const wordPositionState = useStore(
    (state) =>
      word_position_states[
        state.mediaWordPosStateIdx.toString() as keyof typeof word_position_states
      ]
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

  const activeMediaComponent = useStore(
    useCallback(
      (state) =>
        state.mediaComponentMatrix[state.mediaComponentMatrixIndices.sideIdx][
          state.mediaComponentMatrixIndices.sideIdx === 0
            ? state.mediaComponentMatrixIndices.leftSideIdx
            : state.mediaComponentMatrixIndices.rightSideIdx
        ],
      []
    )
  );

  return (
    <group position={[0, 0, -3]}>
      <Lof />
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
        active={activeMediaComponent === "fstWord"}
      />
      <Word
        word={words[2]}
        posX={wordPositionStateSpring.sndWordPosX}
        posY={wordPositionStateSpring.sndWordPosY}
        active={activeMediaComponent === "sndWord"}
      />
      <Word
        word={words[3]}
        posX={wordPositionStateSpring.thirdWordPosX}
        posY={wordPositionStateSpring.thirdWordPosY}
        active={activeMediaComponent === "thirdWord"}
      />
    </group>
  );
});

export default RightSide;
