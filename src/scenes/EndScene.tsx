import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import EndCylinder from "../components/EndScene/EndCylinder";
import EndSphere from "../components/EndScene/EndSphere";
import LainSpeak from "../components/LainSpeak";

const EndScene = () => {
  const mainCylinderRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (mainCylinderRef.current) {
      mainCylinderRef.current.rotation.y -= 0.01;
    }
  });

  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);

  return (
    <>
      <pointLight position={[0, 0, 5]} intensity={0.9} />
      <pointLight position={[0, 0, -5]} intensity={0.9} />

      <group ref={mainCylinderRef} position={[0, -1, 2.2]}>
        <EndCylinder />
      </group>
      <EndSphere position={[-1.8, -1.6, 1.4]} />
      <EndSphere position={[1.8, -0.5, 0]} />
      <EndSphere position={[2, -1.7, 1]} />
      <EndSphere position={[-1.6, 1.4, 1.5]} />
      <EndSphere position={[2, 1.7, -0.5]} />
      <LainSpeak intro={isIntro} outro={isOutro} />
    </>
  );
};

export default EndScene;
