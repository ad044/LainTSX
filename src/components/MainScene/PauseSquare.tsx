import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import pauseGrayBoxes from "../../static/sprite/pause_gray_boxes.png";
import { a, useSpring } from "@react-spring/three";

type PauseSquareProps = {
  colIdx: number;
  rowIdx: number;
  geometry: THREE.PlaneBufferGeometry;
  active: boolean;
};

const PauseSquare = (props: PauseSquareProps) => {
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

  const rotX = toggle.to([0, 1], [-Math.PI, 0]);
  const rotY = toggle.to([0, 1], [Math.PI / 2, 0]);

  const introRotX = introToggle.to([0, 1], [0, 2 * Math.PI]);
  const introRotY = introToggle.to([0, 1], [0, 2 * Math.PI]);

  useEffect(() => {
    setTimeout(() => {
      setIntroAnimToggle(true);
    }, (props.rowIdx + props.colIdx) * 100);

    setTimeout(() => {
      setIntro(false);
    }, 5000);
  }, [props.colIdx, props.rowIdx]);

  const side = useMemo(() => {
    if (intro) return THREE.DoubleSide;
    else {
      if (
        (props.colIdx > 3 && props.rowIdx <= 3) ||
        (props.colIdx <= 3 && props.rowIdx > 3)
      ) {
        return THREE.FrontSide;
      } else {
        return THREE.BackSide;
      }
    }
  }, [intro, props.colIdx, props.rowIdx]);

  return (
    <a.mesh
      geometry={props.geometry}
      position={[props.colIdx / 2.8, props.rowIdx / 2.8, 0]}
      scale={[
        props.colIdx > 3 ? -0.25 : 0.25,
        props.rowIdx <= 3 ? -0.25 : 0.25,
        0,
      ]}
      rotation-x={intro ? introRotX : rotX}
      rotation-y={intro ? introRotY : rotY}
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
