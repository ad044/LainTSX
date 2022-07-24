import React, { memo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "@/store";
import { EndComponent } from "@/types";
import { useTexture } from "@react-three/drei";

type EndSelectionScreenProps = {
  visible: boolean;
};

const EndSelectionScreen = (props: EndSelectionScreenProps) => {
  const middleSpritesheetTex: any = useTexture(
    "/sprites/end/end_middle_spritesheet.png"
  );
  const circleSpritesheetTex: any = useTexture(
    "/sprites/end/end_circle_spritesheet.png"
  );
  const endText = useTexture("/sprites/end/end_end_text.png");
  const continueText = useTexture("/sprites/end/end_continue_text.png");
  const middleLain = useTexture("/sprites/end/end_middle_lain.png");

  const activeComponent = useStore((state) => state.endComponent);

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

  const middleBoxRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    middleSpritesheetAnimator.animate();
    circleSpritesheetAnimator.animate();
    if (middleBoxRef.current) {
      middleBoxRef.current.rotation.z -= delta / 5;
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
        <spriteMaterial map={middleSpritesheetTex} />
      </sprite>
      <sprite position={[3.5, 0, -3]} scale={[10, 0.8, 0]}>
        <spriteMaterial map={middleSpritesheetTex} />
      </sprite>
      <mesh scale={[0.4, 0.4, 0]} ref={middleBoxRef} position={[0, 0, 1]}>
        <boxBufferGeometry attach="geometry" />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      <sprite
        position={
          activeComponent === EndComponent.End ? [0, 1, 0] : [0, -1.5, 0]
        }
        scale={[0.5, 0.5, 0]}
      >
        <spriteMaterial map={circleSpritesheetTex} />
      </sprite>
      <sprite position={[0, 1.6, 0]} scale={[1.5, 0.5, 0]}>
        <spriteMaterial map={endText} />
      </sprite>
      <sprite position={[0, -1, 0]} scale={[2, 0.25, 0]}>
        <spriteMaterial map={continueText} />
      </sprite>
      <sprite position={[0, 0, 0]} scale={[4, 0.5, 0]}>
        {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
        <a.spriteMaterial map={middleLain} opacity={lainOpacity} />
      </sprite>
    </group>
  );
};

export default memo(EndSelectionScreen);
