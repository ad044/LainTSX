import { a, useSpring, useTrail } from "@react-spring/three";
import React, { useEffect, useRef } from "react";
import {
  TextRendererState,
  useSiteStore,
  useTextRendererStore,
} from "../../store";
import BigLetter from "./BigLetter";
import MediumLetter from "./MediumLetter";

export type LetterProps = {
  color: string;
  letter: string;
  letterIdx: number;
};

const TextRenderer = () => {
  const isSiteChangingY = useSiteStore((state) => state.isSiteChangingY);

  //  ======================================= YELLOW TEXT ======================================

  // yellow text posx and posy need to be updated reactively aswell when changing site rotation/y value
  const yellowTextPosX = useTextRendererStore((state) => state.yellowTextPosX);
  const yellowTextPosY = useTextRendererStore((state) => state.yellowTextPosY);

  const yellowTextOffsetXCoeff = useTextRendererStore(
    (state) => state.yellowTextOffsetXCoeff
  );

  const yellowTextArrRef = useRef(
    useTextRendererStore.getState().yellowText.split("")
  );

  const yellowTextPosXRef = useRef(
    useTextRendererStore.getState().yellowTextPosX
  );
  const yellowTextPosYRef = useRef(
    useTextRendererStore.getState().yellowTextPosY
  );

  // this is used to animate the letters moving one after another
  const yellowLetterTrail = useTrail(yellowTextArrRef.current.length, {
    yellowLetterPosX: yellowTextPosXRef.current,
    yellowLetterPosY: yellowTextPosYRef.current,
    config: { duration: 280 },
  });

  // this is used when the whole GROUP itself needs to be animated
  const yellowLetterSpring = useSpring({
    yellowLetterPosX: yellowTextPosX,
    yellowLetterPosY: yellowTextPosY,
    config: { duration: 1200 },
  });

  // ==================================== GREEN TEXT ============================================

  const greenTextActive = useTextRendererStore(
    (state) => state.greenTextActive
  );

  const greenTextPosYRef = useRef(
    useTextRendererStore.getState().greenTextPosY
  );

  const greenTextPosXRef = useRef(
    useTextRendererStore.getState().greenTextPosX
  );

  const greenTextArrRef = useRef(
    useTextRendererStore.getState().greenText.split("")
  );
  const { greenTextPosXToggle } = useSpring({
    greenTextPosXToggle: greenTextActive,
    config: { duration: 500 },
  });

  const greenTextPosX = greenTextPosXToggle.to(
    [0, 1],
    [greenTextPosXRef.current.initial, greenTextPosXRef.current.final]
  );

  // subscribing to state and updating transiently
  useEffect(
    () =>
      useTextRendererStore.subscribe(
        (state) => {
          yellowTextPosXRef.current = (state as TextRendererState).yellowTextPosX;
          yellowTextPosYRef.current = (state as TextRendererState).yellowTextPosY;
          yellowTextArrRef.current = (state as TextRendererState).yellowText.split(
            ""
          );
          greenTextPosYRef.current = (state as TextRendererState).greenTextPosY;
          greenTextPosXRef.current = (state as TextRendererState).greenTextPosX;
          greenTextArrRef.current = (state as TextRendererState).greenText.split(
            ""
          );
        },
        (state) => state
      ),
    []
  );

  return (
    <group position={[0, 0, 10]}>
      {isSiteChangingY
        ? yellowTextArrRef.current.map((letter, idx) => (
            <a.group
              key={idx}
              position-x={yellowLetterSpring.yellowLetterPosX}
              position-y={yellowLetterSpring.yellowLetterPosY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                yellowTextOffsetXCoeff={0}
                letter={yellowTextArrRef.current[idx]}
                letterIdx={idx}
                key={idx}
              />
            </a.group>
          ))
        : yellowLetterTrail.map(
            ({ yellowLetterPosX, yellowLetterPosY }, idx) => (
              <a.group
                key={idx}
                position-x={yellowLetterPosX}
                position-y={yellowLetterPosY}
                position-z={-8.7}
                scale={[0.04, 0.06, 0.04]}
              >
                <BigLetter
                  color={"yellow"}
                  yellowTextOffsetXCoeff={yellowTextOffsetXCoeff}
                  letter={yellowTextArrRef.current[idx]}
                  letterIdx={idx}
                  key={idx}
                />
              </a.group>
            )
          )}

      <a.group
        position-x={greenTextPosX}
        position-y={greenTextPosYRef.current}
        position-z={-8.7}
        scale={[0.02, 0.035, 0.02]}
      >
        {greenTextArrRef.current.map((letter, idx) => (
          <MediumLetter
            color={"yellow"}
            letter={letter}
            letterIdx={idx}
            key={idx}
          />
        ))}
      </a.group>
    </group>
  );
};

export default TextRenderer;
