import React, { useMemo } from "react";
import * as THREE from "three";
import { useUpdate } from "react-three-fiber";

type RipLineProps = {
  color: string;
  endPoints: number[];
};

const RipLine = (props: RipLineProps) => {
  const points = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(props.endPoints[0], props.endPoints[1], 0),
    ],
    [props.endPoints]
  );

  const lineGeomRef = useUpdate((geometry: THREE.BufferGeometry) => {
    geometry.setFromPoints(points);
  }, []);

  return (
    <line>
      <bufferGeometry attach="geometry" ref={lineGeomRef} />
      <lineBasicMaterial
        attach="material"
        color={props.color === "yellow" ? "#f5cc16" : "#e33d00"}
        transparent={true}
        opacity={0.4}
      />
    </line>
  );
};

export default RipLine;
