import React, { useCallback } from "react";
import SSknIcon from "../components/SSknScene/SSknIcon";
import SSknBackground from "../components/SSknScene/SSknBackground";
import SSknHUD from "../components/SSknScene/SSknHUD";
import { useStore } from "../store";
import SSknSceneManager from "../core/StateManagers/SSknSceneManager";

const SSknScene = () => {
  const activeSSknComponent = useStore(
    useCallback(
      (state) => state.ssknComponentMatrix[state.ssknComponentMatrixIdx],
      []
    )
  );

  const loading = useStore((state) => state.ssknLoading);

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
