import React, { useEffect, useRef } from "react";
import { useStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import BigLetter from "./BigLetter";

const YellowTextRenderer = (props: { visible?: boolean }) => {
  const xOffset = useStore((state) => state.bigTextXOffset);
  const visible = useStore((state) => state.bigTextVisible);
  const color = useStore((state) => state.bigTextColor);

  const textRef = useRef(useStore.getState().bigText.split(""));

  const [trail, set] = useTrail(textRef.current.length, () => ({
    posX: useStore.getState().bigTextPos[0],
    posY: useStore.getState().bigTextPos[1],
    config: { duration: 280 },
  }));

  useEffect(
    () =>
      useStore.subscribe(
        (state) => {
          textRef.current = (state as any).bigText.split("");
        },
        (state) => state
      ),
    []
  );

  useEffect(() => {
    useStore.subscribe(set, (state) => ({
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
