import orangeFont from "../../static/sprite/orange_font_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/font_data/big_font.json";
import React, { memo, useMemo } from "react";

const StaticOrangeLetter = memo(
  (props: { letter: string; letterIdx: number }) => {
    const colorTexture: THREE.Texture = useLoader(
      THREE.TextureLoader,
      orangeFont
    );

    const lineYOffset = useMemo(() => {
      const lineOne = "ABCDEFGHIJKLMNOPQ";
      const lineTwo = "RSTUVWXYZ01234567";
      const lineThree = "89abcdefghijklmnopqrs";

      let lineNum: number;
      if (props.letter === " ") {
        lineNum = 5;
      } else {
        if (lineOne.includes(props.letter)) {
          lineNum = 1;
        } else if (lineTwo.includes(props.letter)) {
          lineNum = 2;
        } else if (lineThree.includes(props.letter)) {
          lineNum = 3;
        } else {
          lineNum = 4;
        }
      }

      const offsets = {
        1: 0.884,
        2: 0.765,
        3: 0.648,
        4: 0.47,
        5: 1,
      };
      return offsets[lineNum as keyof typeof offsets];
    }, [props.letter]);

    const letterData = useMemo(
      () =>
        orange_font_json.glyphs[
          props.letter as keyof typeof orange_font_json.glyphs
        ],
      [props.letter]
    );

    const geom = useMemo(() => {
      const geometry = new THREE.PlaneBufferGeometry();

      const uvAttribute = geometry.attributes.uv;

      for (let i = 0; i < uvAttribute.count; i++) {
        let u = uvAttribute.getX(i);
        let v = uvAttribute.getY(i);

        u = (u * letterData[2]) / 256 + letterData[0] / 256;

        v = (v * letterData[3]) / 136 + lineYOffset - letterData[4] / 136;

        uvAttribute.setXY(i, u, v);
      }
      return geometry;
    }, [letterData, lineYOffset]);

    return (
      <mesh
        position={[props.letterIdx * 1.6, -letterData[4] / 50, 0]}
        scale={[1.5, 0.25, 0.25]}
        geometry={geom}
        renderOrder={205}
      >
        <meshBasicMaterial
          map={colorTexture}
          attach="material"
          transparent={true}
          side={THREE.FrontSide}
          depthTest={false}
        />
      </mesh>
    );
  }
);

export default StaticOrangeLetter;
