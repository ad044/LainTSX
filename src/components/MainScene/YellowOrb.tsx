import React, { memo, useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import orbSprite from "../../static/sprites/main/orb.png";
import { useStore } from "../../store";

type YellowOrbProps = {
  visible: boolean;
};

const YellowOrb = memo((props: YellowOrbProps) => {
  const idleStarting = useStore((state) => state.idleStarting);
  // ref for the object itself
  const orbRef = useRef<THREE.Object3D>(new THREE.Mesh());
  // position on the curve
  const idxRef = useRef(0);
  // how many times the orb changed direction
  const directionChangeCountRef = useRef(0);
  // current direction - left or right (0/1)
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

  const bigOrbScale = useMemo(() => new THREE.Vector3(2, 2, 2), []);

  const deltaRef = useRef(0);
  useFrame((state, delta) => {
    deltaRef.current += delta;
    if (deltaRef.current > 0.016 && props.visible) {
      const orbPosFirst = curves[0].getPoint(idxRef.current / 250);
      const orbPosSecond = curves[1].getPoint(idxRef.current / 250);

      if (orbPosFirst.x < -1.4) {
        if (curveIdxRef.current === 0) orbRef.current.renderOrder = 0;
        directionRef.current = Number(!curveIdxRef.current);
        directionChangeCountRef.current++;
      }

      if (orbPosFirst.x > 1.4) {
        if (curveIdxRef.current === 1) orbRef.current.renderOrder = -1;
        directionRef.current = curveIdxRef.current;
        directionChangeCountRef.current++;
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
        directionChangeCountRef.current % 3 === 0 &&
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

      if (idleStarting) {
        orbRef.current.scale.lerp(bigOrbScale, 0.01);
        orbRef.current.position.x = THREE.MathUtils.lerp(
          orbRef.current.position.x,
          0,
          0.01
        );
        orbRef.current.position.y = THREE.MathUtils.lerp(
          orbRef.current.position.y,
          0,
          0.01
        );
      } else {
        if (curveIdxRef.current === 0) {
          orbRef.current.position.x = orbPosFirst.x;
          orbRef.current.position.y = orbPosFirst.y;
        } else {
          orbRef.current.position.x = orbPosSecond.x;
          orbRef.current.position.y = orbPosSecond.y;
        }
      }
      deltaRef.current = deltaRef.current % 0.016;
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
