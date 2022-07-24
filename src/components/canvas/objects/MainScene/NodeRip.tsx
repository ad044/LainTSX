import React, { useEffect, useMemo, useRef, useState } from "react";
import { randomBetween } from "@/utils/random";
import range from "@/utils/range";
import useCappedFrame from "@/hooks/useCappedFrame";
import { Vector3 } from "three";
import { Position, Rotation } from "@/types";
import { Color, useFrame } from "@react-three/fiber";
import {useTexture} from "@react-three/drei";

type TriangleNodeProps = {
  rotation: Rotation;
  pivotRotation: Rotation;
  shouldAnimate: boolean;
};

const TriangleNode = (props: TriangleNodeProps) => {
  const tex = useTexture("/sprites/nodes/MULTI.png");

  const triangleNodeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (triangleNodeRef.current && props.shouldAnimate) {
      triangleNodeRef.current.position.z += delta * 2.8;
    }
  });

  useEffect(() => {
    if (triangleNodeRef.current && !props.shouldAnimate) {
      triangleNodeRef.current.position.z = 0;
    }
  }, [props.shouldAnimate]);

  return (
    <group rotation={props.pivotRotation}>
      <mesh
        position={[-0.1, -0.3, 0.1]}
        rotation={props.rotation}
        scale={[0.1, 0.1, 0.1]}
        ref={triangleNodeRef}
      >
        <coneBufferGeometry attach="geometry" args={[1, 2, 3]} />
        <meshBasicMaterial map={tex} transparent={true} />
      </mesh>
    </group>
  );
};

type RipLineProps = {
  color: Color;
  endPoint: Position;
};

const RipLine = (props: RipLineProps) => {
  const points = useMemo(
    () => [new Vector3(0, 0, 0), new Vector3(...props.endPoint)],
    [props.endPoint]
  );

  const onUpdate = (geometry: THREE.BufferGeometry) => {
    geometry.setFromPoints(points);
  };

  return (
    <line>
      <bufferGeometry attach="geometry" onUpdate={onUpdate} />
      <lineBasicMaterial color={props.color} transparent={true} opacity={0.4} />
    </line>
  );
};

const NodeRip = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  useCappedFrame(() => {
    if (shouldAnimate && currentFrame < 3) {
      setCurrentFrame(currentFrame + 1);
    }
  }, 0.2);

  useEffect(() => {
    setTimeout(() => setShouldAnimate(true), 1150);
  }, []);

  return (
    <group visible={shouldAnimate}>
      <TriangleNode
        rotation={[1.3, 1.6, 0]}
        pivotRotation={[0, -Math.PI / 4 - 0.5, 0]}
        shouldAnimate={shouldAnimate}
      />
      <TriangleNode
        rotation={[0.4, 0.3, 0]}
        pivotRotation={[0, -Math.PI / 8, 0]}
        shouldAnimate={shouldAnimate}
      />
      <TriangleNode
        rotation={[1.6, 2.6, 0]}
        pivotRotation={[0, Math.PI / 4 + 0.5, 0]}
        shouldAnimate={shouldAnimate}
      />
      <TriangleNode
        rotation={[-0.7, 1.8, 0]}
        pivotRotation={[0, Math.PI / 8, 0]}
        shouldAnimate={shouldAnimate}
      />
      <group position={[-0.05, -0.3, 0.1]}>
        <group visible={currentFrame === 1}>
          {range(0, 25).map((i) => (
            <RipLine
              color={i % 2 === 0 ? 0xf5cc16 : 0xe33d00}
              endPoint={[
                randomBetween(-0.75, 0.75),
                randomBetween(-0.75, 0.75),
                0,
              ]}
              key={i}
            />
          ))}
        </group>

        <group visible={currentFrame === 2}>
          {range(0, 25).map((i) => (
            <RipLine
              color={i % 2 === 0 ? 0xf5cc16 : 0xe33d00}
              endPoint={[
                randomBetween(-0.75, 0.75),
                randomBetween(-0.75, 0.75),
                0,
              ]}
              key={i}
            />
          ))}
        </group>
      </group>
    </group>
  );
};

export default NodeRip;
