import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import GrayPlane from "./GrayPlanes/GrayPlane";

const GrayPlanes = () => {
  const grayPlaneGroupRef = useRef<THREE.Object3D>();

  const grayPlanesGeom = useMemo(() => {
    const singleGeom = new THREE.Geometry();

    const grayPlanePoses = [
      [1.2, 0, -1.2],
      [1.2, 0, 1.2],
      [1.2, 0, -0.5],
      [-1.2, 0, -1.2],
      [-1.2, 0, 1.2],
      [-1.2, 0, 1],
      [0.5, 0, 1],
    ];

    for (let i = 0; i < grayPlanePoses.length; i++) {
      const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry());
      mesh.position.set(
        grayPlanePoses[i][0],
        grayPlanePoses[i][1],
        grayPlanePoses[i][2]
      );
    }

    return singleGeom;
  }, []);

  const grayPlanePoses = useMemo(
    () => [
      [1.2, 0, -1.2],
      [1.2, 0, 1.2],
      [1.2, 0, -0.5],
      [-1.2, 0, -1.2],
      [-1.2, 0, 1.2],
      [-1.2, 0, 1],
      [0.5, 0, 1],
    ],
    []
  );

  useFrame(() => {
    grayPlaneGroupRef.current!.rotation.y -= 0.01;
  });

  return (
    <group position={[0.1, 0, -2]} ref={grayPlaneGroupRef}>
      {grayPlanePoses.map((pos, idx: number) => (
        <GrayPlane position={pos as [number, number, number]} key={idx} />
      ))}
      {/*<mesh geometry={grayPlanesGeom}>*/}
      {/*  <meshBasicMaterial*/}
      {/*    attach="material"*/}
      {/*    color={0xd3d3d3}*/}
      {/*    opacity={0.2}*/}
      {/*    transparent={true}*/}
      {/*    side={THREE.DoubleSide}*/}
      {/*  />*/}
      {/*</mesh>*/}
    </group>
  );
};

export default GrayPlanes;
