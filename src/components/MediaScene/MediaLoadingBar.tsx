import React, { useMemo, useRef } from "react";
import { useMediaStore } from "../../store";
import mediaLoadingBarContainer from "../../static/sprite/media_loading_bar_container.png";
import mediaLoadingBar from "../../static/sprite/media_loading_bar.png";
import mediaLoadingBar10Perc from "../../static/sprite/media_loading_bar_10perc.png";
import mediaLoadingBar20Perc from "../../static/sprite/media_loading_bar_20perc.png";
import mediaLoadingBar30Perc from "../../static/sprite/media_loading_bar_30perc.png";
import mediaLoadingBar40Perc from "../../static/sprite/media_loading_bar_40perc.png";
import mediaLoadingBar50Perc from "../../static/sprite/media_loading_bar_50perc.png";

import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const MediaLoadingBar = () => {
  const mediaPercentageElapsed = useMediaStore(
    (state) => state.mediaPercentageElapsed
  );
  const mediaLoadingBarContainerTex = useLoader(
    THREE.TextureLoader,
    mediaLoadingBarContainer
  );
  const mediaLoadingBarTex = useLoader(THREE.TextureLoader, mediaLoadingBar);
  const mediaLoadingBar10PercTex = useLoader(
    THREE.TextureLoader,
    mediaLoadingBar10Perc
  );
  const mediaLoadingBar20PercTex = useLoader(
    THREE.TextureLoader,
    mediaLoadingBar20Perc
  );
  const mediaLoadingBar30PercTex = useLoader(
    THREE.TextureLoader,
    mediaLoadingBar30Perc
  );
  const mediaLoadingBar40PercTex = useLoader(
    THREE.TextureLoader,
    mediaLoadingBar40Perc
  );
  const mediaLoadingBar50PercTex = useLoader(
    THREE.TextureLoader,
    mediaLoadingBar50Perc
  );

  // the additions here are very linear, but just +ing the values wouldn't work
  // since in case the video were to get rewinded the bar wouldn't react properly
  // doing it declaratively like this fixes that concern
  const mediaLoadingBarState = useMemo(() => {
    const mediaPercentageDispatch = {
      5: {
        scaleX: 0.25,
        texture: mediaLoadingBar10PercTex,
        offsetX: 0,
      },
      10: { scaleX: 0.5, texture: mediaLoadingBar20PercTex, offsetX: 0.145 },
      15: { scaleX: 0.75, texture: mediaLoadingBar30PercTex, offsetX: 0.25 },
      20: {
        scaleX: 1,
        texture: mediaLoadingBar40PercTex,
        offsetX: 0.4,
      },
      25: {
        scaleX: 1.25,
        texture: mediaLoadingBar50PercTex,
        offsetX: 0.55,
      },
      30: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 0.8,
      },
      35: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 1.05,
      },
      40: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 1.3,
      },
      45: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 1.55,
      },
      50: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 1.8,
      },
      55: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 2.05,
      },
      60: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 2.3,
      },
      65: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 2.55,
      },
      70: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 2.8,
      },
      75: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 3.05,
      },
      80: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 3.3,
      },
      85: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 3.55,
      },
      90: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 3.65,
      },
      95: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 3.85,
      },
      100: {
        scaleX: 1.5,
        texture: mediaLoadingBarTex,
        offsetX: 3.95,
      },
    };
    return mediaPercentageDispatch[
      mediaPercentageElapsed as keyof typeof mediaPercentageDispatch
    ];
  }, [
    mediaLoadingBar10PercTex,
    mediaLoadingBar20PercTex,
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
        <spriteMaterial attach="material" map={mediaLoadingBarContainerTex} />
      </sprite>
      <mesh
        scale={[
          mediaLoadingBarState ? mediaLoadingBarState.scaleX : 0,
          0.195,
          1,
        ]}
        position={[
          mediaLoadingBarState ? -0.2 + mediaLoadingBarState.offsetX : -0.2,
          2.945,
          0,
        ]}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          ref={loadingBarMatRef}
          attach="material"
          transparent={true}
          map={mediaLoadingBarState ? mediaLoadingBarState.texture : null}
        />
      </mesh>
    </>
  );
};

export default MediaLoadingBar;
