import React, { memo } from "react";
import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";

const EndCylinder = () => {
  const mainCylinder = useTexture("/sprites/end/end_cylinder_1.png");

  return (
    <>
      <mesh position={[0, 2.5, 0]} renderOrder={4}>
        <cylinderBufferGeometry
          args={[1.5, 2, 1.5, 64, 64, true]}
          attach="geometry"
        />
        <meshStandardMaterial
          map={mainCylinder}
          color={0xffffff}
          transparent={true}
          side={DoubleSide}
          depthTest={false}
        />
      </mesh>

      <mesh position={[0, 0.8, 0]} renderOrder={4}>
        <cylinderBufferGeometry
          args={[2, 2, 1.2, 64, 64, true]}
          attach="geometry"
        />
        <meshStandardMaterial
          map={mainCylinder}
          color={0xffffff}
          transparent={true}
          depthTest={false}
          side={DoubleSide}
        />
      </mesh>

      <mesh position={[0, -0.9, 0]} renderOrder={4}>
        <cylinderBufferGeometry
          args={[2, 1.5, 1.5, 64, 64, true]}
          attach="geometry"
        />
        <meshStandardMaterial
          map={mainCylinder}
          color={0xffffff}
          transparent={true}
          depthTest={false}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};

export default memo(EndCylinder);
