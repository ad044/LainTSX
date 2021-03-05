import orangeFont from "../../static/sprites/fonts/orange_font_texture.png";
import yellowFont from "../../static/sprites/fonts/yellow_font_texture.png";
import whiteFont from "../../static/sprites/fonts/white_and_green_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/fonts/big_font.json";
import { a, useSpring } from "@react-spring/three";
import React, { useMemo, memo } from "react";

const PauseBigLetter = memo(
  (props: {
    letter: string;
    letterIdx: number;
    position: number[];
    rowIdx?: number;
    colIdx?: number;
    mainLetter?: boolean;
    active?: boolean;
    introFinished?: boolean;
    exit?: boolean;
  }) => {
    const whiteFontTex = useLoader(THREE.TextureLoader, whiteFont);
    const orangeFontTex = useLoader(THREE.TextureLoader, orangeFont);
    const yellowFontTex = useLoader(THREE.TextureLoader, yellowFont);

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

    const mainLetterIntroSpring = useSpring({
      from: {
        rotX: Math.PI,
        rotY: Math.PI / 2,
      },
      to: { rotY: 0, rotX: 0 },
      delay: (props.rowIdx! + props.colIdx!) * 100 + 500,
      config: { duration: 500 },
    });

    const exitAnimValue = useMemo(() => {
      let col, row;
      if (props.colIdx! < 3) col = -1;
      else if (props.colIdx! > 3) col = 1;
      else col = 0;

      if (props.rowIdx! < 3) row = -1;
      else if (props.rowIdx! > 3) row = 1;
      else row = 0;

      return { row: row * 2.2, col: col * 2.2 };
    }, [props.colIdx, props.rowIdx]);

    const mainLetterSpring = useSpring({
      orangeRotY: props.active ? 0 : Math.PI / 2,
      orangeRotX: props.active ? 0 : Math.PI,
      whiteRotY: props.active || props.exit ? Math.PI / 2 : 0,
      whiteRotX: props.active || props.exit ? Math.PI : 0,
      posX: props.colIdx
        ? props.colIdx / 2.8 + (props.exit ? exitAnimValue.col : 0)
        : props.position[0],
      posY: props.rowIdx
        ? props.rowIdx / 2.8 + (props.exit ? exitAnimValue.row : 0)
        : -letterData[4] / 50 + props.position[1],
      config: { duration: 500 },
    });

    const nonMainLetterSpring = useSpring({
      rotY: props.active ? 0 : Math.PI / 2,
      rotX: props.active ? 0 : Math.PI,
      config: { duration: 500 },
    });

    return (
      <>
        {props.mainLetter ? (
          <>
            <a.mesh
              position={[
                props.position[0],
                -letterData[4] / 50 + props.position[1],
                props.position[2],
              ]}
              scale={[0.25, 0.25, 0]}
              geometry={geom}
              rotation-x={
                props.introFinished
                  ? mainLetterSpring.orangeRotX
                  : mainLetterIntroSpring.rotX
              }
              rotation-y={
                props.introFinished
                  ? mainLetterSpring.orangeRotY
                  : mainLetterIntroSpring.rotY
              }
              position-x={mainLetterSpring.posX}
              position-y={mainLetterSpring.posY}
              renderOrder={100}
            >
              <meshBasicMaterial
                map={props.introFinished ? orangeFontTex : whiteFontTex}
                attach="material"
                transparent={true}
                side={THREE.FrontSide}
                depthTest={false}
              />
            </a.mesh>
            <a.mesh
              position={[
                props.position[0],
                -letterData[4] / 50 + props.position[1],
                props.position[2],
              ]}
              scale={[0.25, 0.25, 0]}
              geometry={geom}
              position-x={mainLetterSpring.posX}
              position-y={mainLetterSpring.posY}
              rotation-x={
                props.introFinished ? mainLetterSpring.whiteRotX : Math.PI
              }
              rotation-y={
                props.introFinished ? mainLetterSpring.whiteRotY : Math.PI / 2
              }
              renderOrder={100}
            >
              <meshBasicMaterial
                map={whiteFontTex}
                attach="material"
                transparent={true}
                side={THREE.FrontSide}
                depthTest={false}
              />
            </a.mesh>
          </>
        ) : (
          <a.mesh
            position={[
              props.position[0],
              -letterData[4] / 50 + props.position[1],
              props.position[2],
            ]}
            scale={[0.25, 0.25, 0]}
            geometry={geom}
            rotation-x={nonMainLetterSpring.rotX}
            rotation-y={nonMainLetterSpring.rotY}
            renderOrder={100}
          >
            <meshBasicMaterial
              map={yellowFontTex}
              attach="material"
              transparent={true}
              side={THREE.FrontSide}
              depthTest={false}
            />
          </a.mesh>
        )}
      </>
    );
  }
);

export default PauseBigLetter;
