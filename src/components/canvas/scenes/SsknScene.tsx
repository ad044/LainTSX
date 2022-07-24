import React, { useEffect } from "react";
import SsknIcon from "@canvas/objects/SsknScene/SsknIcon";
import SsknBackground from "@canvas/objects/SsknScene/SsknBackground";
import SsknHUD from "@canvas/objects/SsknScene/SsknHUD";
import {resetInputCooldown} from "@/core/events";
import {handleEvent} from "@/core";

const SsknScene = () => {
  useEffect(() => {
    setTimeout(() => handleEvent(resetInputCooldown), 500);
  }, []);

  return (
    <>
      <SsknBackground />
      <SsknIcon />
      <SsknHUD />
    </>
  );
};

export default SsknScene;
