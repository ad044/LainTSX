import React, { useMemo, memo } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import pauseGrayBoxes from "../../../static/sprite/pause_gray_boxes.png";
import { a, useSpring } from "@react-spring/three";
import { useMainSceneStore } from "../../../store";

type PauseSquareProps = {
  colIdx: number;
  rowIdx: number;
  geometry: THREE.PlaneBufferGeometry;
  active?: boolean;
  shouldDisappear?: boolean;
  intro?: boolean;
};

const PauseSquare = memo((props: PauseSquareProps) => {
  const exitAnimation = useMainSceneStore((state) => state.pauseExitAnimation);

  const grayBoxesTex = useLoader(THREE.TextureLoader, pauseGrayBoxes);

  const getExitAnimValue = useMemo(() => {
    let col, row;
    if (props.colIdx < 3) col = -1;
    else if (props.colIdx > 3) col = 1;
    else col = 0;

    if (props.rowIdx < 3) row = -1;
    else if (props.rowIdx > 3) row = 1;
    else row = 0;

    return { row, col };
  }, [props.colIdx, props.rowIdx]);

  const initialState = useSpring({
    posX: props.colIdx / 2.8 + getExitAnimValue.col * (exitAnimation ? 2.2 : 0),
    posY: props.rowIdx / 2.8 + getExitAnimValue.row * (exitAnimation ? 2.2 : 0),
    rotX: props.active ? (exitAnimation ? Math.PI / 2 : 0) : -Math.PI,
    rotY: props.active ? (exitAnimation ? Math.PI / 2 : 0) : Math.PI / 2,
    rotZ: 0,
    from: { posX: 1.05, posY: 1.07, rotZ: -1 },
    config: { duration: 500 },
  });

  const shadowState = useSpring({
    posX: props.colIdx / 2.8 + getExitAnimValue.col * (exitAnimation ? 2.2 : 0),
    posY: props.rowIdx / 2.8 + getExitAnimValue.row * (exitAnimation ? 2.2 : 0),
    rotX: exitAnimation ? Math.PI / 2 : 0,
    rotY: exitAnimation ? Math.PI / 2 : 0,
    from: { posX: 1.05, posY: 1.07, rotZ: -1 },
    config: { duration: 500 },
  });

  const introState = useSpring({
    rotX: 0,
    rotY: props.shouldDisappear ? Math.PI / 2 : 0,
    from: { rotX: Math.PI, rotY: Math.PI },
    delay: (props.rowIdx + props.colIdx) * 100 + 500,
    config: { duration: 200 },
  });

  return (
    <>
      <a.mesh
        geometry={props.geometry}
        position-x={initialState.posX}
        position-y={initialState.posY}
        scale={[
          props.colIdx > 3 ? -0.25 : 0.25,
          props.rowIdx <= 3 ? -0.25 : 0.25,
          0,
        ]}
        rotation-x={props.intro ? introState.rotX : initialState.rotX}
        rotation-y={props.intro ? introState.rotY : initialState.rotY}
        rotation-z={initialState.rotZ}
        renderOrder={100}
      >
        <meshBasicMaterial
          attach="material"
          map={grayBoxesTex}
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
      <group scale={[0.9, 0.9, 0]} position={[0.1, 0.1, 0]}>
        <a.mesh
          geometry={props.geometry}
          position-x={shadowState.posX}
          position-y={shadowState.posY}
          scale={[0.25, 0.25, 0]}
          rotation-x={shadowState.rotX}
          rotation-y={shadowState.rotY}
          rotation-z={initialState.rotZ}
          renderOrder={99}
        >
          <meshBasicMaterial
            attach="material"
            side={THREE.DoubleSide}
            transparent={true}
            color={0x1d1d2d}
          />
        </a.mesh>
      </group>
    </>
  );
});

export default PauseSquare;
