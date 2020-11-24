import React, { useEffect, useRef } from "react";
import { useYellowTextStore, YellowTextState } from "../../store";
import { a, useSpring, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";

const YellowTextRenderer = () => {
  const disableTrail = useYellowTextStore((state) => state.disableTrail);
  const transformState = useYellowTextStore((state) => state.transformState);

  const textArrRef = useRef(useYellowTextStore.getState().text.split(""));

  const transformRef = useRef(useYellowTextStore.getState().transformState);

  // this is used to animate the letters moving one after another
  const trail = useTrail(textArrRef.current.length, {
    posX: transformRef.current.posX,
    posY: transformRef.current.posY,
    config: { duration: 280 },
  });

  // this is used when the whole GROUP itself needs to be animated
  const spring = useSpring({
    posX: transformState.posX,
    posY: transformState.posY,
    config: { duration: 1200 },
  });

  useEffect(
    () =>
      useYellowTextStore.subscribe(
        (state) => {
          transformRef.current = (state as YellowTextState).transformState;
          textArrRef.current = (state as YellowTextState).text.split("");
        },
        (state) => state
      ),
    []
  );

  return (
    <group position={[0, 0, 10]}>
      {disableTrail
        ? textArrRef.current.map((letter, idx) => (
            <a.group
              key={idx}
              position-x={spring.posX}
              position-y={spring.posY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                yellowTextOffsetXCoeff={0}
                letter={textArrRef.current[idx]}
                letterIdx={idx}
                key={idx}
              />
            </a.group>
          ))
        : trail.map(({ posX, posY }, idx) => (
            <a.group
              key={idx}
              position-x={posX}
              position-y={posY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                yellowTextOffsetXCoeff={transformRef.current.xOffset}
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
