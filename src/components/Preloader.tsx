import moveDownSpriteSheet from "../static/sprites/jump_down.png";
import moveUpSpriteSheet from "../static/sprites/jump_up.png";
import standingSpriteSheet from "../static/sprites/standing.png";
import moveLeftSpriteSheet from "../static/sprites/move_left.png";
import moveRightSpriteSheet from "../static/sprites/move_right.png";
import * as THREE from "three";
import { useLoader, useThree } from "react-three-fiber";
import { useLayoutEffect } from "react";

// this function just preloads lain's spritesheets cuz they're big and lazy loading them
// used to make the suspense run for a couple milliseconds, resulting in flickering
const Preloader = () => {
  const moveDown = useLoader(THREE.TextureLoader, moveDownSpriteSheet);
  const moveUp = useLoader(THREE.TextureLoader, moveUpSpriteSheet);
  const moveLeft = useLoader(THREE.TextureLoader, moveLeftSpriteSheet);
  const moveRight = useLoader(THREE.TextureLoader, moveRightSpriteSheet);
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.initTexture(moveDown);
    gl.initTexture(moveUp);
  }, [moveDown, moveUp, moveLeft, standingSpriteSheet, moveRight]);
  return null;
};

export default Preloader;
