import React from "react";
import orange_font_json from "../../resources/orange_font.json";
import Letter from "../TextRenderer";

type HUDTextProps = {
  text: string;
  hudTextPos: number[];
};

const HUDText = (props: HUDTextProps) => {
  return (
    <group position={props.hudTextPos as [number, number, number]} scale={[0.04, 0.06, 0.04]}>
      {props.text.split("").map((letter: string, idx: number) => {
        return (
          <Letter
            color={"yellow"}
            letter={letter}
            kerningOffset={idx}
            key={idx}
          />
        );
      })}
    </group>
  );
};

export default HUDText;
