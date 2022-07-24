import React from "react";
import { a, SpringValue } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { Position, TextType } from "@/types";
import TextRenderer from "../TextRenderer/TextRenderer";

type WordProps = {
  word: string;
  position: SpringValue<Position>;
  active: boolean;
};

const Word = (props: WordProps) => {
  const inactive = useTexture("/sprites/media/word_background.png");
  const active = useTexture("/sprites/media/word_background_active.png");

  return (
    <a.group position={props.position}>
      <group position={[-3.8, 2, 0]}>
        <TextRenderer
          type={props.active ? TextType.MediumWhite : TextType.MediumBlack}
          text={props.word}
          scale={[0.25, 0.25, 0]}
        />
      </group>
      <sprite scale={[4.2, 0.45, 1]} position={[-2, 2, 0]} renderOrder={2}>
        <spriteMaterial
          map={props.active ? active : inactive}
          alphaTest={0.01}
        />
      </sprite>
    </a.group>
  );
};

export default Word;
