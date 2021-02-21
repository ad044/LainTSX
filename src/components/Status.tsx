import React, { memo } from "react";
import statusContainer from "../static/sprite/status_container.png";
import loadSuccessfulImg from "../static/sprite/load_successful.png";
import loadFailImg from "../static/sprite/load_fail.png";
import saveSuccessfulImg from "../static/sprite/save_successful.png";

import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../store";

const Status = memo(() => {
  const loadSuccessful = useStore((state) => state.loadSuccessful);
  const saveSuccessful = useStore((state) => state.saveSuccessful);

  const statusContainerTex = useLoader(THREE.TextureLoader, statusContainer);
  const loadSuccessfulTex = useLoader(THREE.TextureLoader, loadSuccessfulImg);
  const loadFailTex = useLoader(THREE.TextureLoader, loadFailImg);
  const saveSuccessfulTex = useLoader(THREE.TextureLoader, saveSuccessfulImg);

  return (
    <group
      visible={loadSuccessful !== undefined || saveSuccessful !== undefined}
    >
      <sprite scale={[4, 0.3, 2]} renderOrder={200} position={[1, 0.2, 0]}>
        <spriteMaterial
          map={statusContainerTex}
          attach="material"
          depthTest={false}
        />
      </sprite>
      <sprite
        scale={[2, 0.17, 2]}
        renderOrder={200}
        position={[1, 0.2, 0]}
        visible={saveSuccessful === true}
      >
        <spriteMaterial
          map={saveSuccessfulTex}
          attach="material"
          depthTest={false}
        />
      </sprite>
      <sprite
        scale={[2, 0.17, 2]}
        renderOrder={200}
        position={[1, 0.2, 0]}
        visible={loadSuccessful === true}
      >
        <spriteMaterial
          map={loadSuccessfulTex}
          attach="material"
          depthTest={false}
        />
      </sprite>
      <sprite
        scale={[2, 0.17, 2]}
        renderOrder={200}
        position={[1, 0.2, 0]}
        visible={loadSuccessful === false}
      >
        <spriteMaterial map={loadFailTex} attach="material" depthTest={false} />
      </sprite>
    </group>
  );
});

export default Status;
