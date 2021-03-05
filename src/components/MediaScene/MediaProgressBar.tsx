import React, { useMemo, useRef } from "react";
import { useStore } from "../../store";
import progressBarContainer from "../../static/sprites/media/media_loading_bar_container.png";
import progressBar from "../../static/sprites/progressbar/progress_bar0.png";
import progressBar1 from "../../static/sprites/progressbar/progress_bar1.png";
import progressBar2 from "../../static/sprites/progressbar/progress_bar2.png";
import progressBar3 from "../../static/sprites/progressbar/progress_bar3.png";
import progressBar4 from "../../static/sprites/progressbar/progress_bar4.png";
import progressBar5 from "../../static/sprites/progressbar/progress_bar5.png";

import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const MediaProgressBar = () => {
  const mediaPercentageElapsed = useStore(
    (state) => state.mediaPercentageElapsed
  );
  const progressBarContainerTex = useLoader(
    THREE.TextureLoader,
    progressBarContainer
  );
  const progressBarTex = useLoader(THREE.TextureLoader, progressBar);
  const progressBar1Tex = useLoader(THREE.TextureLoader, progressBar1);
  const progressBar2Tex = useLoader(THREE.TextureLoader, progressBar2);
  const progressBar3Tex = useLoader(THREE.TextureLoader, progressBar3);
  const progressBar4Tex = useLoader(THREE.TextureLoader, progressBar4);
  const progressBar5Tex = useLoader(THREE.TextureLoader, progressBar5);

  // the additions here are very linear, but just +ing the values wouldn't work
  // since in case the video were to get rewinded the bar wouldn't react properly
  // doing it declaratively like this fixes that concern
  const progressBarState = useMemo(() => {
    const mediaPercentageDispatch = {
      0: {
        scaleX: 0,
        texture: progressBar1Tex,
        offsetX: 0,
      },
      5: {
        scaleX: 0.25,
        texture: progressBar1Tex,
        offsetX: 0,
      },
      10: { scaleX: 0.5, texture: progressBar2Tex, offsetX: 0.145 },
      15: { scaleX: 0.75, texture: progressBar3Tex, offsetX: 0.25 },
      20: {
        scaleX: 1,
        texture: progressBar4Tex,
        offsetX: 0.4,
      },
      25: {
        scaleX: 1.25,
        texture: progressBar5Tex,
        offsetX: 0.55,
      },
      30: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 0.8,
      },
      35: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 1.05,
      },
      40: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 1.3,
      },
      45: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 1.55,
      },
      50: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 1.8,
      },
      55: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 2.05,
      },
      60: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 2.3,
      },
      65: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 2.55,
      },
      70: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 2.8,
      },
      75: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 3.05,
      },
      80: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 3.3,
      },
      85: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 3.55,
      },
      90: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 3.65,
      },
      95: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 3.85,
      },
      100: {
        scaleX: 1.5,
        texture: progressBarTex,
        offsetX: 3.95,
      },
    };
    return mediaPercentageDispatch[
      mediaPercentageElapsed as keyof typeof mediaPercentageDispatch
    ];
  }, [
    progressBar1Tex,
    progressBar2Tex,
    progressBar3Tex,
    progressBar4Tex,
    progressBar5Tex,
    progressBarTex,
    mediaPercentageElapsed,
  ]);

  const progressBarMatRef = useRef<THREE.Material>();
  useFrame(() => {
    if (progressBarMatRef) {
      progressBarMatRef.current!.needsUpdate = true;
    }
  });

  return (
    <>
      <sprite scale={[5.2, 0.5, 1]} position={[2.15, 3.005, 0]}>
        <spriteMaterial attach="material" map={progressBarContainerTex} />
      </sprite>
      <mesh
        scale={[progressBarState ? progressBarState.scaleX : 0, 0.195, 1]}
        position={[
          progressBarState ? -0.2 + progressBarState.offsetX : -0.2,
          2.945,
          0,
        ]}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          ref={progressBarMatRef}
          attach="material"
          transparent={true}
          map={progressBarState ? progressBarState.texture : null}
        />
      </mesh>
    </>
  );
};

export default MediaProgressBar;
