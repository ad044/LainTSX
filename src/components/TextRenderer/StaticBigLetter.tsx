import orangeFont from "../../static/sprite/orange_font_texture.png";
import yellowFont from "../../static/sprite/yellow_font_texture.png";
import whiteFont from "../../static/sprite/white_and_green_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/font_data/big_font.json";
import { a, Interpolation, SpringValue, useSpring } from "@react-spring/three";
import React, { useMemo } from "react";

const StaticBigLetter = (props: {
  color: string;
  letter: string;
  letterIdx: number;
  position: number[];
  scale: number[];
  active: boolean;
}) => {
  const { toggle } = useSpring({
    toggle: Number(props.active),
    config: { duration: 200 },
  });

  const rotX = toggle.to([0, 1], [-Math.PI, 0]);
  const rotY = toggle.to([0, 1], [Math.PI / 2, 0]);

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

  return (
    <a.mesh
      position={[
        props.position[0],
        -letterData[4] / 50 + props.position[1],
        props.position[2],
      ]}
      scale={props.scale as [number, number, number]}
      geometry={geom}
      rotation-x={rotX}
      rotation-y={rotY}
    >
      <meshBasicMaterial
        map={colorTexture}
        attach="material"
        transparent={true}
      />
    </a.mesh>
  );
};

export default StaticBigLetter;
