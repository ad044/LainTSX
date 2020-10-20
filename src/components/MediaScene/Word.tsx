import React, { useMemo } from "react";
import * as THREE from "three";
import wordInactiveTexture from "../../static/sprite/word_background.png";
import wordActiveTexture from "../../static/sprite/word_background_active.png";
import { useLoader } from "react-three-fiber";

type WordProps = {
  word: string;
  posX: number;
  posY: number;
};

const Word = (props: WordProps) => {
  const wordFont = useLoader(THREE.FontLoader, "/3d_fonts/MediaWord.blob");
  const config = useMemo(
    () => ({
      font: wordFont,
      size: 1,
    }),
    [wordFont]
  );

  const wordInactiveTex = useLoader(THREE.TextureLoader, wordInactiveTexture);
  const wordActiveTex = useLoader(THREE.TextureLoader, wordActiveTexture);

  return (
    <group position-x={props.posX} position-y={props.posY}>
      <mesh scale={[0.4, 0.4, 0]} position={[-3.9, 1.915, 0]} renderOrder={3}>
        <planeBufferGeometry attach="geometry" />
        <textGeometry attach="geometry" args={[props.word, config]} />
        <meshBasicMaterial
          attach="material"
          color={0x000000}
          transparent={true}
        />
      </mesh>

      <sprite scale={[4.2, 0.45, 1]} position={[-2, 2, 0]} renderOrder={2}>
        <spriteMaterial
          attach="material"
          map={wordInactiveTex}
          alphaTest={0.01}
        />
      </sprite>
    </group>
  );
};

export default Word;
