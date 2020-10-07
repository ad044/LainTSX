import React from "react";
import { BigLetter, MediumLetter } from "../TextRenderer/TextRenderer";
import { a, useSpring, useTrail } from "@react-spring/three";
import { useRecoilValue } from "recoil";
import {
  bigLetterPosXAtom,
  bigLetterPosYAtom, currentHUDAtom,
  hudActiveAtom,
} from "./HUDElementAtom";
import { isSiteYChangingAtom } from "../Site/SiteAtom";

type HUDTextProps = {
  bigText: string;
  mediumText: string;
};

const HUDText = (props: HUDTextProps) => {
  const bigLetterPosX = useRecoilValue(bigLetterPosXAtom);
  const bigLetterPosY = useRecoilValue(bigLetterPosYAtom);

  const currentHud = useRecoilValue(currentHUDAtom);

  const isSiteChangingY = useRecoilValue(isSiteYChangingAtom);

  const hudActive = useRecoilValue(hudActiveAtom);

  const { mediumTextHUDPositionX } = useSpring({
    mediumTextHUDPositionX: hudActive,
    config: { duration: 500 },
  });

  const mediumHudPosX = mediumTextHUDPositionX.to(
    [0, 1],
    [
      currentHud["medium_text"]["initial_position"][0],
      currentHud["medium_text"]["position"][0],
    ]
  );

  const bigTextArr = props.bigText.split("");
  const mediumTextArr = props.mediumText.split("");

  // this one is used for letter animations
  const letterTrail = useTrail(bigTextArr.length, {
    bigLetterPosX: bigLetterPosX,
    bigLetterPosY: bigLetterPosY,
    config: { duration: 280 },
  });

  // this one is used when the site moves up/down and
  // the text has to stay stationary
  const letterStaticState = useSpring({
    bigLetterPosX: bigLetterPosX,
    bigLetterPosY: bigLetterPosY,
    config: { duration: 1200 },
  });

  return (
    <>
      {isSiteChangingY
        ? bigTextArr.map((letter, idx) => (
            <a.group
              key={idx}
              position-x={letterStaticState.bigLetterPosX}
              position-y={letterStaticState.bigLetterPosY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                letter={bigTextArr[idx]}
                kerningOffset={idx}
                key={idx}
              />
            </a.group>
          ))
        : letterTrail.map(({ bigLetterPosX, bigLetterPosY }, idx) => (
            <a.group
              key={idx}
              position-x={bigLetterPosX}
              position-y={bigLetterPosY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                letter={bigTextArr[idx]}
                kerningOffset={idx}
                key={idx}
              />
            </a.group>
          ))}
      <a.group
        position-x={mediumHudPosX}
        position-y={currentHud["medium_text"]["position"][1]}
        position-z={-8.7}
        scale={[0.02, 0.035, 0.02]}
      >
        {mediumTextArr.map((letter, idx) => (
          <MediumLetter
            color={"yellow"}
            letter={letter}
            kerningOffset={idx}
            key={idx}
          />
        ))}
      </a.group>
    </>
  );
};

export default HUDText;
