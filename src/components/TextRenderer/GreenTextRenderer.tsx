import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import greenFont from "../../static/sprites/fonts/white_and_green_texture.png";
import medium_font_json from "../../resources/fonts/medium_font.json";
import { a } from "@react-spring/three";
import React, { memo, useMemo } from "react";
import { useStore } from "../../store";

const GreenTextRenderer = memo(() => {
  const textToRender = useStore((state) =>
    (state.currentScene === "main"
      ? state.activeNode.title
      : state.activeNode.node_name
    ).split("")
  );

  const colorTexture = useLoader(THREE.TextureLoader, greenFont);

  const getLineYOffset = (letter: string) => {
    const lineOne = "ABCDEFGHIJKLMNOPQQRSTUVW";
    const lineTwo = "XYZ0123456789abcdefghij";
    const lineThree = "klmnopqrstuvwxyz,.*";

    let lineNum: number;
    if (letter === " ") {
      lineNum = 6;
    } else {
      if (lineOne.includes(letter)) {
        lineNum = 1;
      } else if (lineTwo.includes(letter)) {
        lineNum = 2;
      } else if (lineThree.includes(letter)) {
        lineNum = 3;
      } else {
        lineNum = 4;
      }
    }

    const offsets = {
      1: 0.355,
      2: 0.297,
      3: 0.238,
      4: 0.18,
      5: 1,
    };
    return offsets[lineNum as keyof typeof offsets];
  };

  const text = useMemo(() => {
    const getGeom = (letter: string, letterData: number[]) => {
      const geometry = new THREE.PlaneBufferGeometry();

      const uvAttribute = geometry.attributes.uv;

      for (let i = 0; i < uvAttribute.count; i++) {
        let u = uvAttribute.getX(i);
        let v = uvAttribute.getY(i);

        u = (u * letterData[2]) / 256 + letterData[0] / 256;

        v =
          (v * letterData[3]) / 136 +
          getLineYOffset(letter) -
          letterData[4] / 136;

        uvAttribute.setXY(i, u, v);
      }

      return geometry;
    };

    return textToRender.map((letter, idx) => {
      const letterData =
        medium_font_json.glyphs[letter as keyof typeof medium_font_json.glyphs];
      const geom = getGeom(letter, letterData);

      return (
        <a.mesh
          position-x={idx * 1.6}
          position-y={0 - letterData[4] / 12.5}
          scale={[1.7, 1, 1.7]}
          geometry={geom}
          renderOrder={100}
          key={idx}
        >
          <meshBasicMaterial
            map={colorTexture}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </a.mesh>
      );
    });
  }, [colorTexture, textToRender]);

  return <>{text}</>;
});

export default GreenTextRenderer;
