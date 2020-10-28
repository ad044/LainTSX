import { memo, useEffect, useMemo } from "react";
import { useBlueOrbStore, useTextRendererStore } from "../../store";
import site_a from "../../resources/site_a.json";
import blue_orb_huds from "../../resources/blue_orb_huds.json";

const MainSceneInitializer = memo(() => {
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

  const activeBlueOrb = useBlueOrbStore((state) => state.activeBlueOrbId);
  const activeBlueOrbHudId = useBlueOrbStore((state) => state.activeHudId);

  const toggleGreenText = useTextRendererStore(
    (state) => state.toggleGreenText
  );

  const activeBlueOrbHud =
    blue_orb_huds[activeBlueOrbHudId as keyof typeof blue_orb_huds];

  const blueOrbData = useMemo(
    () => site_a[activeBlueOrb as keyof typeof site_a],
    [activeBlueOrb]
  );

  useEffect(() => {
    const node_name = site_a[activeBlueOrb as keyof typeof site_a].node_name;
    setGreenText(blueOrbData.title);
    setYellowText(node_name);
    setYellowTextPosX(activeBlueOrbHud.big_text[0]);
    setYellowTextPosY(activeBlueOrbHud.big_text[1]);

    setGreenTextPosX({
      initial: activeBlueOrbHud.medium_text.initial_position[0],
      final: activeBlueOrbHud.medium_text.position[0],
    });
    setGreenTextPosY(activeBlueOrbHud.medium_text.position[1]);
  }, [
    activeBlueOrb,
    activeBlueOrbHud.big_text,
    activeBlueOrbHud.medium_text.initial_position,
    activeBlueOrbHud.medium_text.position,
    blueOrbData,
    setGreenText,
    setGreenTextPosX,
    setGreenTextPosY,
    setYellowText,
    setYellowTextPosX,
    setYellowTextPosY,
    toggleGreenText,
  ]);
  return null;
});

export default MainSceneInitializer;
