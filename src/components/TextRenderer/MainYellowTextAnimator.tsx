import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";
import usePrevious from "../../hooks/usePrevious";
import { getNodeHud, isNodeVisible } from "../../helpers/node-helpers";

const MainYellowTextAnimator = (props: { visible?: boolean }) => {
  const activeNode = useStore((state) => state.activeNode);
  const subscene = useStore((state) => state.mainSubscene);
  const prevData = usePrevious({ subscene });
  const gameProgress = useStore((state) => state.gameProgress);

  const [text, setText] = useState(
    useStore.getState().activeNode.node_name.split("")
  );

  const [trail, set] = useTrail(text.length, () => ({
    posX: getNodeHud(useStore.getState().activeNode.matrixIndices!).big_text[0],
    posY: getNodeHud(useStore.getState().activeNode.matrixIndices!).big_text[1],
    config: { duration: 280 },
  }));

  useEffect(() => {
    const hud = getNodeHud(activeNode.matrixIndices!);

    if (subscene === "level_selection") {
      setTimeout(() => set({ posX: -0.02, posY: 0.005 }), 400);
      setTimeout(() => setText("JumpTo".split("")), 1000);
    } else {
      setTimeout(
        () => set({ posX: hud.big_text[0], posY: hud.big_text[1] }),
        400
      );

      if (isNodeVisible(activeNode, gameProgress)) {
        setTimeout(() => setText(activeNode.node_name.split("")), 1000);
      } else {
        setText("Unknown".split(""));
      }
    }
  }, [activeNode, prevData?.subscene, set, subscene, gameProgress]);

  return (
    <group position={[0, 0, 10]} visible={props.visible}>
      {trail.map(({ posX, posY }, idx) => (
        <a.group
          key={idx}
          position-x={posX}
          position-y={posY}
          position-z={-8.6}
          scale={[0.035, 0.055, 0.035]}
        >
          <BigLetter letter={text[idx]} letterIdx={idx} key={idx} />
        </a.group>
      ))}
    </group>
  );
};

export default MainYellowTextAnimator;
