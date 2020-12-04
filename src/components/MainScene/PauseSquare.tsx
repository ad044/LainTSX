import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import pauseGrayBoxes from "../../static/sprite/pause_gray_boxes.png";
import { a, useSpring } from "@react-spring/three";
import { CurveUtils } from "three";
import { usePauseStore } from "../../store";

type PauseSquareProps = {
  colIdx: number;
  rowIdx: number;
  geometry: THREE.PlaneBufferGeometry;
  active?: boolean;
  shouldDisappear?: boolean;
};

const PauseSquare = (props: PauseSquareProps) => {
  const exitAnimation = usePauseStore((state) => state.exitAnimation);

  const grayBoxesTex = useLoader(THREE.TextureLoader, pauseGrayBoxes);

  const [intro, setIntro] = useState(true);
  const [introAnimToggle, setIntroAnimToggle] = useState(false);

  const { introToggle } = useSpring({
    introToggle: Number(introAnimToggle),
    config: { duration: 200 },
  });

  const { toggle } = useSpring({
    toggle: Number(props.active),
    config: { duration: 200 },
  });

  const rotX = toggle.to([0, 1], [-Math.PI, exitAnimation ? 2.2 : 0]);
  const rotY = toggle.to([0, 1], [Math.PI / 2, exitAnimation ? 2.2 : 0]);

  const introRotX = introToggle.to([0, 1], [Math.PI, 0]);
  const introRotY = introToggle.to(
    [0, 1],
    [Math.PI, props.shouldDisappear ? Math.PI / 2 : 0]
  );

  useEffect(() => {
    setTimeout(() => {
      setTimeout(() => {
        setIntroAnimToggle(true);
      }, (props.rowIdx + props.colIdx) * 100);

      setTimeout(() => {
        setIntro(false);
      }, 1500);
    }, 500);
  }, [props.colIdx, props.rowIdx]);

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
    rotZ: 0,
    from: { posX: 1.05, posY: 1.07, rotZ: -1 },
    config: { duration: 500 },
  });

  return (
    <a.mesh
      geometry={props.geometry}
      position-x={initialState.posX}
      position-y={initialState.posY}
      scale={[
        props.colIdx > 3 ? -0.25 : 0.25,
        props.rowIdx <= 3 ? -0.25 : 0.25,
        0,
      ]}
      rotation-x={intro ? introRotX : rotX}
      rotation-y={intro ? introRotY : rotY}
      rotation-z={initialState.rotZ}
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
      />
    </a.mesh>
  );
};

export default PauseSquare;
