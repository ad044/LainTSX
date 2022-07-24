import React, { memo, useMemo } from "react";

import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";
import { SaveStatus } from "@/types";

const SaveStatusDisplay = () => {
  const status = useStore((state) => state.saveStatus);

  const statusContainer = useTexture("/sprites/status/status_container.png");

  const loadSuccessful = useTexture("/sprites/status/load_successful.png");
  const loadFail = useTexture("/sprites/status/load_fail.png");
  const saveSuccessful = useTexture("/sprites/status/save_successful.png");

  const texture = useMemo(() => {
    switch (status) {
      case SaveStatus.SaveSuccessful:
        return saveSuccessful;
      case SaveStatus.LoadFailure:
        return loadFail;
      case SaveStatus.LoadSuccessful:
        return loadSuccessful;
    }
  }, [loadFail, loadSuccessful, saveSuccessful, status]);

  return (
    <group visible={status !== SaveStatus.None}>
      <sprite scale={[4, 0.3, 2]} renderOrder={200} position={[1, 0.2, 0]}>
        <spriteMaterial map={statusContainer} depthTest={false} />
      </sprite>
      <sprite scale={[2, 0.17, 2]} renderOrder={200} position={[1, 0.2, 0]}>
        <spriteMaterial map={texture} depthTest={false} />
      </sprite>
    </group>
  );
};

export default memo(SaveStatusDisplay);
