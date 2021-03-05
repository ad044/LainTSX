import React, { useEffect } from "react";
import SsknIcon from "../components/SsknScene/SsknIcon";
import SsknBackground from "../components/SsknScene/SsknBackground";
import SsknHUD from "../components/SsknScene/SsknHUD";
import { useStore } from "../store";

const SsknScene = () => {
  const setInputCooldown = useStore((state) => state.setInputCooldown);

  useEffect(() => {
    setTimeout(() => setInputCooldown(0), 500);
  }, [setInputCooldown]);

  return (
    <>
      <SsknBackground />
      <SsknIcon />
      <SsknHUD />
    </>
  );
};

export default SsknScene;
