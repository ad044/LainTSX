import orangeFont from "../../static/sprite/orange_font_texture.png";
import yellowFont from "../../static/sprite/yellow_font_texture.png";
import whiteFont from "../../static/sprite/white_and_green_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/font_data/big_font.json";
import { a, useSpring } from "@react-spring/three";
import React, { useMemo } from "react";
import { usePauseStore } from "../../store";

const StaticBigLetter = (props: {
  color: string;
  letter: string;
  letterIdx: number;
  position: number[];
  scale: number[];
  active: boolean;
  rowIdx?: number;
  colIdx?: number;
  intro?: boolean;
}) => {
  const exitAnimation = usePauseStore((state) => state.exitAnimation);

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

  const getExitAnimValue = useMemo(() => {
    let col = 0;
    let row = 0;
    if (props.colIdx && props.rowIdx) {
      if (props.colIdx < 3) col = -1;
      else if (props.colIdx > 3) col = 1;

      if (props.rowIdx < 3) row = -1;
      else if (props.rowIdx > 3) row = 1;

      return { row, col };
    }
  }, [props.colIdx, props.rowIdx]);

  const initialState = useSpring({
    posX:
      props.position[0] +
      (getExitAnimValue ? getExitAnimValue.col * (exitAnimation ? 2.2 : 0) : 0),
    posY:
      -letterData[4] / 50 +
      props.position[1] +
      (getExitAnimValue ? getExitAnimValue.row * (exitAnimation ? 2.2 : 0) : 0),
    rotX: props.active ? (exitAnimation ? Math.PI / 2 : 0) : -Math.PI,
    rotY: props.active ? (exitAnimation ? Math.PI / 2 : 0) : Math.PI / 2,
    config: { duration: 500 },
  });

  const introState = useSpring({
    rotX: 0,
    rotY: 0,
    from: { rotX: Math.PI, rotY: Math.PI * 2 },
    delay: (props.rowIdx! + props.colIdx!) * 100 + 500,
    config: { duration: 200 },
  });

  return (
    <a.mesh
      position={[
        props.position[0],
        -letterData[4] / 50 + props.position[1],
        props.position[2],
      ]}
      position-x={initialState.posX}
      position-y={initialState.posY}
      scale={props.scale as [number, number, number]}
      geometry={geom}
      rotation-x={props.intro ? introState.rotX : initialState.rotX}
      rotation-y={props.intro ? introState.rotY : initialState.rotY}
      renderOrder={100}
    >
      <meshBasicMaterial
        map={colorTexture}
        attach="material"
        transparent={true}
        side={THREE.FrontSide}
        depthTest={false}
      />
    </a.mesh>
  );
};

export default StaticBigLetter;
