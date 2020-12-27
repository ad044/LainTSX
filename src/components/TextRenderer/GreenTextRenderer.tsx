import { a, useSpring } from "@react-spring/three";
import React, { useEffect, useRef } from "react";
import { GreenTextState, useGreenTextStore } from "../../store";
import MediumLetter from "./MediumLetter";

const GreenTextRenderer = () => {
  const greenTextActive = useGreenTextStore((state) => state.active);

  const transformRef = useRef(useGreenTextStore.getState().transformState);

  const textArrRef = useRef(useGreenTextStore.getState().text.split(""));

  const { greenTextPosXToggle } = useSpring({
    greenTextPosXToggle: greenTextActive,
    config: { duration: 500 },
  });

  const greenTextPosX = greenTextPosXToggle.to(
    [0, 1],
    [transformRef.current.posX.initial, transformRef.current.posX.final]
  );

  // subscribing to state and updating transiently
  useEffect(
    () =>
      useGreenTextStore.subscribe(
        (state) => {
          transformRef.current = (state as GreenTextState).transformState;
          textArrRef.current = (state as GreenTextState).text.split("");
        },
        (state) => state
      ),
    []
  );

  return (
    <group position={[0, 0, 10]}>
      <a.group
        position-x={greenTextPosX}
        position-y={transformRef.current.posY}
        position-z={-8.7}
        scale={[0.02, 0.035, 0.02]}
      >
        {textArrRef.current.map((letter, idx) => (
          <MediumLetter letter={letter} letterIdx={idx} key={idx} />
        ))}
      </a.group>
    </group>
  );
};

export default GreenTextRenderer;
