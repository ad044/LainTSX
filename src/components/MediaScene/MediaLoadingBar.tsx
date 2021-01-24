import React, { useMemo, useRef } from "react";
import { useStore } from "../../store";
import loadingBarContainer from "../../static/sprite/media_loading_bar_container.png";
import loadingBar from "../../static/sprite/media_loading_bar.png";
import loadingBar10Perc from "../../static/sprite/media_loading_bar_10perc.png";
import loadingBar20Perc from "../../static/sprite/media_loading_bar_20perc.png";
import loadingBar30Perc from "../../static/sprite/media_loading_bar_30perc.png";
import loadingBar40Perc from "../../static/sprite/media_loading_bar_40perc.png";
import loadingBar50Perc from "../../static/sprite/media_loading_bar_50perc.png";

import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const MediaLoadingBar = () => {
  const mediaPercentageElapsed = useStore(
    (state) => state.mediaPercentageElapsed
  );
  const loadingBarContainerTex = useLoader(
    THREE.TextureLoader,
    loadingBarContainer
  );
  const loadingBarTex = useLoader(THREE.TextureLoader, loadingBar);
  const loadingBar10PercTex = useLoader(THREE.TextureLoader, loadingBar10Perc);
  const loadingBar20PercTex = useLoader(THREE.TextureLoader, loadingBar20Perc);
  const loadingBar30PercTex = useLoader(THREE.TextureLoader, loadingBar30Perc);
  const loadingBar40PercTex = useLoader(THREE.TextureLoader, loadingBar40Perc);
  const loadingBar50PercTex = useLoader(THREE.TextureLoader, loadingBar50Perc);

  // the additions here are very linear, but just +ing the values wouldn't work
  // since in case the video were to get rewinded the bar wouldn't react properly
  // doing it declaratively like this fixes that concern
  const loadingBarState = useMemo(() => {
    const mediaPercentageDispatch = {
      5: {
        scaleX: 0.25,
        texture: loadingBar10PercTex,
        offsetX: 0,
      },
      10: { scaleX: 0.5, texture: loadingBar20PercTex, offsetX: 0.145 },
      15: { scaleX: 0.75, texture: loadingBar30PercTex, offsetX: 0.25 },
      20: {
        scaleX: 1,
        texture: loadingBar40PercTex,
        offsetX: 0.4,
      },
      25: {
        scaleX: 1.25,
        texture: loadingBar50PercTex,
        offsetX: 0.55,
      },
      30: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 0.8,
      },
      35: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 1.05,
      },
      40: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 1.3,
      },
      45: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 1.55,
      },
      50: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 1.8,
      },
      55: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 2.05,
      },
      60: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 2.3,
      },
      65: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 2.55,
      },
      70: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 2.8,
      },
      75: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 3.05,
      },
      80: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 3.3,
      },
      85: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 3.55,
      },
      90: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 3.65,
      },
      95: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 3.85,
      },
      100: {
        scaleX: 1.5,
        texture: loadingBarTex,
        offsetX: 3.95,
      },
    };
    return mediaPercentageDispatch[
      mediaPercentageElapsed as keyof typeof mediaPercentageDispatch
    ];
  }, [
    loadingBar10PercTex,
    loadingBar20PercTex,
    loadingBar30PercTex,
    loadingBar40PercTex,
    loadingBar50PercTex,
    loadingBarTex,
    mediaPercentageElapsed,
  ]);

  const loadingBarMatRef = useRef<THREE.Material>();
  useFrame(() => {
    if (loadingBarMatRef) {
      loadingBarMatRef.current!.needsUpdate = true;
    }
  });

  return (
    <>
      <sprite scale={[5.2, 0.5, 1]} position={[2.15, 3.005, 0]}>
        <spriteMaterial attach="material" map={loadingBarContainerTex} />
      </sprite>
      <mesh
        scale={[loadingBarState ? loadingBarState.scaleX : 0, 0.195, 1]}
        position={[
          loadingBarState ? -0.2 + loadingBarState.offsetX : -0.2,
          2.945,
          0,
        ]}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          ref={loadingBarMatRef}
          attach="material"
          transparent={true}
          map={loadingBarState ? loadingBarState.texture : null}
        />
      </mesh>
    </>
  );
};

export default MediaLoadingBar;
