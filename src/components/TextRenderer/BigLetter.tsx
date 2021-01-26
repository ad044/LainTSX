import orangeFont from "../../static/sprite/orange_font_texture.png";
import yellowFont from "../../static/sprite/yellow_font_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/font_data/big_font.json";
import { a, useSpring } from "@react-spring/three";
import React, { memo, useEffect, useMemo } from "react";
import { useStore } from "../../store";

const BigLetter = memo(
  (props: {
    color: string;
    letter: string;
    letterIdx: number;
    xOffset?: number;
  }) => {
    const tex = useMemo(
      () =>
        props.color === "orange" || props.letterIdx === 0
          ? orangeFont
          : yellowFont,
      [props.color, props.letterIdx]
    );

    const colorTexture: THREE.Texture = useLoader(THREE.TextureLoader, tex);

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

    const activeNode = useStore((state) => state.activeNode);

    const [shrinkState, set] = useSpring(() => ({
      x: props.letterIdx + 0.3,
      config: { duration: 200 },
    }));

    useEffect(() => {
      set({ x: 0 });

      setTimeout(() => {
        set({ x: props.letterIdx + 0.3 });
      }, 1200);
    }, [activeNode, props.letterIdx, set]);

    return (
      <a.mesh
        position-x={shrinkState.x}
        position-y={-letterData[4] / 12.5}
        scale={[1, 1, 0]}
        geometry={geom}
        renderOrder={props.letterIdx === 0 ? 11 : 10}
      >
        <meshBasicMaterial
          map={colorTexture}
          attach="material"
          transparent={true}
        />
      </a.mesh>
    );
  }
);

export default BigLetter;
