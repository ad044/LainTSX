import React, { useEffect, useMemo, useRef } from "react";
import authorizeHeaderUnderline from "../../static/sprites/boot/authorize_header_underline.png";
import authorizeGlass from "../../static/sprites/boot/authorize_glass.png";
import authorizeGlassUnderline from "../../static/sprites/boot/authorize_glass_underline.png";
import authorizeOrangeSquare from "../../static/sprites/boot/authorize_orange_square.png";
import authorizeStartToFinish from "../../static/sprites/boot/authorize_start_to_finish.png";
import authorizeInactiveLetters from "../../static/sprites/boot/authorize_inactive_letters.png";
import authorizeActiveLetters from "../../static/sprites/boot/authorize_active_letters.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../../store";
import StaticJpCharacter from "../TextRenderer/StaticJpCharacter";

type BootAuthorizeUserProps = {
  visible: boolean;
};

const BootAuthorizeUser = (props: BootAuthorizeUserProps) => {
  const authorizeHeaderUnderlineTex = useLoader(
    THREE.TextureLoader,
    authorizeHeaderUnderline
  );
  const authorizeGlassTex = useLoader(THREE.TextureLoader, authorizeGlass);
  const authorizeGlassUnderlineTex = useLoader(
    THREE.TextureLoader,
    authorizeGlassUnderline
  );
  const authorizeOrangeSquareTex = useLoader(
    THREE.TextureLoader,
    authorizeOrangeSquare
  );
  const authorizeStartToFinishTex = useLoader(
    THREE.TextureLoader,
    authorizeStartToFinish
  );
  const authorizeInactiveLettersTex = useLoader(
    THREE.TextureLoader,
    authorizeInactiveLetters
  );
  const activeLettersTex = useLoader(
    THREE.TextureLoader,
    authorizeActiveLetters
  );

  const authorizeUserMatrixIndices = useStore(
    (state) => state.authorizeUserMatrixIndices
  );

  const bgLettersRef = useRef<THREE.Object3D>();

  const activeLetterMap = useMemo(() => {
    activeLettersTex.wrapT = activeLettersTex.wrapS = THREE.RepeatWrapping;
    activeLettersTex.repeat.set(0.06, 0.2);
    activeLettersTex.offset.x = 0.0775 * authorizeUserMatrixIndices.colIdx;
    activeLettersTex.offset.y = -0.2 - 0.2 * authorizeUserMatrixIndices.rowIdx;
    return activeLettersTex;
  }, [
    activeLettersTex,
    authorizeUserMatrixIndices.colIdx,
    authorizeUserMatrixIndices.rowIdx,
  ]);

  useEffect(() => {
    if (bgLettersRef.current) {
      bgLettersRef.current.position.y =
        -0.7 + 0.25 * authorizeUserMatrixIndices.rowIdx;
      bgLettersRef.current.position.x =
        3.35 - 0.3 * authorizeUserMatrixIndices.colIdx;
    }
  }, [authorizeUserMatrixIndices.colIdx, authorizeUserMatrixIndices.rowIdx]);

  const playerName = useStore((state) => state.playerName.split(""));

  return (
    <>
      {props.visible && (
        <>
          <sprite
            scale={[3.5, 0.01, 0]}
            position={[0.5, 1.1, 0]}
            renderOrder={2}
          >
            <spriteMaterial
              map={authorizeHeaderUnderlineTex}
              attach="material"
              transparent={true}
            />
          </sprite>
          <sprite
            scale={[2.2 * 0.9, 0.15 * 0.9, 0]}
            position={[1, 1, 0]}
            renderOrder={2}
          >
            <spriteMaterial
              map={authorizeStartToFinishTex}
              attach="material"
              transparent={true}
            />
          </sprite>

          <sprite
            scale={[0.85, 0.65, 0]}
            position={[0.35, -0.1, 0]}
            renderOrder={3}
          >
            <spriteMaterial
              map={authorizeGlassTex}
              attach="material"
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
              map={authorizeOrangeSquareTex}
              attach="material"
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
            {playerName.map((char, idx) => (
              <StaticJpCharacter char={char} charIdx={idx} key={idx} />
            ))}
          </group>
          <sprite
            scale={[2, 0.01, 0]}
            position={[-1.06, -0.42, 0]}
            renderOrder={2}
          >
            <spriteMaterial
              map={authorizeGlassUnderlineTex}
              attach="material"
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
                map={authorizeInactiveLettersTex}
                attach="material"
                transparent={true}
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
                attach="material"
                transparent={true}
                depthTest={false}
              />
            </mesh>
            <mesh position={[1.54, -0.13, 0]} renderOrder={1}>
              <circleBufferGeometry attach="geometry" args={[0.221, 32]} />
              <meshBasicMaterial
                attach="material"
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
