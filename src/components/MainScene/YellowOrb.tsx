import React, { memo, useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import orbSprite from "../../static/sprite/orb.png";

type YellowOrbProps = {
  visible: boolean;
};

const YellowOrb = memo((props: YellowOrbProps) => {
  const orbRef = useRef<THREE.Object3D>();
  const idxRef = useRef(0);
  const directionChangeCountRef = useRef(0);
  // left or right (0/1)
  const directionRef = useRef(0);
  // first curve and second curve (0/1)
  const curveIdxRef = useRef(0);

  const orbSpriteTexture = useLoader(THREE.TextureLoader, orbSprite);

  // first one goes from up to down left to right
  // second one goes from down to up left to right
  const curves = useMemo(
    () => [
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(1.2, 0, 0),
        new THREE.Vector3(0.5, -0.8, 0),
        new THREE.Vector3(-1.2, 1, 0)
      ),
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.2, -0.8, 0),
        new THREE.Vector3(-0.5, -0.1, 0),
        new THREE.Vector3(1.2, 0.8, 0)
      ),
    ],
    []
  );

  useFrame(() => {
    if (props.visible) {
      const orbPosFirst = curves[0].getPoint(idxRef.current / 250);
      const orbPosSecond = curves[1].getPoint(idxRef.current / 250);

      if (orbPosFirst.x < -1.4) {
        if (curveIdxRef.current === 0) {
          directionRef.current = 1;
          if (orbRef.current) orbRef.current.renderOrder = 0;
        } else {
          directionRef.current = 0;
        }
        if (directionChangeCountRef.current) directionChangeCountRef.current++;
      }

      if (orbPosFirst.x > 1.4) {
        if (curveIdxRef.current === 0) {
          directionRef.current = 0;
        } else {
          directionRef.current = 1;

          if (orbRef.current) orbRef.current.renderOrder = -1;
        }
        if (directionChangeCountRef.current) directionChangeCountRef.current++;
      }

      if (directionRef.current === 0) {
        if (curveIdxRef.current === 0) {
          idxRef.current++;
        } else {
          idxRef.current--;
        }
      } else {
        if (curveIdxRef.current === 0) {
          idxRef.current--;
        } else {
          idxRef.current++;
        }
      }

      if (
        directionChangeCountRef.current % 6 === 0 &&
        directionChangeCountRef.current !== 0
      ) {
        directionChangeCountRef.current = 0;
        if (curveIdxRef.current === 0) {
          idxRef.current = 250;
          curveIdxRef.current = 1;
        } else {
          idxRef.current = 0;
          curveIdxRef.current = 0;
        }
        directionRef.current = 0;
      }

      if (orbRef.current) {
        if (curveIdxRef.current === 0) {
          orbRef.current.position.x = orbPosFirst.x;
          orbRef.current.position.y = orbPosFirst.y;
        } else {
          orbRef.current.position.x = orbPosSecond.x;
          orbRef.current.position.y = orbPosSecond.y;
        }
      }
    }
  });

  return (
    <group position={[0, -0.1, 1]}>
      <sprite scale={[0.5, 0.5, 0.5]} ref={orbRef}>
        <spriteMaterial
          attach="material"
          map={orbSpriteTexture}
          depthTest={false}
          transparent={true}
        />
      </sprite>
    </group>
  );
});

export default YellowOrb;
