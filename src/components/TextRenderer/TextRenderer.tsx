import { a, useSpring, useTrail } from "@react-spring/three";
import React, { useMemo } from "react";
import {
  useBlueOrbStore,
  useSiteStore,
  useTextRendererStore,
} from "../../store";
import BigLetter from "./BigLetter";
import MediumLetter from "./MediumLetter";
import blue_orb_huds from "../../resources/blue_orb_huds.json";

export type LetterProps = {
  color: string;
  letter: string;
  letterIdx: number;
};

const TextRenderer = () => {
  const isSiteChangingY = useSiteStore((state) => state.isSiteChangingY);

  //  ======================================= YELLOW TEXT ======================================
  const yellowText = useTextRendererStore((state) => state.yellowText);
  const yellowTextArr = useMemo(() => yellowText.split(""), [yellowText]);
  const yellowTextPosY = useTextRendererStore((state) => state.yellowTextPosY);
  const yellowTextPosX = useTextRendererStore((state) => state.yellowTextPosX);
  const yellowTextOffsetXCoeff = useTextRendererStore(
    (state) => state.yellowTextOffsetXCoeff
  );

  // this is used to animate the letters moving one after another
  const yellowLetterTrail = useTrail(yellowText.length, {
    yellowLetterPosX: yellowTextPosX,
    yellowLetterPosY: yellowTextPosY,
    config: { duration: 280 },
  });

  // this is used when the GROUP itself has to be animated in a "static" manner
  const yellowLetterSpring = useSpring({
    yellowLetterPosX: yellowTextPosX,
    yellowLetterPosY: yellowTextPosY,
    config: { duration: 1200 },
  });

  // ==================================== GREEN TEXT ============================================

  const greenText = useTextRendererStore((state) => state.greenText);
  const greenTextArr = useMemo(() => greenText.split(""), []);
  const greenTextActive = useTextRendererStore(
    (state) => state.greenTextActive
  );

  // instead of setting this part of state directly, green text reads off of the json file.
  const currentHudId = useBlueOrbStore((state) => state.hudId);
  const currentHud = blue_orb_huds[currentHudId as keyof typeof blue_orb_huds];

  const { greenTextPosXToggle } = useSpring({
    greenTextPosXToggle: greenTextActive,
    config: { duration: 500 },
  });

  const greenTextPosX = greenTextPosXToggle.to(
    [0, 1],
    [
      currentHud.medium_text.initial_position[0],
      currentHud.medium_text.position[0],
    ]
  );

  return (
    <>
      {isSiteChangingY
        ? yellowTextArr.map((letter, idx) => (
            <a.group
              key={idx}
              position-x={yellowLetterSpring.yellowLetterPosX}
              position-y={yellowLetterSpring.yellowLetterPosY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                yellowTextOffsetXCoeff={yellowTextOffsetXCoeff}
                letter={yellowTextArr[idx]}
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
                  letter={yellowTextArr[idx]}
                  letterIdx={idx}
                  key={idx}
                />
              </a.group>
            )
          )}

      <a.group
        position-x={greenTextPosX}
        position-y={currentHud["medium_text"]["position"][1]}
        position-z={-8.7}
        scale={[0.02, 0.035, 0.02]}
      >
        {greenTextArr.map((letter, idx) => (
          <MediumLetter
            color={"yellow"}
            letter={letter}
            letterIdx={idx}
            key={idx}
          />
        ))}
      </a.group>
    </>
  );
};

export default TextRenderer;
