import React, { createRef, memo, RefObject, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { useSpring, a } from "@react-spring/three";
import { useRecoilValue } from "recoil";
import { grayPlanesPosYAtom, grayPlanesVisibleAtom } from "./GrayPlanesAtom";

const GrayPlanes = memo(() => {
  const grayPlaneGroupRef = useRef<THREE.Object3D>();

  const grayPlanePosY = useRecoilValue(grayPlanesPosYAtom);
  const grayPlanesVisible = useRecoilValue(grayPlanesVisibleAtom);

  const grayPlanePoses = [
    [1.2, 0, -1.2],
    [1.2, 0, 1.2],
    [1.2, 0, -0.5],
    [-1.2, 0, -1.2],
    [-1.2, 0, 1.2],
    [-1.2, 0, 1],
    [0.5, 0, 1],
  ];

  const grayPlaneRefs = grayPlanePoses.map((poses: number[]) =>
    useRef<RefObject<THREE.Object3D>[]>(
      poses.map(() => createRef<THREE.Object3D>())
    )
  );

  useFrame(() => {
    grayPlaneGroupRef.current!.rotation.y -= 0.01;
    grayPlaneRefs.forEach((ref: any) => (ref.current!.rotation.y += 0.03));
  });

  const grayPlaneState = useSpring({
    grayPlanePosY: grayPlanePosY,
    config: { duration: 1200 },
  });

  return (
    <a.group
      position={[0.1, 0, -2]}
      position-y={grayPlaneState.grayPlanePosY}
      rotation={[0, 0, 0]}
      ref={grayPlaneGroupRef}
      visible={grayPlanesVisible}
    >
      {grayPlaneRefs.map((ref, idx: number) => {
        return (
          <mesh
            scale={[0.04, 10, 0.04]}
            position={grayPlanePoses[idx] as [number, number, number]}
            ref={ref}
          >
            <planeBufferGeometry attach="geometry" />
            <meshBasicMaterial
              attach="material"
              color={0xd3d3d3}
              opacity={0.2}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </a.group>
  );
});

export default GrayPlanes;
