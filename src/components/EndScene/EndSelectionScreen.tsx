import React, { memo, useRef, useState } from "react";
import middleSpritesheet from "../../static/sprites/end/end_middle_spritesheet.png";
import middleLain from "../../static/sprites/end/end_middle_lain.png";
import circleSpritesheet from "../../static/sprites/end/end_circle_spritesheet.png";
import endText from "../../static/sprites/end/end_end_text.png";
import continueText from "../../static/sprites/end/end_continue_text.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../store";

type EndSelectionScreenProps = {
  visible: boolean;
};

const EndSelectionScreen = memo((props: EndSelectionScreenProps) => {
  const middleSpritesheetTex: any = useLoader(
    THREE.TextureLoader,
    middleSpritesheet
  );
  const circleSpritesheetTex: any = useLoader(
    THREE.TextureLoader,
    circleSpritesheet
  );
  const endTextTex = useLoader(THREE.TextureLoader, endText);
  const continueTextTex = useLoader(THREE.TextureLoader, continueText);
  const middleLainTex = useLoader(THREE.TextureLoader, middleLain);

  const activeComponent = useStore((state) => state.activeEndComponent);

  const [middleSpritesheetAnimator] = useState(() => {
    const anim = new PlainAnimator(middleSpritesheetTex, 1, 4, 4, 24);
    anim.init(0);
    return anim;
  });

  const [circleSpritesheetAnimator] = useState(() => {
    const anim = new PlainAnimator(circleSpritesheetTex, 4, 2, 8, 24);
    anim.init(0);
    return anim;
  });

  const [lainVisible, setLainVisible] = useState(0);

  const lastTime = useRef(0);

  const middleBoxRef = useRef<THREE.Object3D>();
  useFrame(() => {
    middleSpritesheetAnimator.animate();
    circleSpritesheetAnimator.animate();
    if (middleBoxRef.current) {
      middleBoxRef.current.rotation.z -= 0.005;
    }
    const now = Date.now();
    if (now > lastTime.current + 15000) {
      lastTime.current = now;
      setLainVisible(Number(!lainVisible));
    }
  });

  const { lainOpacityToggle } = useSpring({
    lainOpacityToggle: lainVisible,
    config: { duration: 500 },
  });

  const lainOpacity = lainOpacityToggle.to([0, 1], [0, 0.5]);

  return (
    <group visible={props.visible}>
      <sprite position={[-3.5, 0, -3]} scale={[10, 0.8, 0]}>
        <spriteMaterial attach="material" map={middleSpritesheetTex} />
      </sprite>
      <sprite position={[3.5, 0, -3]} scale={[10, 0.8, 0]}>
        <spriteMaterial attach="material" map={middleSpritesheetTex} />
      </sprite>
      <mesh scale={[0.4, 0.4, 0]} ref={middleBoxRef} position={[0, 0, 1]}>
        <boxBufferGeometry attach="geometry" />
        <meshBasicMaterial attach="material" color={0x000000} />
      </mesh>
      <sprite
        position={activeComponent === "end" ? [0, 1, 0] : [0, -1.5, 0]}
        scale={[0.5, 0.5, 0]}
      >
        <spriteMaterial attach="material" map={circleSpritesheetTex} />
      </sprite>
      <sprite position={[0, 1.6, 0]} scale={[1.5, 0.5, 0]}>
        <spriteMaterial attach="material" map={endTextTex} />
      </sprite>
      <sprite position={[0, -1, 0]} scale={[2, 0.25, 0]}>
        <spriteMaterial attach="material" map={continueTextTex} />
      </sprite>
      <sprite position={[0, 0, 0]} scale={[4, 0.5, 0]}>
        <a.spriteMaterial
          attach="material"
          map={middleLainTex}
          opacity={lainOpacity}
        />
      </sprite>
    </group>
  );
});

export default EndSelectionScreen;
