import { useThree } from "@react-three/fiber";
import { memo, useLayoutEffect, useState } from "react";
import { useTexture } from "@react-three/drei";

// this function just preloads spritesheets and other assets cuz they're big and lazy loading them
// used to make the suspense run for a couple milliseconds, resulting in flickering
const Preloader = () => {
  useTexture("/sprites/fonts/orange_jp_font.png");
  useTexture("/sprites/main/big_hud.png");
  useTexture("/sprites/main/long_hud.png");
  useTexture("/sprites/main/boring_hud.png");
  useTexture("/sprites/lain/intro.png");
  useTexture("/sprites/lain/jump_down.png");
  useTexture("/sprites/lain/jump_up.png");
  useTexture("/sprites/lain/move_left.png");
  useTexture("/sprites/lain/move_right.png");
  useTexture("/sprites/lain/standing.png");
  useTexture("/sprites/lain/throw_node.png");
  useTexture("/sprites/lain/rip_middle_ring.png");
  useTexture("/sprites/lain/rip_node.png");
  useTexture("/sprites/lain/prayer.png");
  useTexture("/sprites/lain/knock.png");
  useTexture("/sprites/lain/knock_and_fall.png");
  useTexture("/sprites/lain/touch_node_and_get_scared.png");
  useTexture("/sprites/lain/touch_sleeve.png");
  useTexture("/sprites/lain/thinking.png");
  useTexture("/sprites/lain/stretch.png");
  useTexture("/sprites/lain/stretch_2.png");
  useTexture("/sprites/lain/spin.png");
  useTexture("/sprites/lain/scratch_head.png");
  useTexture("/sprites/lain/blush.png");
  useTexture("/sprites/lain/hands_behind_head.png");
  useTexture("/sprites/lain/hands_on_hips.png");
  useTexture("/sprites/lain/hands_on_hips_2.png");
  useTexture("/sprites/lain/hands_together.png");
  useTexture("/sprites/lain/lean_forward.png");
  useTexture("/sprites/lain/lean_left.png");
  useTexture("/sprites/lain/lean_right.png");
  useTexture("/sprites/lain/look_around.png");
  useTexture("/sprites/lain/play_with_hair.png");

  return null;
};

export default memo(Preloader);
