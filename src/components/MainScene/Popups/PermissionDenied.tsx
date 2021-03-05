import React, { memo } from "react";
import headerContainer from "../../../static/sprites/prompt/prompt_question_container.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import StaticOrangeLetter from "../../TextRenderer/StaticOrangeLetter";
import { useStore } from "../../../store";

const PermissionDenied = memo(() => {
  const headerContainerTex = useLoader(THREE.TextureLoader, headerContainer);

  const permissionDenied = useStore((state) => state.permissionDenied);

  return (
    <group position={[0, 0.5, 0]} visible={permissionDenied}>
      <sprite scale={[5, 0.36, 0]} renderOrder={200} position={[1, 0.2, 0]}>
        <spriteMaterial
          map={headerContainerTex}
          attach="material"
          transparent={true}
          opacity={0.6}
          depthTest={false}
        />
      </sprite>
      <group scale={[0.08, 0.7, 0]} position={[0, 0.19, 0]}>
        {"Permission denied".split("").map((letter, idx) => (
          <StaticOrangeLetter letter={letter} letterIdx={idx} key={idx} />
        ))}
      </group>
    </group>
  );
});

export default PermissionDenied;
