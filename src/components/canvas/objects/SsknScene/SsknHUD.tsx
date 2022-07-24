import React, { memo, useState } from "react";
import SsknProgressBar from "@canvas/objects/ProgressBar";
import { useStore } from "@/store";
import { SsknComponent } from "@/types";
import { useTexture } from "@react-three/drei";
import useCappedFrame from "@/hooks/useCappedFrame";

const SsknHUD = () => {
  const ok = useTexture("/sprites/sskn/sskn_ok.png");
  const okInactive = useTexture("/sprites/sskn/sskn_ok_inactive.png");
  const cancel = useTexture("/sprites/sskn/sskn_cancel.png");
  const cancelInactive = useTexture("/sprites/sskn/sskn_cancel_inactive.png");
  const upgrade = useTexture("/sprites/sskn/sskn_upgrade.png");
  const arrow = useTexture("/sprites/sskn/sskn_arrow.png");
  const textWrapper = useTexture("/sprites/sskn/sskn_text_wrapper.png");
  const textWrapperInactive = useTexture(
    "/sprites/sskn/sskn_text_wrapper_inactive.png"
  );
  const loadingContainer = useTexture("/sprites/sskn/sskn_progress_bar.png");
  const line = useTexture("/sprites/sskn/sskn_line.png");

  const activeComponent = useStore((state) => state.ssknComponent);

  const loading = useStore((state) => state.ssknLoading);

  const [loadProgress, setLoadProgress] = useState(0);

  useCappedFrame(() => {
    if (loading) {
      setLoadProgress((prev) => prev + 1);
    }
  }, 0.26);

  return (
    <>
      {loading ? (
        <>
          <sprite scale={[5.5, 0.3, 0]} position={[2, -2.7, 0]} renderOrder={4}>
            <spriteMaterial map={loadingContainer} />
          </sprite>
          <group position={[-0.5, -2.68, 0]}>
            <SsknProgressBar progress={loadProgress} />
          </group>
        </>
      ) : (
        <group>
          <sprite position={[2.8, -2, 0]} scale={[1, 0.5, 0]}>
            <spriteMaterial
              map={activeComponent === SsknComponent.Ok ? ok : okInactive}
            />
          </sprite>
          <sprite position={[3.3, -3, 0]} scale={[2, 0.5, 0]}>
            <spriteMaterial
              map={
                activeComponent === SsknComponent.Cancel
                  ? cancel
                  : cancelInactive
              }
            />
          </sprite>
          <sprite position={[3.3, -2.15, 0]} scale={[3, 0.4, 0]}>
            <spriteMaterial
              map={
                activeComponent === SsknComponent.Ok
                  ? textWrapper
                  : textWrapperInactive
              }
            />
          </sprite>
          <sprite position={[3.3, -3.15, 0]} scale={[3, 0.4, 0]}>
            <spriteMaterial
              map={
                activeComponent === SsknComponent.Cancel
                  ? textWrapper
                  : textWrapperInactive
              }
            />
          </sprite>
          <sprite
            position={[0.2, -2.7, 0]}
            scale={[2.2, 0.3, 0]}
            renderOrder={4}
          >
            <spriteMaterial map={arrow} />
          </sprite>
          <sprite
            position={[-4.65, -2.7, 0]}
            scale={[1, 0.03, 0]}
            renderOrder={4}
          >
            <spriteMaterial map={line} />
          </sprite>
        </group>
      )}
      <sprite position={[-2.5, -2.7, 0]} scale={[2.9, 0.7, 0]} renderOrder={4}>
        <spriteMaterial map={upgrade} />
      </sprite>
    </>
  );
};

export default memo(SsknHUD);
