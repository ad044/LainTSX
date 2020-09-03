import React, { useRef, memo, useState } from "react";
import * as THREE from "three";
import { useUpdate, useThree, useFrame, useLoader } from "react-three-fiber";
import orbSprite from "../static/sprites/orb.png";

const curve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(1.2, 0, 0),
  new THREE.Vector3(0.5, -0.8, 0),
  new THREE.Vector3(-1.2, 1, 0)
);

const points = curve.getPoints(100);

let orbIdx = 0;

const Orb = memo(() => {
  const orbRef = useRef();
  const [orbDirection, setOrbDirection] = useState("left");
  const ref = useUpdate((geometry: any) => {
    geometry.setFromPoints(points);
  }, []);

  const orbSpriteTexture: any = useLoader(THREE.TextureLoader, orbSprite);

  useFrame(() => {
    var orbPos = curve.getPoint(orbIdx / 250);
    if (orbPos.x < -1.4) setOrbDirection("right");
    if (orbPos.x > 1.4) setOrbDirection("left");
    if (orbDirection === "left") {
      orbIdx++;
    } else {
      orbIdx--;
    }
    (orbRef.current as any).position.x = orbPos.x;
    (orbRef.current as any).position.y = orbPos.y;
  });
  return (
    <group position={[0, -0.1, -9]}>
      <sprite scale={[0.3, 0.3, 0.3]} ref={orbRef}>
        <spriteMaterial attach="material" map={orbSpriteTexture} />
      </sprite>
      {/* <line>
        <bufferGeometry attach="geometry" ref={ref} />
        <lineBasicMaterial
          attach="material"
          color="blue"
          linewidth={7}
          transparent={false}
        />
      </line> */}
    </group>
  );
});

export default Orb;
