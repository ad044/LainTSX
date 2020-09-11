import React, { memo, Suspense } from "react";
import level_sprites from "../resources/level_sprites.json";
import GrayRing from "./GrayRing";
import LevelSprite from "./LevelSprite/LevelSprite";
import PurpleRing from "./PurpleRing";
import { useRecoilValue } from "recoil";
import { currentSpriteAtom } from "./LevelSprite/CurrentSpriteAtom";

const Hub = memo(() => {
  const currentSprite = useRecoilValue(currentSpriteAtom);

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
              active={sprite.id === currentSprite}
            />
          );
        })}
      </Suspense>
    </>
  );
});

export default Hub;
