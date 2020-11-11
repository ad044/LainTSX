import React, { useEffect, useMemo, useState } from "react";
import authorizeHeaderUnderline from "../../static/sprite/authorize_header_underline.png";
import authorizeGlass from "../../static/sprite/authorize_glass.png";
import authorizeGlassUnderline from "../../static/sprite/authorize_glass_underline.png";
import authorizeOrangeSquare from "../../static/sprite/authorize_orange_square.png";
import authorizeStartToFinish from "../../static/sprite/authorize_start_to_finish.png";
import authorizeInactiveLetters from "../../static/sprite/authorize_inactive_letters.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";

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

  return (
    <>
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
            />
          </sprite>

          <mesh
            scale={[5 * 1.5, 1.28 * 1.5, 0]}
            position={[-1.06, -0.42, 0]}
            rotation={[-0.8, 0, -0.3]}
            renderOrder={-1}
          >
            <planeBufferGeometry attach="geometry" />
            <meshBasicMaterial
              map={authorizeInactiveLettersTex}
              attach="material"
              transparent={true}
            />
          </mesh>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BootAuthorizeUser;
