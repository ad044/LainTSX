import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "drei";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import Hub from "../Hub";
import Lain, { LainIntro, LainStanding } from "../Lain/Lain";
import Lights from "../Lights";
import OrthoCamera from "../OrthoCamera/OrthoCamera";
import Preloader from "../Preloader";
import Starfield from "../Starfield/Starfield";
import * as THREE from "three";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { lainMoveStateAtom, lainMovingAtom } from "../Lain/LainAtom";
import { camPosYAtom, camRotYAtom } from "./CameraAtom";
import InputHandler from "../InputHandler";

const MainScene = () => {
  const setLainMoving = useSetRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  const [isIntro, setIsIntro] = useState(true);

  const camPosY = useRecoilValue(camPosYAtom);
  const camRotY = useRecoilValue(camRotYAtom);

  const [ambientLightVal, setAmbientLightVal] = useState(0.4);

  const cameraState = useSpring({
    camPosY: camPosY,
    camRotY: camRotY,
    config: { duration: 1200 },
  });

  const groupRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (isIntro) {
      if (groupRef.current) {
        if (groupRef.current!.rotation.x > 0) {
          if (groupRef.current!.position.z > -1) {
            groupRef.current!.rotation.x -= 0.015;
          } else {
            // if the position z is at a certain point speed up the rotation
            groupRef.current!.rotation.x -= 0.01;
          }
        }
        if (groupRef.current!.position.y > 0) {
          groupRef.current!.position.y -= 0.015;
        }

        if (groupRef.current!.position.z < 0) {
          groupRef.current!.position.z += 0.04;
        }

        // if the rotation hits this value that means that the intro is finished.
        // using a settimeout or something similar resulted in clunkiness, since it was dependant
        // on load times.
        if (
          parseFloat(groupRef.current!.rotation.x.toPrecision(2)) === -0.005
        ) {
          setLainMoving(false);
          setLainMoveState(<LainStanding />);

          setTimeout(() => {
            setIsIntro(false);
            setAmbientLightVal(1.0);
            document.getElementsByTagName("canvas")[0].className =
              "hub-background";
          }, 300);
        }
      }
    }
  });

  useEffect(() => {
    setLainMoving(true);
    setLainMoveState(<LainIntro />);
  }, [setLainMoveState, setLainMoving]);

  return (
    <a.perspectiveCamera
      position-z={3}
      position-y={cameraState.camPosY}
      rotation-y={cameraState.camRotY}
    >
      <Suspense fallback={null}>
        <group rotation={[2.3, 0, 0]} position={[0, 1.5, -7.5]} ref={groupRef}>
          <InputHandler />
          <Preloader />
          <Hub />
          <OrthoCamera orbVisibility={!isIntro} hudVisibility={!isIntro} />
          <Starfield introStarfieldVisible={isIntro} />
          <Lights ambientLightVal={ambientLightVal} />
          <OrbitControls />
        </group>
        <Lain />
      </Suspense>
    </a.perspectiveCamera>
  );
};
export default MainScene;
