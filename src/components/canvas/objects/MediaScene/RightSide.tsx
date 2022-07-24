import React, { memo, useMemo } from "react";
import { useStore } from "@/store";
import Word from "./Word";
import { a, useSpring } from "@react-spring/three";
import { Vector3 } from "three";
import Lof from "./Lof";
import { MediaComponent, NodeData, Position } from "@/types";

export const WORD_STATES = [
  {
    active: MediaComponent.FirstWord,
    cross: [-2, 2, 0],
    first: [0, 0, 0],
    second: [3, -3, 0],
    third: [3.7, -4.3, 0],
  },
  {
    active: MediaComponent.SecondWord,
    cross: [-0.5, 0.5, 0],
    first: [1.8, -2.5, 0],
    second: [1.5, -1.5, 0],
    third: [3.3, -3.7, 0],
  },
  {
    active: MediaComponent.ThirdWord,
    cross: [1, -1, 0],
    first: [3.7, -4.3, 0],
    second: [0, 0, 0],
    third: [3, -3, 0],
  },
  {
    active: MediaComponent.FirstWord,
    cross: [1.3, -1.7, 0],
    first: [3.3, -3.7, 0],
    second: [1.8, -2.5, 0],
    third: [1.5, -1.5, 0],
  },
  {
    active: MediaComponent.SecondWord,
    cross: [1.7, -2.3, 0],
    first: [3, -3, 0],
    second: [3.7, -4.3, 0],
    third: [0, 0, 0],
  },
  {
    active: MediaComponent.ThirdWord,
    cross: [-0.4, -0.5, 0],
    first: [1.5, -1.5, 0],
    second: [3.3, -3.7, 0],
    third: [1.8, -2.5, 0],
  },
];

type RightSideProps = {
  words: NodeData["words"];
};

const RightSide = ({ words }: RightSideProps) => {
  const currState = useStore((state) => WORD_STATES[state.wordStateIdx]);
  const positionSpring = useSpring<{
    cross: Position;
    first: Position;
    second: Position;
    third: Position;
  }>({
    ...currState,
    config: { duration: 300 },
  });

  const horizontalPoints = useMemo(
    () => [new Vector3(-10, 0, 0), new Vector3(10, 0, 0)],
    []
  );

  const verticalPoints = useMemo(
    () => [new Vector3(0, 10, 0), new Vector3(0, -10, 0)],
    []
  );

  const activeComponent = useStore((state) => state.mediaComponent);

  const onHorizontalUpdate = (geometry: THREE.BufferGeometry) => {
    geometry.setFromPoints(horizontalPoints);
  };

  const onVerticalUpdate = (geometry: THREE.BufferGeometry) => {
    geometry.setFromPoints(verticalPoints);
  };

  return (
    <group position={[0, 0, -3]}>
      <Lof />
      <a.group position={positionSpring.cross}>
        <line>
          <bufferGeometry attach="geometry" onUpdate={onHorizontalUpdate} />
          <lineBasicMaterial
            color={0xc9d6d5}
            transparent={true}
            opacity={0.8}
          />
        </line>
        <line>
          <bufferGeometry attach="geometry" onUpdate={onVerticalUpdate} />
          <lineBasicMaterial
            color={0xc9d6d5}
            transparent={true}
            opacity={0.8}
          />
        </line>
      </a.group>
      {words[0] !== null && words[1] !== null && words[2] !== null && (
        <>
          <Word
            word={words[0]}
            position={positionSpring.first}
            active={activeComponent === MediaComponent.FirstWord}
          />
          <Word
            word={words[1]}
            position={positionSpring.second}
            active={activeComponent === MediaComponent.SecondWord}
          />
          <Word
            word={words[2]}
            position={positionSpring.third}
            active={activeComponent === MediaComponent.ThirdWord}
          />
        </>
      )}
    </group>
  );
};

export default memo(RightSide);
