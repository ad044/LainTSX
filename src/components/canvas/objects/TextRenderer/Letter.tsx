import { a, SpringValue } from "@react-spring/three";
import React, { memo, useMemo } from "react";
import useLetterGeometry from "@/hooks/useLetterGeometry";
import { FontData } from "@/types";

export type LetterProps = {
  font: FontData;
  texture: THREE.Texture;
  letter: string;
  posX: SpringValue<number> | number;
  scale: [number, number, number];
  renderOrder?: number;
  depthTest?: boolean;
};

const Letter = (props: LetterProps) => {
  const letterData = useMemo(() => props.font.glyphs[props.letter], [props]);

  const geometry = useLetterGeometry(
    letterData,
    props.texture.image.width,
    props.texture.image.height
  );

  return (
    <a.mesh
      position-x={props.posX}
      position-y={-letterData[4] / 12.5}
      scale={props.scale}
      geometry={geometry}
      renderOrder={props.renderOrder ?? 10}
    >
      <meshBasicMaterial
        map={props.texture}
        transparent={true}
        depthTest={props.depthTest}
      />
    </a.mesh>
  );
};

export default memo(Letter);
