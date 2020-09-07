import React, { memo, useRef, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import orbSprite from "../static/sprites/orb.png";

// initialize outside the component otherwise it gets overwritten when it rerenders
let orbIdx = 0;
let orbDirectionChangeCount = 0;

type OrbProps = {
  orbVisibility: boolean;
};

const Orb = memo((props: OrbProps) => {
  const orbRef = useRef();
  const [orbDirection, setOrbDirection] = useState("left");
  const [currentCurve, setCurrentCurve] = useState("first");

  const orbSpriteTexture: any = useLoader(THREE.TextureLoader, orbSprite);

  // first one goes from up to down left to right
  const firstCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(1.2, 0, 0),
    new THREE.Vector3(0.5, -0.8, 0),
    new THREE.Vector3(-1.2, 1, 0)
  );

  // second one goes from down to up left to right
  const secondCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-1.2, -0.8, 0),
    new THREE.Vector3(-0.5, -0.1, 0),
    new THREE.Vector3(1.2, 0.8, 0)
  );

  useFrame(() => {
    if (props.orbVisibility) {
      let orbPosFirst = firstCurve.getPoint(orbIdx / 250);
      let orbPosSecond = secondCurve.getPoint(orbIdx / 250);

      if (orbPosFirst.x < -1.4) {
        switch (currentCurve) {
          case "first":
            setOrbDirection("right");
            break;
          case "second":
            setOrbDirection("left");
            break;
        }
        orbDirectionChangeCount++;
      }

      if (orbPosFirst.x > 1.4) {
        switch (currentCurve) {
          case "first":
            setOrbDirection("left");
            break;
          case "second":
            setOrbDirection("right");
            break;
        }
        orbDirectionChangeCount++;
      }

      if (orbDirection === "left") {
        switch (currentCurve) {
          case "first":
            orbIdx++;
            break;
          case "second":
            orbIdx--;
            break;
        }
      } else {
        switch (currentCurve) {
          case "first":
            orbIdx--;
            break;
          case "second":
            orbIdx++;
            break;
        }
      }

      if (orbDirectionChangeCount % 6 === 0 && orbDirectionChangeCount !== 0) {
        orbDirectionChangeCount = 0;
        switch (currentCurve) {
          case "first":
            orbIdx = 250;
            setCurrentCurve("second");
            break;
          case "second":
            orbIdx = 0;
            setCurrentCurve("first");
            break;
        }
        setOrbDirection("left");
      }

      if (currentCurve === "first") {
        (orbRef.current as any).position.x = orbPosFirst.x;
        (orbRef.current as any).position.y = orbPosFirst.y;
      } else {
        (orbRef.current as any).position.x = orbPosSecond.x;
        (orbRef.current as any).position.y = orbPosSecond.y;
      }
    }
  });

  return (
    <group position={[0, -0.1, -9]} visible={props.orbVisibility}>
      <sprite scale={[0.5, 0.5, 0.5]} ref={orbRef}>
        <spriteMaterial attach="material" map={orbSpriteTexture} />
      </sprite>
    </group>
  );
});

export default Orb;
