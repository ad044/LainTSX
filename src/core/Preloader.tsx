import introSpriteSheet from "../static/sprite/intro.png";
import moveDownSpriteSheet from "../static/sprite/jump_down.png";
import moveUpSpriteSheet from "../static/sprite/jump_up.png";
import standingSpriteSheet from "../static/sprite/standing.png";
import moveLeftSpriteSheet from "../static/sprite/move_left.png";
import moveRightSpriteSheet from "../static/sprite/move_right.png";
import bigHudSpriteSheet from "../static/sprite/big_hud.png";
import bigHudMirroredSpriteSheet from "../static/sprite/big_hud_mirrored.png";
import longHudSpriteSheet from "../static/sprite/long_hud.png";
import longHudMirroredSpriteSheet from "../static/sprite/long_hud_mirrored.png";
import boringHudSpriteSheet from "../static/sprite/long_hud_boring.png";
import boringHudMirroredSpriteSheet from "../static/sprite/long_hud_boring_mirrored.png";
import throwNodeSpriteSheet from "../static/sprite/throw_node.png";
import ripMiddleRingSpriteSheet from "../static/sprite/rip_middle_ring.png";
import ripNodeSpriteSheet from "../static/sprite/rip_node.png";
import prayerSpriteSheet from "../static/sprite/prayer.png";

import * as THREE from "three";
import { useLoader, useThree } from "react-three-fiber";
import { useLayoutEffect } from "react";

// this function just preloads lain's spritesheets and other assets cuz they're big and lazy loading them
// used to make the suspense run for a couple milliseconds, resulting in flickering
const Preloader = () => {
  const intro = useLoader(THREE.TextureLoader, introSpriteSheet);
  const moveDown = useLoader(THREE.TextureLoader, moveDownSpriteSheet);
  const moveUp = useLoader(THREE.TextureLoader, moveUpSpriteSheet);
  const moveLeft = useLoader(THREE.TextureLoader, moveLeftSpriteSheet);
  const moveRight = useLoader(THREE.TextureLoader, moveRightSpriteSheet);
  const stand = useLoader(THREE.TextureLoader, standingSpriteSheet);
  const throwNode = useLoader(THREE.TextureLoader, throwNodeSpriteSheet);
  const bigHud = useLoader(THREE.TextureLoader, bigHudSpriteSheet);
  const bigHudMirrored = useLoader(
    THREE.TextureLoader,
    bigHudMirroredSpriteSheet
  );
  const longHud = useLoader(THREE.TextureLoader, longHudSpriteSheet);
  const longHudMirrored = useLoader(
    THREE.TextureLoader,
    longHudMirroredSpriteSheet
  );
  const boringHud = useLoader(THREE.TextureLoader, boringHudSpriteSheet);
  const boringHudMirrored = useLoader(
    THREE.TextureLoader,
    boringHudMirroredSpriteSheet
  );
  const ripMiddleRing = useLoader(
    THREE.TextureLoader,
    ripMiddleRingSpriteSheet
  );
  const ripNode = useLoader(THREE.TextureLoader, ripNodeSpriteSheet);
  const prayer = useLoader(THREE.TextureLoader, prayerSpriteSheet);

  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.initTexture(intro);
    gl.initTexture(moveDown);
    gl.initTexture(moveUp);
    gl.initTexture(moveLeft);
    gl.initTexture(moveRight);
    gl.initTexture(stand);
    gl.initTexture(longHud);
    gl.initTexture(bigHud);
    gl.initTexture(bigHudMirrored);
    gl.initTexture(longHudMirrored);
    gl.initTexture(boringHud);
    gl.initTexture(boringHudMirrored);
    gl.initTexture(throwNode);
    gl.initTexture(ripMiddleRing);
    gl.initTexture(ripNode);
    gl.initTexture(prayer);
  }, [
    moveDown,
    moveUp,
    moveLeft,
    moveRight,
    stand,
    gl,
    bigHud,
    bigHudMirrored,
    boringHud,
    boringHudMirrored,
    longHud,
    longHudMirrored,
    intro,
    throwNode,
    ripMiddleRing,
    ripNode,
    prayer,
  ]);
  return null;
};

export default Preloader;
