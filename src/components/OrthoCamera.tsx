import React, {
  useState,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useFrame,
  Canvas,
  useLoader,
  useThree,
  useCamera,
  createPortal,
} from "react-three-fiber";
//import Orb from "./Orb";
import { OrthographicCamera, Octahedron } from "drei";
import { Matrix4, Scene } from "three";
import * as THREE from "three";
import longHud from "../static/sprites/long_hud.png";
import longHudBoring from "../static/sprites/long_hud_boring.png";
import bigHud from "../static/sprites/big_hud.png";

const OrthoCamera = () => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();

  useFrame(() => {
    gl.autoClear = false;
    gl.clear();
    gl.render(scene, camera);
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current!);
  }, 1);

  const longHudTexture: any = useLoader(THREE.TextureLoader, longHud);
  const longHudBoringTexture: any = useLoader(
    THREE.TextureLoader,
    longHudBoring
  );
  const bigHudTexture: any = useLoader(THREE.TextureLoader, bigHud);

  return (
    <OrthographicCamera
      ref={virtualCam}
      makeDefault={false}
      position={[0, 0, 10]}
    >
      <sprite position={[-0.45, 0.15, -8.6]} scale={[1, 0.03, 1]}>
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
        />
      </sprite>
      <sprite position={[0.48, 0.174, -8.6]} scale={[1, 0.03, 1]}>
        <spriteMaterial
          attach="material"
          map={longHudBoringTexture}
          transparent={true}
        />
      </sprite>
      <sprite position={[0.36, 0.13, -8.6]} scale={[0.5, 0.06, 1]}>
        <spriteMaterial
          attach="material"
          map={bigHudTexture}
          transparent={true}
        />
      </sprite>
    </OrthographicCamera>
  );
};

export default OrthoCamera;
