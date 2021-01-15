import React, { useEffect, useRef } from "react";
import { useMediaBigTextStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";

const MediaYellowTextAnimator = () => {
  const textArrRef = useRef(useMediaBigTextStore.getState().text.split(""));

  const [trail, set] = useTrail(textArrRef.current.length, () => ({
    posX: 0,
    posY: 0,
    xOffset: 0,
    config: { duration: 200 },
  }));

  useEffect(() => {
    useMediaBigTextStore.subscribe(set, (state) => ({
      posX: state.transformState.posX,
      posY: state.transformState.posY,
    }));
  }, [set]);

  return (
    <group position={[0, 0, 10]}>
      {trail.map(({ posX, posY }, idx) => (
        <a.group
          key={idx}
          position-x={posX}
          position-y={posY}
          position-z={-8.7}
          scale={[0.04, 0.06, 0.04]}
        >
          <BigLetter
            color={"yellow"}
            letter={textArrRef.current[idx]}
            letterIdx={idx}
            key={idx}
          />
        </a.group>
      ))}
    </group>
  );
};

export default MediaYellowTextAnimator;
