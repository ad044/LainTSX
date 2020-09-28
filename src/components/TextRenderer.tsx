import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import orangeFont from "../static/sprites/orange_font_texture.png";
import orange_font_json from "../resources/orange_font.json";
import React from "react";

const TextRenderer = () => {
  const orangeFontTexture: THREE.Texture = useLoader(
    THREE.TextureLoader,
    orangeFont
  );

  return (
    <group position={[0, 0, -9]}>
      <sprite>
        <spriteMaterial attach="material" map={orangeFontTexture} />
      </sprite>
    </group>
  );
};

export default TextRenderer;
