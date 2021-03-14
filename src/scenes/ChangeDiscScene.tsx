import React, { useEffect, useMemo } from "react";
import { useStore } from "../store";
import changeDiscLof from "../static/sprites/change_disc/disc_lof.png";
import changeSite from "../static/sprites/change_disc/disc_change_site.png";
import discLine from "../static/sprites/change_disc/disc_line.png";
import discSlopeLine from "../static/sprites/change_disc/disc_slope_line.png";
import discText from "../static/sprites/change_disc/disc_disc.png";
import checkingInProgress from "../static/sprites/change_disc/disc_checking_in_progress.png";
import disc1 from "../static/sprites/change_disc/disc_1.png";
import disc2 from "../static/sprites/change_disc/disc_2.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";

const ChangeDiscScene = () => {
  const setScene = useStore((state) => state.setScene);
  const activeSite = useStore((state) => state.activeSite);

  const changeDiscLofTex = useLoader(THREE.TextureLoader, changeDiscLof);
  const changeSiteTex = useLoader(THREE.TextureLoader, changeSite);
  const discLineTex = useLoader(THREE.TextureLoader, discLine);
  const discSlopeLineTex = useLoader(THREE.TextureLoader, discSlopeLine);
  const checkingInProgressTex = useLoader(
    THREE.TextureLoader,
    checkingInProgress
  );
  const discTextTex = useLoader(THREE.TextureLoader, discText);
  const disc1Tex = useLoader(THREE.TextureLoader, disc1);
  const disc2Tex = useLoader(THREE.TextureLoader, disc2);

  const fixedTextures = useMemo(() => {
    changeSiteTex.magFilter = THREE.NearestFilter;

    checkingInProgressTex.magFilter = THREE.NearestFilter;

    return {
      changeSite: changeSiteTex,
      checkingInProgress: checkingInProgressTex,
    };
  }, [changeSiteTex, checkingInProgressTex]);

  useEffect(() => {
    setTimeout(() => setScene("main"), 3500);
  }, [activeSite, setScene]);

  return (
    <>
      <sprite scale={[15, 15, 0]}>
        <spriteMaterial color={0xffffff} />
      </sprite>
      <sprite scale={[2.8, 0.8, 0]} position={[0, 2.5, 0]}>
        <spriteMaterial attach="material" map={changeDiscLofTex} />
      </sprite>
      <sprite scale={[5, 0.8, 0]} position={[0, 1, 0]}>
        <spriteMaterial attach="material" map={fixedTextures.changeSite} />
      </sprite>

      {[...Array(2).keys()].map((idx) => (
        <sprite
          scale={[9, 0.03, 0]}
          position={[0, 0.5 - idx / 10, 0]}
          key={idx}
        >
          <spriteMaterial attach="material" map={discLineTex} />
        </sprite>
      ))}

      <sprite scale={[7, 0.8, 0]} position={[0, -1, 0]}>
        <spriteMaterial
          attach="material"
          map={fixedTextures.checkingInProgress}
        />
      </sprite>

      {[...Array(7).keys()].map((idx) => (
        <sprite
          scale={[9, 0.03, 0]}
          position={[0, -1.5 - idx / 9, 0]}
          key={idx}
        >
          <spriteMaterial attach="material" map={discLineTex} />
        </sprite>
      ))}

      {[...Array(2).keys()].map((idx) => (
        <sprite
          scale={[8, 0.13, 0]}
          position={[0, -2.2 - idx / 8, 0]}
          key={idx}
        >
          <spriteMaterial attach="material" map={discSlopeLineTex} />
        </sprite>
      ))}

      <sprite scale={[2, 0.7, 0]} position={[-0.3, -1.9, 0]}>
        <spriteMaterial attach="material" map={discTextTex} />
      </sprite>

      <sprite scale={[0.4, 0.7, 0]} position={[1.4, -1.9, 0]}>
        <spriteMaterial
          attach="material"
          map={activeSite === "a" ? disc1Tex : disc2Tex}
        />
      </sprite>
    </>
  );
};

export default ChangeDiscScene;
