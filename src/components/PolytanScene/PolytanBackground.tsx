import React, { useEffect, useMemo, useRef } from "react";
import header from "../../static/sprite/polytan_header.png";
import background from "../../static/sprite/polytan_background.png";
import leftArmHud from "../../static/sprite/poly_larm_hud.png";
import rightArmHud from "../../static/sprite/poly_rarm_hud.png";
import rightLegHud from "../../static/sprite/poly_rleg_hud.png";
import leftLegHud from "../../static/sprite/poly_lleg_hud.png";
import headHud from "../../static/sprite/poly_head_hud.png";
import bodyHud from "../../static/sprite/poly_body_hud.png";

import { useLoader } from "react-three-fiber";
import * as THREE from "three";

const PolytanBackground = () => {
  const headerTex = useLoader(THREE.TextureLoader, header);
  const backgroundTex = useLoader(THREE.TextureLoader, background);
  const leftArmHudTex = useLoader(THREE.TextureLoader, leftArmHud);
  const rightArmHudTex = useLoader(THREE.TextureLoader, rightArmHud);
  const rightLegHudTex = useLoader(THREE.TextureLoader, rightLegHud);
  const leftLegHudTex = useLoader(THREE.TextureLoader, leftLegHud);
  const headHudTex = useLoader(THREE.TextureLoader, headHud);
  const bodyHudTex = useLoader(THREE.TextureLoader, bodyHud);

  const wordFont = useLoader(THREE.FontLoader, "/3d_fonts/MediaWord.blob");

  const config = useMemo(
    () => ({
      font: wordFont,
      size: 2.5,
    }),
    [wordFont]
  );

  const pressAnyRef = useRef<THREE.Object3D>();

  useEffect(() => {
    setInterval(() => {
      if (pressAnyRef.current) {
        pressAnyRef.current.visible = !pressAnyRef.current.visible;
      }
    }, 500);
  }, []);

  return (
    <>
      <sprite scale={[4, 4, 0]} position={[3.5, 2, 0]} renderOrder={-1}>
        <spriteMaterial attach="material" map={headerTex} />
      </sprite>
      <sprite scale={[4, 4, 0]} position={[-3.5, -2, 0]} renderOrder={-1}>
        <spriteMaterial attach="material" map={backgroundTex} />
      </sprite>
      <sprite scale={[3.5, 1, 0]} position={[2.8, 0.5, 0]} renderOrder={2}>
        <spriteMaterial attach="material" map={leftArmHudTex} />
      </sprite>
      <sprite scale={[3.5, 1.5, 0]} position={[-3, -0.8, 0]} renderOrder={2}>
        <spriteMaterial attach="material" map={rightArmHudTex} />
      </sprite>
      <sprite scale={[3.5, 1.5, 0]} position={[2.4, -1.4, 0]} renderOrder={2}>
        <spriteMaterial attach="material" map={leftLegHudTex} />
      </sprite>
      <sprite scale={[3, 0.8, 0]} position={[-3, -2.8, 0]} renderOrder={2}>
        <spriteMaterial attach="material" map={rightLegHudTex} />
      </sprite>
      <sprite scale={[3.4, 1, 0]} position={[-1.5, 2.3, 0]} renderOrder={2}>
        <spriteMaterial attach="material" map={headHudTex} />
      </sprite>
      <sprite scale={[3.4, 1, 0]} position={[1.5, -2.2, 0]} renderOrder={2}>
        <spriteMaterial attach="material" map={bodyHudTex} />
      </sprite>

      <group ref={pressAnyRef} visible={false} position={[-1.2, -1.8, 0]}>
        <mesh
          scale={[0.17, 0.14, 0]}
          position={[-0.8, -1.3, 0]}
          renderOrder={5}
        >
          <textGeometry attach="geometry" args={["press ANY button", config]} />
          <meshBasicMaterial
            attach="material"
            color={0x00ba7c}
            transparent={true}
            depthTest={false}
          />
        </mesh>
        <mesh
          scale={[0.17, 0.14, 0]}
          position={[-0.793, -1.308, 0]}
          renderOrder={4}
        >
          <textGeometry attach="geometry" args={["press ANY button", config]} />
          <meshBasicMaterial
            attach="material"
            color={0x000000}
            transparent={true}
            depthTest={false}
          />
        </mesh>
      </group>
    </>
  );
};

export default PolytanBackground;
