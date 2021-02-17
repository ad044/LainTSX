import React, { memo } from "react";
import ssknBackground from "../../static/sprite/sskn_background.png";
import ssknBackgroundText from "../../static/sprite/sskn_background_text.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import ssknTopLabel from "../../static/sprite/sskn_top_label.png";
import ssknDango from "../../static/sprite/sskn_dango.png";

const SsknBackground = memo(() => {
  const ssknBackgroundTex = useLoader(THREE.TextureLoader, ssknBackground);
  const ssknBackgroundTextTex = useLoader(
    THREE.TextureLoader,
    ssknBackgroundText
  );
  const ssknTopLabelTex = useLoader(THREE.TextureLoader, ssknTopLabel);
  const ssknDangoTex = useLoader(THREE.TextureLoader, ssknDango);

  return (
    <>
      <mesh scale={[5, 6.4, 0]} position={[-0.25, -0.5, 0]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={ssknBackgroundTex}
          transparent={true}
        />
      </mesh>
      <sprite scale={[4.5, 2.5, 0]} position={[2.2, 0, 0]} renderOrder={3}>
        <spriteMaterial
          attach="material"
          map={ssknBackgroundTextTex}
          transparent={true}
          opacity={0.5}
        />
      </sprite>
      <sprite position={[-3, 3, 0]} scale={[3.5, 0.4, 0]} renderOrder={4}>
        <spriteMaterial attach="material" map={ssknDangoTex} opacity={0.5} />
      </sprite>
      <sprite position={[3.5, 3, 0]} scale={[2, 0.5, 0]}>
        <spriteMaterial attach="material" map={ssknTopLabelTex} />
      </sprite>
    </>
  );
});

export default SsknBackground;
