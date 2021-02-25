import React, { memo, useMemo } from "react";
import pauseGrayBoxes from "../../../static/sprite/pause_gray_boxes.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";

type PauseSquareProps = {
  geometry: THREE.PlaneBufferGeometry;
  colIdx: number;
  rowIdx: number;
  letter?: string;
  active?: boolean;
  introFinished?: boolean;
  exit?: boolean;
};

const PauseSquare = memo((props: PauseSquareProps) => {
  const squareTex = useLoader(THREE.TextureLoader, pauseGrayBoxes);

  const introSpring = useSpring({
    from: {
      posX: 1.05,
      posY: 1.07,
      rotZ: -1,
      rotX: Math.PI,
      rotY: Math.PI,
    },
    to: async (next) => {
      await next({
        posX: props.colIdx / 2.8,
        posY: props.rowIdx / 2.8,
        rotZ: 0,
        config: { duration: 500 },
      });
      await next({
        rotX: 0,
        rotY: props.letter ? Math.PI / 2 : 0,
        delay: (props.rowIdx + props.colIdx) * 100,
        config: { duration: 200 },
      });
    },
  });

  const exitAnimValue = useMemo(() => {
    let col, row;
    if (props.colIdx < 3) col = -1;
    else if (props.colIdx > 3) col = 1;
    else col = 0;

    if (props.rowIdx < 3) row = -1;
    else if (props.rowIdx > 3) row = 1;
    else row = 0;

    return { row: row * 2.2, col: col * 2.2 };
  }, [props.colIdx, props.rowIdx]);

  const spring = useSpring({
    posX: props.colIdx / 2.8 + (props.exit ? exitAnimValue.col : 0),
    posY: props.rowIdx / 2.8 + (props.exit ? exitAnimValue.row : 0),
    rotY: props.active || props.exit ? Math.PI / 2 : 0,
    rotX: props.active ? Math.PI : 0,
    config: { duration: 500 },
  });

  return (
    <a.mesh
      position-x={props.introFinished ? spring.posX : introSpring.posX}
      position-y={props.introFinished ? spring.posY : introSpring.posY}
      rotation-z={props.introFinished ? 0 : introSpring.rotZ}
      rotation-x={props.introFinished ? spring.rotX : introSpring.rotX}
      rotation-y={
        !props.letter && props.introFinished ? spring.rotY : introSpring.rotY
      }
      geometry={props.geometry}
      scale={[
        props.colIdx > 3 ? -0.25 : 0.25,
        props.rowIdx <= 3 ? -0.25 : 0.25,
        0,
      ]}
      renderOrder={100}
    >
      <meshBasicMaterial
        attach="material"
        map={squareTex}
        side={
          (props.colIdx > 3 && props.rowIdx <= 3) ||
          (props.colIdx <= 3 && props.rowIdx > 3)
            ? THREE.FrontSide
            : THREE.BackSide
        }
        transparent={true}
        depthTest={false}
      />
    </a.mesh>
  );
});

export default PauseSquare;
