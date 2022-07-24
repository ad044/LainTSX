import React, { useEffect, useRef } from "react";
import PolytanBear from "@canvas/objects/PolytanScene/PolytanBear";
import PolytanBackground from "@canvas/objects/PolytanScene/PolytanBackground";
import { handleEvent } from "@/core";
import { resetInputCooldown } from "@/core/events";
import TextRenderer from "../objects/TextRenderer/TextRenderer";
import useCappedFrame from "@/hooks/useCappedFrame";
import { TextType } from "@/types";

const PolytanScene = () => {
  useEffect(() => {
    setTimeout(() => handleEvent(resetInputCooldown), 1000);
  }, []);

  const pressAnyTextRef = useRef<THREE.Group>(null);

  useCappedFrame(() => {
    if (pressAnyTextRef.current) {
      pressAnyTextRef.current.visible = !pressAnyTextRef.current.visible;
    }
  }, 0.5);
  return (
    <>
      <PolytanBear />
      <PolytanBackground />
      <group ref={pressAnyTextRef} position={[-1.8, -2.5, 0]}>
        <TextRenderer
          type={TextType.MediumGreen}
          text={"press ANY button"}
          scale={[0.24, 0.32, 0]}
          renderOrder={100}
          depthTest={false}
        />
      </group>
    </>
  );
};

export default PolytanScene;
