import React, { Suspense } from "react";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import * as THREE from "three";
import movie from "../static/sprites/movie.png";
import touko from "../static/sprites/touko.png";
import s from "../static/sprites/s.png";
import copland from "../static/sprites/copland.png";

type LevelSpriteConstructorProps = {
  sprite: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number, (string | undefined)?];
};

type SpriteToPath = {
  [key: string]: string;
};

const LevelSprite = (props: LevelSpriteConstructorProps) => {
  // the game only has a couple of sprites that it displays in the hub
  // dynamically importnig them would be worse for performance,
  // so we import all of them here and then use this function to
  // associate a sprite with the path
  // (yes, imbad at naming them)
  const spriteToPath = (sprite: string) => {
    return ({
      movie: movie,
      touko: touko,
      s: s,
      copland: copland,
    } as SpriteToPath)[sprite];
  };

  const spriteTexture: any = useLoader(
    THREE.TextureLoader,
    spriteToPath(props.sprite)
  );

  return (
    <mesh
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
    >
      <planeBufferGeometry attach="geometry" />
      <meshStandardMaterial
        side={THREE.DoubleSide}
        attach="material"
        map={spriteTexture}
        transparent={true}
      />
    </mesh>
  );
};

export default LevelSprite;
