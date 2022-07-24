import React, { useEffect, useMemo } from "react";
import { useStore } from "@/store";
import { NearestFilter } from "three";
import { GameSite, GameScene } from "@/types";
import { useTexture } from "@react-three/drei";
import { handleEvent } from "@/core";
import { enterScene } from "@/core/events";

const ChangeDiscScene = () => {
  const site = useStore((state) => state.site);

  const lof = useTexture("/sprites/change_disc/disc_lof.png");
  const changeSite = useTexture("/sprites/change_disc/disc_change_site.png");
  const line = useTexture("/sprites/change_disc/disc_line.png");
  const slopeLine = useTexture("/sprites/change_disc/disc_slope_line.png");
  const checkingInProgress = useTexture(
    "/sprites/change_disc/disc_checking_in_progress.png"
  );
  const text = useTexture("/sprites/change_disc/disc_disc.png");
  const disc1 = useTexture("/sprites/change_disc/disc_1.png");
  const disc2 = useTexture("/sprites/change_disc/disc_2.png");

  const fixedTextures = useMemo(() => {
    changeSite.magFilter = NearestFilter;

    checkingInProgress.magFilter = NearestFilter;

    return {
      changeSite: changeSite,
      checkingInProgress: checkingInProgress,
    };
  }, [changeSite, checkingInProgress]);

  useEffect(() => {
    setTimeout(() => handleEvent(enterScene(GameScene.Main)), 3500);
  }, [site]);

  return (
    <>
      <sprite scale={[15, 15, 0]}>
        <spriteMaterial color={0xffffff} />
      </sprite>
      <sprite scale={[2.8, 0.8, 0]} position={[0, 2.5, 0]}>
        <spriteMaterial map={lof} />
      </sprite>
      <sprite scale={[5, 0.8, 0]} position={[0, 1, 0]}>
        <spriteMaterial map={fixedTextures.changeSite} />
      </sprite>

      {[...Array(2).keys()].map((idx) => (
        <sprite
          scale={[9, 0.03, 0]}
          position={[0, 0.5 - idx / 10, 0]}
          key={idx}
        >
          <spriteMaterial map={line} />
        </sprite>
      ))}

      <sprite scale={[7, 0.8, 0]} position={[0, -1, 0]}>
        <spriteMaterial map={fixedTextures.checkingInProgress} />
      </sprite>

      {[...Array(7).keys()].map((idx) => (
        <sprite
          scale={[9, 0.03, 0]}
          position={[0, -1.5 - idx / 9, 0]}
          key={idx}
        >
          <spriteMaterial map={line} />
        </sprite>
      ))}

      {[...Array(2).keys()].map((idx) => (
        <sprite
          scale={[8, 0.13, 0]}
          position={[0, -2.2 - idx / 8, 0]}
          key={idx}
        >
          <spriteMaterial map={slopeLine} />
        </sprite>
      ))}

      <sprite scale={[2, 0.7, 0]} position={[-0.3, -1.9, 0]}>
        <spriteMaterial map={text} />
      </sprite>

      <sprite scale={[0.4, 0.7, 0]} position={[1.4, -1.9, 0]}>
        <spriteMaterial map={site === GameSite.A ? disc1 : disc2} />
      </sprite>
    </>
  );
};

export default ChangeDiscScene;
