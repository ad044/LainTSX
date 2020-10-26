import React, { memo, useEffect, useMemo } from "react";
import {
  useBlueOrbStore,
  useMediaWordStore,
  useTextRendererStore,
} from "../../store";
import site_a from "../../resources/site_a.json";
import string_table from "../../resources/string_table.json";

const MediaSceneInitializer = memo(() => {
  const setYellowText = useTextRendererStore((state) => state.setYellowText);
  const setYellowTextPosX = useTextRendererStore(
    (state) => state.setYellowTextPosX
  );
  const setYellowTextPosY = useTextRendererStore(
    (state) => state.setYellowTextPosY
  );
  const currentBlueOrb = useBlueOrbStore((state) => state.activeBlueOrbId);
  const setGreenText = useTextRendererStore((state) => state.setGreenText);
  const setGreenTextPosY = useTextRendererStore(
    (state) => state.setGreenTextPosY
  );
  const setGreenTextPosX = useTextRendererStore(
    (state) => state.setGreenTextPosX
  );
  const setWords = useMediaWordStore((state) => state.setWords);

  const blueOrbData = useMemo(
    () => site_a[currentBlueOrb as keyof typeof site_a],
    [currentBlueOrb]
  );

  useEffect(() => {
    setGreenText(blueOrbData.node_name);
    setYellowText("Play");
    setYellowTextPosX(-0.8);
    setYellowTextPosY(0.05);
    setGreenTextPosX({ initial: 0.02, final: 0.02 });
    setGreenTextPosY(0.675);
    setWords([
      string_table[blueOrbData.words[1] as keyof typeof string_table],
      string_table[blueOrbData.words[2] as keyof typeof string_table],
      string_table[blueOrbData.words[3] as keyof typeof string_table],
    ]);
  }, [
    blueOrbData,
    setGreenText,
    setGreenTextPosX,
    setGreenTextPosY,
    setWords,
    setYellowText,
    setYellowTextPosX,
    setYellowTextPosY,
  ]);
  return null;
});

export default MediaSceneInitializer;
