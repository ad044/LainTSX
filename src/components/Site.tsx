import React, { memo, Suspense } from "react";
import blue_orbs from "../resources/blue_orbs.json";
import GrayRing from "./GrayRing";
import BlueOrb from "./BlueOrb/BlueOrb";
import PurpleRing from "./PurpleRing";
import { useRecoilValue } from "recoil";
import { currentBlueOrbAtom } from "./BlueOrb/CurrentBlueOrbAtom";
import CyanCrystal from "./CyanCrystal";

const Site = memo(() => {
  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);

  return (
    <>
      <Suspense fallback={<>loading...</>}>
        {/* average distance between rings from my CALCULATIONS is 1.87 in  our case */}
        <PurpleRing purpleRingPosY={2.27} />
        <GrayRing grayRingPosY={1.59} />
        <PurpleRing purpleRingPosY={0.4} />
        <GrayRing grayRingPosY={-0.28} />
        <CyanCrystal crystalRingPosY={-0.45} />
        {Object.values(blue_orbs).map((sprite) => {
          return (
            <BlueOrb
              position={sprite.position as [number, number, number]}
              scale={sprite.scale as [number, number, number]}
              rotation={
                sprite.rotation as [
                  number,
                  number,
                  number,
                  (string | undefined)?
                ]
              }
              sprite={sprite.sprite}
              key={sprite.id}
              active={sprite.id === currentBlueOrb}
            />
          );
        })}
      </Suspense>
    </>
  );
});

export default Site;
