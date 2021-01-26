import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";
import { getNodeHud } from "../../core/nodeSelector";

const YellowTextRenderer = (props: { visible?: boolean }) => {
  const visible = useStore((state) => state.bigTextVisible);
  const color = useStore((state) => state.bigTextColor);

  const activeNode = useStore((state) => state.activeNode);

  const [text, setText] = useState(useStore.getState().bigText.split(""));

  const [trail, set] = useTrail(text.length, () => ({
    posX: useStore.getState().bigTextPos[0],
    posY: useStore.getState().bigTextPos[1],
    config: { duration: 280 },
  }));

  useEffect(() => {
    const hud = getNodeHud(activeNode.matrixIndices!);
    setTimeout(() => {
      set({ posX: hud.big_text[0], posY: hud.big_text[1] });
    }, 400);

    setTimeout(() => {
      setText(activeNode.node_name.split(""));
    }, 1000);
  }, [activeNode, set]);

  return (
    <group position={[0, 0, 10]} visible={props.visible && visible}>
      {trail.map(({ posX, posY }, idx) => (
        <a.group
          key={idx}
          position-x={posX}
          position-y={posY}
          position-z={-8.7}
          scale={[0.04, 0.06, 0.04]}
        >
          <BigLetter
            color={color}
            letter={text[idx]}
            letterIdx={idx}
            key={idx}
          />
        </a.group>
      ))}
    </group>
  );
};

export default YellowTextRenderer;
