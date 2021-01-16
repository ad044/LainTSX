import orangeFont from "../../static/sprite/orange_font_texture.png";
import yellowFont from "../../static/sprite/yellow_font_texture.png";
import whiteFont from "../../static/sprite/white_and_green_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/font_data/big_font.json";
import { a, useSpring } from "@react-spring/three";
import React, { useMemo } from "react";

const BigLetter = (props: {
  color: string;
  letter: string;
  letterIdx: number;
  xOffsetCoeff: number;
}) => {
  const colorToTexture = (color: string) => {
    const colorTexture = {
      orange: orangeFont,
      yellow: yellowFont,
      white: whiteFont,
    };
    return colorTexture[color as keyof typeof colorTexture];
  };

  // first letter in big font is always orange in this case so make it orange if so. else,
  // run through the function.
  const color =
    props.letterIdx === 0 ? orangeFont : colorToTexture(props.color);

  const colorTexture: THREE.Texture = useLoader(THREE.TextureLoader, color);

  // i have yet to figure out a genrealizable way of
  // calculating the y offset, this shit will do for now
  // also, we dont have all the lines since i dont need them yet.
  // also, baseline offsets dont work properly since i dont need them yet either
  // should be trivial to calculate though, im just lazy
  const getLineNum = (letter: string) => {
    const lineOne = "ABCDEFGHIJKLMNOPQ";
    const lineTwo = "RSTUVWXYZ01234567";
    const lineThree = "89abcdefghijklmnopqrs";

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

  const lineYOffsets = useMemo(
    () => ({
      1: 0.884,
      2: 0.765,
      3: 0.648,
      4: 0.47,
      5: 1,
    }),
    []
  );

  const letterData =
    orange_font_json.glyphs[
      props.letter as keyof typeof orange_font_json.glyphs
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

  const textRendererState = useSpring({
    letterOffsetXCoeff:
      props.letterIdx + 0.3 + (props.letterIdx + 0.3) * props.xOffsetCoeff,
    config: { duration: 200 },
  });

  return (
    <a.mesh
      position-x={textRendererState.letterOffsetXCoeff}
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
};

export default BigLetter;
