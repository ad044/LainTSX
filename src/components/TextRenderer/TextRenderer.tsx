import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import orangeFont from "../../static/sprites/orange_font_texture.png";
import greenFont from "../../static/sprites/white_and_green_texture.png";
import yellowFont from "../../static/sprites/yellow_font_texture.png";
import orange_font_json from "../../resources/orange_font.json";
import medium_font_json from "../../resources/medium_font.json";
import { a, useSpring } from "@react-spring/three";
import React from "react";
import { useRecoilValue } from "recoil";
import { bigLetterOffsetXCoeffAtom } from "./TextRendererAtom";
import { useBlueOrbStore } from "../store";

type LetterProps = {
  color: string;
  letter: string;
  kerningOffset: number;
};

type LineYOffsets = {
  [line: number]: number;
};

type ColorToTexture = {
  [key: string]: string;
};

type LetterData = {
  [letter: string]: number[];
};

type FontData = {
  kerning: number;
  baseline: number;
  height: number;
  glyphs: LetterData;
};

export const BigLetter = (props: LetterProps) => {
  const yellowTextOffsetXCoeff = useBlueOrbStore(
    (state) => state.yellowHudTextOffsetXCoeff
  );

  const colorToTexture = (color: string) => {
    return ({ orange: orangeFont, yellow: yellowFont } as ColorToTexture)[
      color
    ];
  };

  // first letter in big font is always orange in this case so make it orange if so. else,
  // run through the function.
  const color =
    props.kerningOffset === 0 ? orangeFont : colorToTexture(props.color);

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

  const lineYOffsets: LineYOffsets = {
    1: 0.884,
    2: 0.765,
    3: 0.65,
    4: 0.47,
  };

  const letterData = (orange_font_json as FontData)["glyphs"][props.letter];

  if (!letterData) debugger;

  const geometry = new THREE.PlaneBufferGeometry();

  const uvAttribute = geometry.attributes.uv;

  for (let i = 0; i < uvAttribute.count; i++) {
    let u = uvAttribute.getX(i);
    let v = uvAttribute.getY(i);

    u = (u * letterData[2]) / 256 + letterData[0] / 256;

    v =
      (v * letterData[3]) / 136 +
      letterData[4] / 136 +
      lineYOffsets[getLineNum(props.letter)] -
      letterData[4] / 136;

    uvAttribute.setXY(i, u, v);
  }

  const textRendererState = useSpring({
    letterOffsetXCoeff:
      props.kerningOffset === 0
        ? props.kerningOffset + props.kerningOffset * yellowTextOffsetXCoeff
        : props.kerningOffset +
          0.3 +
          (props.kerningOffset + 0.3) * yellowTextOffsetXCoeff,
    config: { duration: 200 },
  });

  return (
    <a.mesh
      position-x={textRendererState.letterOffsetXCoeff}
      position-y={props.kerningOffset === 0 ? -0.03 : 0}
      scale={props.kerningOffset === 0 ? [1.7, 1, 1.7] : [1, 1, 1]}
      geometry={geometry}
      renderOrder={props.kerningOffset === 0 ? 4 : 3}
    >
      <meshBasicMaterial
        map={colorTexture}
        attach="material"
        transparent={true}
      />
    </a.mesh>
  );
};

export const MediumLetter = (props: LetterProps) => {
  // for now we only use the green, ill add others as we go
  const colorToTexture = (color: string) => {
    return ({ orange: orangeFont, yellow: yellowFont } as ColorToTexture)[
      color
    ];
  };

  const colorTexture = useLoader(THREE.TextureLoader, greenFont);
  // i have yet to figure out a genrealizable way of
  // calculating the y offset, this shit will do for now
  // also, we dont have all the lines since i dont need them yet.
  // also, baseline offsets dont work properly since i dont need them yet either
  // should be trivial to calculate though, im just lazy
  const getLineNum = (letter: string) => {
    const lineOne = "ABCDEFGHIJKLMNOPQQRSTUVW";
    const lineTwo = "XYZ0123456779abcdefghij";
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
  const lineYOffsets: LineYOffsets = {
    1: 0.355,
    2: 0.297,
    3: 0.238,
    4: 0.18,
    5: 1,
  };

  const letterData = (medium_font_json as FontData)["glyphs"][props.letter];

  if (!letterData) debugger;

  const geometry = new THREE.PlaneBufferGeometry();

  const uvAttribute = geometry.attributes.uv;

  for (let i = 0; i < uvAttribute.count; i++) {
    let u = uvAttribute.getX(i);
    let v = uvAttribute.getY(i);

    u = (u * letterData[2]) / 256 + letterData[0] / 256;

    v =
      (v * letterData[3]) / 136 +
      letterData[4] / 136 +
      lineYOffsets[getLineNum(props.letter)] -
      letterData[4] / 136;

    uvAttribute.setXY(i, u, v);
  }

  return (
    <a.mesh
      position-x={props.kerningOffset * 1.6}
      scale={[1.7, 1, 1.7]}
      geometry={geometry}
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
};
