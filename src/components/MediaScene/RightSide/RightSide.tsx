import React, { useCallback } from "react";
import { useMediaWordStore } from "../../../store";
import Word from "./Word";
import { useSpring } from "@react-spring/three";

type RightSideProps = {
  activeMediaElement: string;
};

const RightSide = (props: RightSideProps) => {
  const words = useMediaWordStore((state) => state.words);

  const wordStateDataStructIdx = useMediaWordStore(
    (state) => state.wordStateDataStructIdx
  );

  const wordState = useMediaWordStore(
    useCallback((state) => state.wordStateDataStruct[wordStateDataStructIdx], [
      wordStateDataStructIdx,
    ])
  );

  console.log(wordStateDataStructIdx);
  const wordStateSpring = useSpring({
    fstWordPosX: wordState.positions.fstWord.posX,
    fstWordPosY: wordState.positions.fstWord.posY,
    sndWordPosX: wordState.positions.sndWord.posX,
    sndWordPosY: wordState.positions.sndWord.posY,
    thirdWordPosX: wordState.positions.thirdWord.posX,
    thirdWordPosY: wordState.positions.thirdWord.posY,
    config: { duration: 300 },
  });

  return (
    <>
      <Word
        word={words[0]}
        posX={wordStateSpring.fstWordPosX}
        posY={wordStateSpring.fstWordPosY}
        active={props.activeMediaElement === "fstWord"}
      />
      <Word
        word={words[1]}
        posX={wordStateSpring.sndWordPosX}
        posY={wordStateSpring.sndWordPosY}
        active={props.activeMediaElement === "sndWord"}
      />
      <Word
        word={words[2]}
        posX={wordStateSpring.thirdWordPosX}
        posY={wordStateSpring.thirdWordPosY}
        active={props.activeMediaElement === "thirdWord"}
      />
    </>
  );
};

export default RightSide;
