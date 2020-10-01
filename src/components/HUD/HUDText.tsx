import React from "react";
import Letter from "../TextRenderer/TextRenderer";
import { a, useSpring, useTrail } from "@react-spring/three";
import { useRecoilValue } from "recoil";
import { bigLetterPosXAtom, bigLetterPosYAtom } from "./HUDElementAtom";

type HUDTextProps = {
  text: string;
};

const HUDText = (props: HUDTextProps) => {
  const bigLetterPosX = useRecoilValue(bigLetterPosXAtom);
  const bigLetterPosY = useRecoilValue(bigLetterPosYAtom);

  const textArr = props.text.split("");

  const letterTrail = useTrail(textArr.length, {
    bigLetterPosX: bigLetterPosX,
    bigLetterPosY: bigLetterPosY,
    config: { duration: 400 },
  });

  return (
    <>
      {letterTrail.map(({ bigLetterPosX, bigLetterPosY }, idx) => (
        <a.group
          key={textArr[idx]}
          position-x={bigLetterPosX}
          position-y={bigLetterPosY}
          position-z={-8.7}
          scale={[0.04, 0.06, 0.04]}
        >
          <Letter
            color={"yellow"}
            letter={textArr[idx]}
            kerningOffset={idx}
            key={idx}
          />
        </a.group>
      ))}
    </>
  );
};

export default HUDText;
