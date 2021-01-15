import React, { useCallback } from "react";
import SSknIcon from "../components/SSknScene/SSknIcon";
import SSknBackground from "../components/SSknScene/SSknBackground";
import SSknHUD from "../components/SSknScene/SSknHUD";
import { useMediaStore, useSSknStore } from "../store";
import SSknSceneManager from "../core/StateManagers/SSknSceneManager";

const SSknScene = () => {
  const ssknComponentMatrixIdx = useSSknStore(
    (state) => state.componentMatrixIdx
  );
  const activeSSknComponent = useSSknStore(
    useCallback((state) => state.componentMatrix[ssknComponentMatrixIdx], [
      ssknComponentMatrixIdx,
    ])
  );

  const loading = useSSknStore((state) => state.loading);

  return (
    <>
      <SSknBackground />
      <SSknIcon />
      <SSknHUD activeSSknComponent={activeSSknComponent} loading={loading} />
      <SSknSceneManager />
    </>
  );
};

export default SSknScene;
