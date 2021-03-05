import React from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import mainCylinder from "../../static/sprites/end/end_cylinder_1.png";

const EndCylinder = () => {
  const mainCylinderTex = useLoader(THREE.TextureLoader, mainCylinder);

  return (
    <>
      <mesh position={[0, 2.5, 0]} renderOrder={4}>
        <cylinderBufferGeometry
          args={[1.5, 2, 1.5, 64, 64, true]}
          attach="geometry"
        />
        <meshStandardMaterial
          attach="material"
          map={mainCylinderTex}
          color={0xffffff}
          transparent={true}
          side={THREE.DoubleSide}
          depthTest={false}
        />
      </mesh>

      <mesh position={[0, 0.8, 0]} renderOrder={4}>
        <cylinderBufferGeometry
          args={[2, 2, 1.2, 64, 64, true]}
          attach="geometry"
        />
        <meshStandardMaterial
          attach="material"
          map={mainCylinderTex}
          color={0xffffff}
          transparent={true}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, -0.9, 0]} renderOrder={4}>
        <cylinderBufferGeometry
          args={[2, 1.5, 1.5, 64, 64, true]}
          attach="geometry"
        />
        <meshStandardMaterial
          attach="material"
          map={mainCylinderTex}
          color={0xffffff}
          transparent={true}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default EndCylinder;
