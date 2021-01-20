import React from "react";
import { useMediaBigTextStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";

const MediaYellowTextAnimator = () => {
  const transformState = useMediaBigTextStore((state) => state.transformState);
  const textArr = useMediaBigTextStore((state) => state.text).split("");

  const trail = useTrail(textArr.length, {
    posX: transformState.posX,
    posY: transformState.posY,
    config: { duration: 280 },
  });

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
            xOffset={transformState.xOffset}
            letter={textArr[idx]}
            letterIdx={idx}
            key={idx}
          />
        </a.group>
      ))}
    </group>
  );
};

export default MediaYellowTextAnimator;
