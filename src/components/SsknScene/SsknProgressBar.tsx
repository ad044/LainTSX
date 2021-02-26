import React, { useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import ssknProgressBarContainer from "../../static/sprites/sskn/sskn_progress_bar.png";
import progressBar1 from "../../static/sprites/progressbar/progress_bar1.png";
import progressBar2 from "../../static/sprites/progressbar/progress_bar2.png";
import progressBar3 from "../../static/sprites/progressbar/progress_bar3.png";
import progressBar4 from "../../static/sprites/progressbar/progress_bar4.png";
import progressBar5 from "../../static/sprites/progressbar/progress_bar5.png";
import progressBar from "../../static/sprites/progressbar/progress_bar0.png";

const SsknProgressBar = () => {
  const ssknProgressBarContainerTex = useLoader(
    THREE.TextureLoader,
    ssknProgressBarContainer
  );

  const progressBarTex = useLoader(THREE.TextureLoader, progressBar);
  const progressBar1Tex = useLoader(THREE.TextureLoader, progressBar1);
  const progressBar2Tex = useLoader(THREE.TextureLoader, progressBar2);
  const progressBar3Tex = useLoader(THREE.TextureLoader, progressBar3);
  const progressBar4Tex = useLoader(THREE.TextureLoader, progressBar4);
  const progressBar5Tex = useLoader(THREE.TextureLoader, progressBar5);

  const progressBarRef = useRef<THREE.Object3D>();
  const progressBarMatRef = useRef<THREE.SpriteMaterial>();
  const percentageElapsed = useRef(0);
  const last = useRef(0);

  useFrame(() => {
    const now = Date.now();

    if (
      now > last.current + 200 &&
      progressBarRef.current &&
      progressBarMatRef.current
    ) {
      percentageElapsed.current += 5;
      switch (percentageElapsed.current) {
        case 5:
          progressBarRef.current.scale.x = 0.25;
          progressBarMatRef.current.map = progressBar1Tex;
          break;
        case 10:
          progressBarRef.current.scale.x += 0.25;
          progressBarRef.current.position.x += 0.1;
          progressBarMatRef.current.map = progressBar2Tex;
          break;
        case 15:
          progressBarRef.current.scale.x += 0.25;
          progressBarRef.current.position.x += 0.1;
          progressBarMatRef.current.map = progressBar3Tex;
          break;
        case 20:
          progressBarRef.current.scale.x += 0.25;
          progressBarRef.current.position.x += 0.1;
          progressBarMatRef.current.map = progressBar4Tex;
          break;
        case 25:
          progressBarRef.current.scale.x += 0.25;
          progressBarRef.current.position.x += 0.1;
          progressBarMatRef.current.map = progressBar5Tex;
          break;
        default:
          if (progressBarRef.current.position.x < 4.1) {
            progressBarMatRef.current.map = progressBarTex;
            progressBarRef.current.position.x += 0.2;
          }
      }
      last.current = now;
    }
  });
  return (
    <>
      <sprite scale={[5.5, 0.3, 0]} position={[2, -2.7, 0]} renderOrder={4}>
        <spriteMaterial attach="material" map={ssknProgressBarContainerTex} />
      </sprite>
      <sprite
        scale={[0.2, 0.15, 0]}
        position={[-0.5, -2.68, 0]}
        renderOrder={4}
        ref={progressBarRef}
      >
        <spriteMaterial
          attach="material"
          ref={progressBarMatRef}
          map={progressBar1Tex}
          opacity={0.8}
        />
      </sprite>
    </>
  );
};

export default SsknProgressBar;
