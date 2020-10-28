import { memo, useEffect, useMemo } from "react";
import {
  ImageSrc,
  useBlueOrbStore,
  useImageStore,
  useMediaStore,
  useMediaWordStore,
  useTextRendererStore,
} from "../../store";
import site_a from "../../resources/site_a.json";
import string_table from "../../resources/string_table.json";
import image_table from "../../resources/image_table.json";

const MediaSceneInitializer = memo(() => {
  const lastActiveLeftSideComponent = useMediaStore(
    (state) => state.lastActiveLeftSideElement
  );
  const setActiveMediaComponent = useMediaStore(
    (state) => state.setActiveMediaComponent
  );
  const setYellowText = useTextRendererStore((state) => state.setYellowText);
  const setYellowTextPosX = useTextRendererStore(
    (state) => state.setYellowTextPosX
  );
  const setYellowTextPosY = useTextRendererStore(
    (state) => state.setYellowTextPosY
  );
  const setGreenText = useTextRendererStore((state) => state.setGreenText);
  const setGreenTextPosY = useTextRendererStore(
    (state) => state.setGreenTextPosY
  );
  const setGreenTextPosX = useTextRendererStore(
    (state) => state.setGreenTextPosX
  );
  const setWords = useMediaWordStore((state) => state.setWords);

  const activeBlueOrb = useBlueOrbStore((state) => state.activeBlueOrbId);

  const blueOrbData = useMemo(
    () => site_a[activeBlueOrb as keyof typeof site_a],
    [activeBlueOrb]
  );

  const resetWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.resetWordPositionDataStructIdx
  );
  const setImages = useImageStore((state) => state.setImages);

  useEffect(() => {
    setActiveMediaComponent(lastActiveLeftSideComponent);
    setGreenText(blueOrbData.node_name);
    setYellowText("Play");
    setYellowTextPosX(-0.8);
    setYellowTextPosY(0.05);
    setGreenTextPosX({ initial: 0.02, final: 0.02 });
    setGreenTextPosY(0.675);
    resetWordPositionDataStructIdx();
    setWords([
      string_table[blueOrbData.words[1] as keyof typeof string_table],
      string_table[blueOrbData.words[2] as keyof typeof string_table],
      string_table[blueOrbData.words[3] as keyof typeof string_table],
    ]);


  }, [
    activeBlueOrb,
    blueOrbData,
    lastActiveLeftSideComponent,
    resetWordPositionDataStructIdx,
    setActiveMediaComponent,
    setGreenText,
    setGreenTextPosX,
    setGreenTextPosY,
    setImages,
    setWords,
    setYellowText,
    setYellowTextPosX,
    setYellowTextPosY,
  ]);
  return null;
});

export default MediaSceneInitializer;
