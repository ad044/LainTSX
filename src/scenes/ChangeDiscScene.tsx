import React, { useEffect } from "react";

import lof from "../../src/static/sprite/disc_lof.png";
import changeSiteText from "../../src/static/sprite/disc_change_site.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";

const ChangeDiscScene = () => {
  const lofTex = useLoader(THREE.TextureLoader, lof);
  const changeSiteTextTex = useLoader(THREE.TextureLoader, changeSiteText);

  useEffect(() => {
    document.getElementsByTagName("canvas")[0].className =
      "change-disc-scene-background";
  }, []);

  return (
    <>
      <sprite scale={[3, 1, 0]} position={[0, 2, 0]}>
        <spriteMaterial map={lofTex} attach="material" />
      </sprite>
      <sprite scale={[5, 1, 0]} position={[0, 0, 0]}>
        <spriteMaterial map={changeSiteTextTex} attach="material" />
      </sprite>
    </>
  );
};

export default ChangeDiscScene;
