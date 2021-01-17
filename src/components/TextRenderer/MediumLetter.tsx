import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import greenFont from "../../static/sprite/white_and_green_texture.png";
import medium_font_json from "../../resources/font_data/medium_font.json";
import { a } from "@react-spring/three";
import React, { useMemo, memo } from "react";

const MediumLetter = memo((props: { letter: string; letterIdx: number }) => {
  const colorTexture = useLoader(THREE.TextureLoader, greenFont);
  // i have yet to figure out a genrealizable way of
  // calculating the y offset, this shit will do for now
  // also, we dont have all the lines since i dont need them yet.
  // also, baseline offsets dont work properly since i dont need them yet either
  // should be trivial to calculate though, im just lazy
  const getLineNum = (letter: string) => {
    const lineOne = "ABCDEFGHIJKLMNOPQQRSTUVW";
    const lineTwo = "XYZ0123456789abcdefghij";
    const lineThree = "klmnopqrstuvwxyz,.*";

    if (letter === " ") return 5;

    if (lineOne.includes(letter)) {
      return 1;
    } else if (lineTwo.includes(letter)) {
      return 2;
    } else if (lineThree.includes(letter)) {
      return 3;
    } else {
      return 4;
    }
  };

  // 5th one is just a space, this is my hacky way of doing it.
  const lineYOffsets = useMemo(
    () => ({
      1: 0.355,
      2: 0.297,
      3: 0.238,
      4: 0.18,
      5: 1,
    }),
    []
  );

  const letterData =
    medium_font_json.glyphs[
      props.letter as keyof typeof medium_font_json.glyphs
    ];

  const geom = useMemo(() => {
    const geometry = new THREE.PlaneBufferGeometry();

    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * letterData[2]) / 256 + letterData[0] / 256;

      v =
        (v * letterData[3]) / 136 +
        lineYOffsets[getLineNum(props.letter)] -
        letterData[4] / 136;

      uvAttribute.setXY(i, u, v);
    }

    return geometry;
  }, [letterData, lineYOffsets, props.letter]);

  return (
    <a.mesh
      position-x={props.letterIdx * 1.6}
      position-y={0 - letterData[4] / 12.5}
      scale={[1.7, 1, 1.7]}
      geometry={geom}
      renderOrder={100}
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

export default MediumLetter;
