import React, { useCallback } from "react";
import { useMediaWordStore } from "../../../store";
import Word from "./Word";
import { useSpring } from "@react-spring/three";

type RightSideProps = {
  activeMediaElement: string;
};

const RightSide = (props: RightSideProps) => {
  const words = useMediaWordStore((state) => state.words);

  const wordPositionDataStructIdx = useMediaWordStore(
    (state) => state.wordPositionDataStructIdx
  );

  const wordPositionState = useMediaWordStore(
    useCallback(
      (state) => state.wordPositionDataStruct[wordPositionDataStructIdx],
      [wordPositionDataStructIdx]
    )
  );

  const wordPositionStateSpring = useSpring({
    fstWordPosX: wordPositionState.positions.fstWord.posX,
    fstWordPosY: wordPositionState.positions.fstWord.posY,
    sndWordPosX: wordPositionState.positions.sndWord.posX,
    sndWordPosY: wordPositionState.positions.sndWord.posY,
    thirdWordPosX: wordPositionState.positions.thirdWord.posX,
    thirdWordPosY: wordPositionState.positions.thirdWord.posY,
    config: { duration: 300 },
  });

  return (
    <>
      <Word
        word={words[0]}
        posX={wordPositionStateSpring.fstWordPosX}
        posY={wordPositionStateSpring.fstWordPosY}
        active={props.activeMediaElement === "fstWord"}
      />
      <Word
        word={words[1]}
        posX={wordPositionStateSpring.sndWordPosX}
        posY={wordPositionStateSpring.sndWordPosY}
        active={props.activeMediaElement === "sndWord"}
      />
      <Word
        word={words[2]}
        posX={wordPositionStateSpring.thirdWordPosX}
        posY={wordPositionStateSpring.thirdWordPosY}
        active={props.activeMediaElement === "thirdWord"}
      />
    </>
  );
};

export default RightSide;
