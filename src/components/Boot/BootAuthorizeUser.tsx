import React, { useCallback, useMemo, useRef } from "react";
import authorizeHeaderUnderline from "../../static/sprite/authorize_header_underline.png";
import authorizeGlass from "../../static/sprite/authorize_glass.png";
import authorizeGlassUnderline from "../../static/sprite/authorize_glass_underline.png";
import authorizeOrangeSquare from "../../static/sprite/authorize_orange_square.png";
import authorizeStartToFinish from "../../static/sprite/authorize_start_to_finish.png";
import authorizeInactiveLetters from "../../static/sprite/authorize_inactive_letters.png";
import authorizeActiveLetters from "../../static/sprite/authorize_active_letters.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useBootStore } from "../../store";
import { OrbitControls } from "@react-three/drei";

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
  const authorizeActiveLettersTex = useLoader(
    THREE.TextureLoader,
    authorizeActiveLetters
  );

  const backgroundLettersPos = useBootStore((state) => state.bgLettersPos);
  const activeLetterTextureOffset = useBootStore(
    (state) => state.activeLetterTextureOffset
  );

  const authorizeActiveLettersMap = useMemo(() => {
    authorizeActiveLettersTex.wrapT = authorizeActiveLettersTex.wrapS =
      THREE.RepeatWrapping;
    authorizeActiveLettersTex.repeat.set(0.06, 0.2);
    authorizeActiveLettersTex.offset.x = activeLetterTextureOffset.x;
    authorizeActiveLettersTex.offset.y = activeLetterTextureOffset.y;

    return authorizeActiveLettersTex;
  }, [activeLetterTextureOffset, authorizeActiveLettersTex]);

  const t = useBootStore(
    (state) => state.componentMatrixIndices.authorize_user
  );

  return (
    <>
      <OrbitControls />
      {props.visible ? (
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
            position={[-0.2, -0.3, 0]}
            renderOrder={3}
          >
            <spriteMaterial
              map={authorizeOrangeSquareTex}
              attach="material"
              transparent={true}
              depthTest={false}
            />
          </sprite>

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
              renderOrder={-1}
              position={[backgroundLettersPos.x, backgroundLettersPos.y, 0]}
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
                map={authorizeActiveLettersMap}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default BootAuthorizeUser;
