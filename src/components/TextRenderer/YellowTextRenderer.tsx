import React, { useEffect, useRef } from "react";
import { useMainSceneStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";

const YellowTextRenderer = (props: { visible?: boolean }) => {
  const xOffset = useMainSceneStore((state) => state.bigTextXOffset);
  const visible = useMainSceneStore((state) => state.bigTextVisible);
  const color = useMainSceneStore((state) => state.bigTextColor);

  const textRef = useRef(useMainSceneStore.getState().bigText.split(""));

  const [trail, set] = useTrail(textRef.current.length, () => ({
    posX: 0,
    posY: 0,
    config: { duration: 280 },
  }));

  useEffect(
    () =>
      useMainSceneStore.subscribe(
        (state) => {
          textRef.current = (state as any).bigText.split("");
        },
        (state) => state
      ),
    []
  );

  useEffect(() => {
    useMainSceneStore.subscribe(set, (state) => ({
      posX: state.bigTextPos[0],
      posY: state.bigTextPos[1],
    }));
  }, [set]);

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
            xOffset={xOffset}
            letter={textRef.current[idx]}
            letterIdx={idx}
            key={idx}
          />
        </a.group>
      ))}
    </group>
  );
};

export default YellowTextRenderer;
