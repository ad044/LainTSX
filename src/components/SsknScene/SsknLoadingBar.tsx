import React, { useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import ssknLoadingBarContainer from "../../static/sprite/SSkn_loading_bar.png";
import loadingBar10Perc from "../../static/sprite/media_loading_bar_10perc.png";
import loadingBar20Perc from "../../static/sprite/media_loading_bar_20perc.png";
import loadingBar30Perc from "../../static/sprite/media_loading_bar_30perc.png";
import loadingBar40Perc from "../../static/sprite/media_loading_bar_40perc.png";
import loadingBar50Perc from "../../static/sprite/media_loading_bar_50perc.png";
import loadingBar from "../../static/sprite/media_loading_bar.png";

const SsknLoadingBar = () => {
  const ssknLoadingBarContainerTex = useLoader(
    THREE.TextureLoader,
    ssknLoadingBarContainer
  );

  const loadingBarTex = useLoader(THREE.TextureLoader, loadingBar);
  const loadingBar10PercTex = useLoader(THREE.TextureLoader, loadingBar10Perc);
  const loadingBar20PercTex = useLoader(THREE.TextureLoader, loadingBar20Perc);
  const loadingBar30PercTex = useLoader(THREE.TextureLoader, loadingBar30Perc);
  const loadingBar40PercTex = useLoader(THREE.TextureLoader, loadingBar40Perc);
  const loadingBar50PercTex = useLoader(THREE.TextureLoader, loadingBar50Perc);

  const loadingBarRef = useRef<THREE.Object3D>();
  const loadingBarMatRef = useRef<THREE.SpriteMaterial>();
  const percentageElapsed = useRef(0);
  const last = useRef(0);

  useFrame(() => {
    const now = Date.now();

    if (
      now > last.current + 200 &&
      loadingBarRef.current &&
      loadingBarMatRef.current
    ) {
      percentageElapsed.current += 5;
      switch (percentageElapsed.current) {
        case 5:
          loadingBarRef.current.scale.x = 0.25;
          loadingBarMatRef.current.map = loadingBar10PercTex;
          break;
        case 10:
          loadingBarRef.current.scale.x += 0.25;
          loadingBarRef.current.position.x += 0.1;
          loadingBarMatRef.current.map = loadingBar20PercTex;
          break;
        case 15:
          loadingBarRef.current.scale.x += 0.25;
          loadingBarRef.current.position.x += 0.1;
          loadingBarMatRef.current.map = loadingBar30PercTex;
          break;
        case 20:
          loadingBarRef.current.scale.x += 0.25;
          loadingBarRef.current.position.x += 0.1;
          loadingBarMatRef.current.map = loadingBar40PercTex;
          break;
        case 25:
          loadingBarRef.current.scale.x += 0.25;
          loadingBarRef.current.position.x += 0.1;
          loadingBarMatRef.current.map = loadingBar50PercTex;
          break;
        default:
          if (loadingBarRef.current.position.x < 4.1) {
            loadingBarMatRef.current.map = loadingBarTex;
            loadingBarRef.current.position.x += 0.2;
          }
      }
      last.current = now;
    }
  });
  return (
    <>
      <sprite scale={[5.5, 0.3, 0]} position={[2, -2.7, 0]} renderOrder={4}>
        <spriteMaterial attach="material" map={ssknLoadingBarContainerTex} />
      </sprite>
      <sprite
        scale={[0.2, 0.15, 0]}
        position={[-0.5, -2.68, 0]}
        renderOrder={4}
        ref={loadingBarRef}
      >
        <spriteMaterial
          attach="material"
          ref={loadingBarMatRef}
          map={loadingBar10PercTex}
          opacity={0.8}
        />
      </sprite>
    </>
  );
};

export default SsknLoadingBar;
