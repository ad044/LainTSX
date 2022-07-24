import React, { memo, useMemo, useRef } from "react";
import { Vector3, QuadraticBezierCurve3, MathUtils } from "three";
import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Direction } from "@/types";

type YellowOrbProps = {
  visible: boolean;
};

const YellowOrb = (props: YellowOrbProps) => {
  const texture = useTexture("/sprites/main/orb.png");

  const idleStarting = useStore((state) => state.idleStarting);
  // ref for the object itself
  const orbRef = useRef<THREE.Sprite>(null);
  // position on the curve
  const idxRef = useRef(0);
  // how many times the orb changed direction
  const directionChangeCountRef = useRef(0);
  // current direction - left or right
  const directionRef = useRef<Direction>(Direction.Left);

  // first curve or second curve (0/1)
  // first one goes from up to down left to right
  // second one goes from down to up left to right
  const curveRef = useRef<0 | 1>(0);
  const curves = useMemo(
    () => [
      new QuadraticBezierCurve3(
        new Vector3(1.2, 0, 0),
        new Vector3(0.5, -0.8, 0),
        new Vector3(-1.2, 1, 0)
      ),
      new QuadraticBezierCurve3(
        new Vector3(-1.2, -0.8, 0),
        new Vector3(-0.5, -0.1, 0),
        new Vector3(1.2, 0.8, 0)
      ),
    ],
    []
  );

  const bigOrbScale = useMemo(() => new Vector3(2, 2, 2), []);

  useFrame(() => {
    if (props.visible && orbRef.current) {
      if (idxRef.current >= 265) {
        if (curveRef.current === 0) {
          orbRef.current.renderOrder = 0;
        }
        directionRef.current =
          curveRef.current === 0 ? Direction.Right : Direction.Left;
        directionChangeCountRef.current++;
      }

      if (idxRef.current <= -41) {
        if (curveRef.current === 1) {
          orbRef.current.renderOrder = -1;
        }
        directionRef.current =
          curveRef.current === 0 ? Direction.Left : Direction.Right;
        directionChangeCountRef.current++;
      }

      if (directionRef.current === 0) {
        if (curveRef.current === 0) {
          idxRef.current++;
        } else {
          idxRef.current--;
        }
      } else {
        if (curveRef.current === 0) {
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
        if (curveRef.current === 0) {
          idxRef.current = 250;
          curveRef.current = 1;
        } else {
          idxRef.current = 0;
          curveRef.current = 0;
        }
        directionRef.current = 0;
      }

      if (idleStarting) {
        orbRef.current.scale.lerp(bigOrbScale, 0.01);
        orbRef.current.position.x = MathUtils.lerp(
          orbRef.current.position.x,
          0,
          0.01
        );
        orbRef.current.position.y = MathUtils.lerp(
          orbRef.current.position.y,
          0,
          0.01
        );
      } else {
        const curve = curveRef.current;
        const { x, y } = curves[curve].getPoint(idxRef.current / 250);
        orbRef.current.position.x = x;
        orbRef.current.position.y = y;
      }
    }
  });

  return (
    <group position={[0, -0.1, 1]}>
      <sprite scale={[0.5, 0.5, 0.5]} ref={orbRef}>
        <spriteMaterial map={texture} depthTest={false} transparent={true} />
      </sprite>
    </group>
  );
};

export default memo(YellowOrb);
