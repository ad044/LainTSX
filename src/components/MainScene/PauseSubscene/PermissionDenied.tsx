import React, { memo } from "react";
import headerContainer from "../../../static/sprite/prompt_question_container.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import StaticOrangeLetter from "../../TextRenderer/StaticOrangeLetter";

const PermissionDenied = memo(() => {
  const headerContainerTex = useLoader(THREE.TextureLoader, headerContainer);

  return (
    <>
      <sprite scale={[4.1, 0.3, 0]} renderOrder={200} position={[0, 0.2, 0]}>
        <spriteMaterial
          map={headerContainerTex}
          attach="material"
          transparent={true}
          opacity={0.6}
          depthTest={false}
        />
      </sprite>
      <group scale={[0.08, 0.7, 0]} position={[-1, 0.19, 0]}>
        {"Permission denied".split("").map((letter, idx) => (
          <StaticOrangeLetter
            color={"orange"}
            letter={letter}
            letterIdx={idx}
            scale={[1.5, 0.25, 0.25]}
            key={idx}
          />
        ))}
      </group>
    </>
  );
});

export default PermissionDenied;
