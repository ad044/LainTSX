import React from "react";
import mainSceneBg from "../../../static/sprite/main_scene_background.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";

const MainSceneBackground = () => {
  const mainSceneBgTex = useLoader(THREE.TextureLoader, mainSceneBg);

  return (
    <mesh renderOrder={-5} scale={[5, 1, 0]}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial
        attach="material"
        map={mainSceneBgTex}
        depthTest={false}
      />
    </mesh>
  );
};

export default MainSceneBackground;
