import React, { useEffect, useMemo, useRef } from "react";
import { RepeatWrapping } from "three";
import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";
import TextRenderer from "../TextRenderer/TextRenderer";
import { TextType } from "@/types";

type BootAuthorizeUserProps = {
  visible: boolean;
};

const BootAuthorizeUser = (props: BootAuthorizeUserProps) => {
  const authorizeHeaderUnderline = useTexture(
    "/sprites/boot/authorize_header_underline.png"
  );
  const authorizeGlass = useTexture("/sprites/boot/authorize_glass.png");
  const authorizeGlassUnderline = useTexture(
    "/sprites/boot/authorize_glass_underline.png"
  );
  const authorizeOrangeSquare = useTexture(
    "/sprites/boot/authorize_orange_square.png"
  );
  const authorizeStartToFinish = useTexture(
    "/sprites/boot/authorize_start_to_finish.png"
  );
  const authorizeInactiveLetters = useTexture(
    "/sprites/boot/authorize_inactive_letters.png"
  );
  const activeLetters = useTexture(
    "/sprites/boot/authorize_active_letters.png"
  );

  const letterMatrixIndex = useStore((state) => state.letterMatrixIndex);

  const bgLettersRef = useRef<THREE.Mesh>(null);

  const activeLetterMap = useMemo(() => {
    activeLetters.wrapT = activeLetters.wrapS = RepeatWrapping;
    activeLetters.repeat.set(0.06, 0.2);
    activeLetters.offset.x = 0.0775 * letterMatrixIndex.col;
    activeLetters.offset.y = -0.2 - 0.2 * letterMatrixIndex.row;
    return activeLetters;
  }, [activeLetters, letterMatrixIndex.col, letterMatrixIndex.row]);

  useEffect(() => {
    if (bgLettersRef.current) {
      bgLettersRef.current.position.y = -0.7 + 0.25 * letterMatrixIndex.row;
      bgLettersRef.current.position.x = 3.35 - 0.3 * letterMatrixIndex.col;
    }
  }, [letterMatrixIndex]);

  const playerName = useStore((state) => state.playerName);

  return (
    <>
      {props.visible && (
        <>
          <sprite
            scale={[3.5, 0.01, 0]}
            position={[0.5, 1.1, 0]}
            renderOrder={2}
          >
            <spriteMaterial map={authorizeHeaderUnderline} transparent={true} />
          </sprite>
          <sprite
            scale={[2.2 * 0.9, 0.15 * 0.9, 0]}
            position={[1, 1, 0]}
            renderOrder={2}
          >
            <spriteMaterial map={authorizeStartToFinish} transparent={true} />
          </sprite>

          <sprite
            scale={[0.85, 0.65, 0]}
            position={[0.35, -0.1, 0]}
            renderOrder={3}
          >
            <spriteMaterial
              map={authorizeGlass}
              transparent={true}
              depthTest={false}
            />
          </sprite>
          <sprite
            scale={[0.2, 0.2, 0]}
            position={[-0.19, -0.3, 0]}
            renderOrder={3}
            visible={!(playerName.length === 8)}
          >
            <spriteMaterial
              map={authorizeOrangeSquare}
              transparent={true}
              depthTest={false}
            />
          </sprite>
          <group
            position={[
              (playerName.length === 8 ? 0.2 : 0) +
                playerName.length * -0.2 -
                0.2,
              -0.29,
              0,
            ]}
          >
            <TextRenderer
              type={TextType.Jp}
              text={playerName}
              scale={[0.2, 0.2, 0]}
              renderOrder={5000}
              depthTest={false}
            />
          </group>
          <sprite
            scale={[2, 0.01, 0]}
            position={[-1.06, -0.42, 0]}
            renderOrder={2}
          >
            <spriteMaterial
              map={authorizeGlassUnderline}
              transparent={true}
              depthTest={false}
            />
          </sprite>

          <group position={[-1.15, 0.4, 0.3]} rotation={[-0.8, 0, -0.3]}>
            <mesh
              scale={[4, 1.28, 0]}
              position={[1.25, -0.45, 0]}
              ref={bgLettersRef}
            >
              <planeBufferGeometry attach="geometry" />
              <meshBasicMaterial
                map={authorizeInactiveLetters}
                transparent={true}
                opacity={0.6}
              />
            </mesh>
            <mesh
              scale={[0.35, 0.45, 0]}
              position={[1.51, -0.12, 0]}
              renderOrder={2}
            >
              <planeBufferGeometry attach="geometry" />
              <meshBasicMaterial
                map={activeLetterMap}
                transparent={true}
                depthTest={false}
              />
            </mesh>
            <mesh position={[1.54, -0.13, 0]} renderOrder={1}>
              <circleBufferGeometry attach="geometry" args={[0.221, 32]} />
              <meshBasicMaterial
                transparent={true}
                depthTest={false}
                color={0x000000}
              />
            </mesh>
          </group>
        </>
      )}
    </>
  );
};

export default BootAuthorizeUser;
