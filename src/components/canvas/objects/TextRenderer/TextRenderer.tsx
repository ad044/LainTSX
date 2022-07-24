import React, { memo } from "react";
import Letter from "./Letter";
import { Scale, TextType } from "@/types";
import useText from "@/hooks/useText";

type TextRendererProps = {
  type: TextType;
  text: string;
  scale: Scale;
  renderOrder?: number
  depthTest?: boolean;
};

const TextRenderer = (props: TextRendererProps) => {
  const { font, texture } = useText(props.type);

  return (
    <>
      {props.text.split("").map((letter, idx) => (
        <Letter
          key={idx}
          font={font}
          texture={texture}
          letter={letter}
          posX={idx * props.scale[0]}
          scale={props.scale}
          renderOrder={props.renderOrder}
          depthTest={props.depthTest}
        />
      ))}
    </>
  );
};

export default memo(TextRenderer);
