import orangeFont from "../../static/sprites/fonts/orange_jp_font.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import jp_font_json from "../../resources/fonts/jp_font.json";
import React, { memo, useMemo } from "react";

const StaticJpCharacter = memo((props: { char: string; charIdx: number }) => {
  const colorTexture: THREE.Texture = useLoader(
    THREE.TextureLoader,
    orangeFont
  );
  const charData = useMemo(
    () => jp_font_json.glyphs[props.char as keyof typeof jp_font_json.glyphs],
    [props.char]
  );

  const geom = useMemo(() => {
    const geometry = new THREE.PlaneBufferGeometry();

    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * charData[2]) / 240 + charData[0] / 240;

      v = (v * charData[3]) / 96 + (1 - charData[1] / 96 - 16 / 96);

      uvAttribute.setXY(i, u, v);
    }
    return geometry;
  }, [charData]);

  return (
    <mesh
      position={[props.charIdx / 5, 0, 0]}
      scale={[0.2, 0.2, 0]}
      geometry={geom}
      renderOrder={205}
    >
      <meshBasicMaterial
        map={colorTexture}
        attach="material"
        transparent={true}
        side={THREE.FrontSide}
        depthTest={false}
      />
    </mesh>
  );
});

export default StaticJpCharacter;
