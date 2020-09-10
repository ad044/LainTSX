import React, { Suspense } from "react";
import level_sprites from "../resources/level_sprites.json";
import GrayRing from "./GrayRing";
import LevelSprite from "./LevelSprite";
import PurpleRing from "./PurpleRing";
import Preloader from "./Preloader";

type HubProps = {
  currentSprite: string;
};

const Hub = (props: HubProps) => {
  return (
    <>
      <Suspense fallback={<>loading...</>}>
        {/* average distance between rings from my CALCULATIONS is 1.87 in  our case */}
        <PurpleRing purpleRingPosY={2.27} />
        <GrayRing grayRingPosY={1.6} />
        <PurpleRing purpleRingPosY={0.4} />
        <GrayRing grayRingPosY={-0.27} />
        {Object.values(level_sprites).map((sprite) => {
          return (
            <LevelSprite
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
              active={sprite.id === props.currentSprite}
            />
          );
        })}
      </Suspense>
    </>
  );
};

export default Hub;
