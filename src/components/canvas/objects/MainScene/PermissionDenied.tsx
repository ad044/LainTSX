import React, { memo } from "react";
import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";
import TextRenderer from "../TextRenderer/TextRenderer";
import { TextType } from "@/types";

const PermissionDenied = () => {
  const headerContainer = useTexture(
    "/sprites/prompt/prompt_question_container.png"
  );

  const permissionDenied = useStore((state) => state.permissionDenied);

  return (
    <group position={[0, 0.5, 0]} visible={permissionDenied}>
      <sprite scale={[5, 0.36, 0]} renderOrder={200} position={[1, 0.2, 0]}>
        <spriteMaterial
          map={headerContainer}
          transparent={true}
          opacity={0.6}
          depthTest={false}
        />
      </sprite>
      <group scale={[0.08, 0.7, 0]} position={[0, 0.19, 0]}>
        <TextRenderer
          renderOrder={2000}
          depthTest={false}
          type={TextType.BigOrange}
          text={"Permission denied"}
          scale={[1.5, 0.3, 1]}
        />
      </group>
    </group>
  );
};

export default memo(PermissionDenied);
