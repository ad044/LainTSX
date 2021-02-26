import React, { memo } from "react";
import ssknOk from "../../static/sprites/sskn/sskn_ok.png";
import ssknOkInactive from "../../static/sprites/sskn/sskn_ok_inactive.png";
import ssknCancel from "../../static/sprites/sskn/sskn_cancel.png";
import ssknCancelInactive from "../../static/sprites/sskn/sskn_cancel_inactive.png";
import ssknUpgrade from "../../static/sprites/sskn/sskn_upgrade.png";
import ssknArrow from "../../static/sprites/sskn/sskn_arrow.png";
import ssknTextWrapper from "../../static/sprites/sskn/sskn_text_wrapper.png";
import ssknTextWrapperInactive from "../../static/sprites/sskn/sskn_text_wrapper_inactive.png";
import ssknLine from "../../static/sprites/sskn/sskn_line.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import SsknProgressBar from "./SsknProgressBar";
import { useStore } from "../../store";

const SsknHUD = memo(() => {
  const ssknOkTex = useLoader(THREE.TextureLoader, ssknOk);
  const ssknOkInactiveTex = useLoader(THREE.TextureLoader, ssknOkInactive);
  const ssknCancelTex = useLoader(THREE.TextureLoader, ssknCancel);
  const ssknCancelInactiveTex = useLoader(
    THREE.TextureLoader,
    ssknCancelInactive
  );
  const ssknUpgradeTex = useLoader(THREE.TextureLoader, ssknUpgrade);
  const ssknArrowTex = useLoader(THREE.TextureLoader, ssknArrow);
  const ssknTextWrapperTex = useLoader(THREE.TextureLoader, ssknTextWrapper);
  const ssknTextWrapperInactiveTex = useLoader(
    THREE.TextureLoader,
    ssknTextWrapperInactive
  );
  const ssknLineTex = useLoader(THREE.TextureLoader, ssknLine);

  const activeSsknComponent = useStore((state) => state.activeSsknComponent);

  const loading = useStore((state) => state.ssknLoading);

  return (
    <>
      {loading ? (
        <SsknProgressBar />
      ) : (
        <group>
          <sprite position={[2.8, -2, 0]} scale={[1, 0.5, 0]}>
            <spriteMaterial
              attach="material"
              map={activeSsknComponent === "ok" ? ssknOkTex : ssknOkInactiveTex}
            />
          </sprite>
          <sprite position={[3.3, -3, 0]} scale={[2, 0.5, 0]}>
            <spriteMaterial
              attach="material"
              map={
                activeSsknComponent === "cancel"
                  ? ssknCancelTex
                  : ssknCancelInactiveTex
              }
            />
          </sprite>
          <sprite position={[3.3, -2.15, 0]} scale={[3, 0.4, 0]}>
            <spriteMaterial
              attach="material"
              map={
                activeSsknComponent === "ok"
                  ? ssknTextWrapperTex
                  : ssknTextWrapperInactiveTex
              }
            />
          </sprite>
          <sprite position={[3.3, -3.15, 0]} scale={[3, 0.4, 0]}>
            <spriteMaterial
              attach="material"
              map={
                activeSsknComponent === "cancel"
                  ? ssknTextWrapperTex
                  : ssknTextWrapperInactiveTex
              }
            />
          </sprite>
          <sprite
            position={[0.2, -2.7, 0]}
            scale={[2.2, 0.3, 0]}
            renderOrder={4}
          >
            <spriteMaterial attach="material" map={ssknArrowTex} />
          </sprite>
          <sprite
            position={[-4.65, -2.7, 0]}
            scale={[1, 0.03, 0]}
            renderOrder={4}
          >
            <spriteMaterial attach="material" map={ssknLineTex} />
          </sprite>
        </group>
      )}
      <sprite position={[-2.5, -2.7, 0]} scale={[2.9, 0.7, 0]} renderOrder={4}>
        <spriteMaterial attach="material" map={ssknUpgradeTex} />
      </sprite>
    </>
  );
});

export default SsknHUD;
