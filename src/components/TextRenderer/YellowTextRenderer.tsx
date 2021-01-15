import React, { useEffect, useRef } from "react";
import { BigTextState, useBigTextStore, useNodeStore } from "../../store";
import { a, useSpring, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";

const YellowTextRenderer = () => {
  const visible = useBigTextStore((state) => state.visible);
  const color = useBigTextStore((state) => state.color);

  const textArrRef = useRef(useBigTextStore.getState().text.split(""));

  const [trail, set] = useTrail(textArrRef.current.length, () => ({
    posX: 0,
    posY: 0,
    config: { duration: 280 },
  }));

  useEffect(() => {
    useBigTextStore.subscribe(set, (state) => ({
      posX: state.transformState.posX,
      posY: state.transformState.posY,
    }));
  }, [set]);

  return (
    <group position={[0, 0, 10]} visible={visible}>
      {trail.map(({ posX, posY }, idx) => (
        <a.group
          key={idx}
          position-x={posX}
          position-y={posY}
          position-z={-8.7}
          scale={[0.04, 0.06, 0.04]}
        >
          <BigLetter
            color={color}
            letter={textArrRef.current[idx]}
            letterIdx={idx}
            key={idx}
          />
        </a.group>
      ))}
    </group>
  );
};

export default YellowTextRenderer;
