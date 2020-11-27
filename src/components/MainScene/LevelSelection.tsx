import React, { useCallback, useEffect, useMemo } from "react";
import level_selection_font from "../../static/sprite/select_level_font.png";
import verticalHud from "../../static/sprite/select_level_hud_vertical.png";
import horizontalHud from "../../static/sprite/select_level_hud_horizontal.png";
import levelSelectionText from "../../static/sprite/select_level_text.png";
import upArrow from "../../static/sprite/select_level_up_arrow.png";
import downArrow from "../../static/sprite/select_level_down_arrow.png";
import { useLevelSelectionStore } from "../../store";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";

const LevelSelection = () => {
  const levelSelectionFontTex = useLoader(
    THREE.TextureLoader,
    level_selection_font
  );
  const verticalHudTex = useLoader(THREE.TextureLoader, verticalHud);
  const horizontalHudTex = useLoader(THREE.TextureLoader, horizontalHud);
  const levelSelectionTextTex = useLoader(
    THREE.TextureLoader,
    levelSelectionText
  );
  const upArrowTex = useLoader(THREE.TextureLoader, upArrow);
  const downArrowTex = useLoader(THREE.TextureLoader, downArrow);

  const selectedLevelIdx = useLevelSelectionStore(
    (state) => state.selectedLevelIdx
  );

  const selectedLevel = useLevelSelectionStore(
    useCallback((state) => state.availableLevels[selectedLevelIdx], [
      selectedLevelIdx,
    ])
  )
    .toString()
    .padStart(2, "0");

  const levelSelectionToggled = useLevelSelectionStore(
    (state) => state.levelSelectionToggled
  );

  const { levelSelectionToggle } = useSpring({
    levelSelectionToggle: levelSelectionToggled,
    config: { duration: 500 },
  });

  const verticalHudPosY = levelSelectionToggle.to([0, 1], [-2.5, 0]);
  const horizontalHudPosX = levelSelectionToggle.to([0, 1], [-4, -0.6]);

  const generateGeom = useCallback((number: number) => {
    const geometry = new THREE.PlaneBufferGeometry();

    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * 22) / 240 + number / 10;

      uvAttribute.setXY(i, u, v);
    }
    return geometry;
  }, []);

  return (
    <>
      <a.group position-y={verticalHudPosY} renderOrder={5}>
        <mesh
          scale={[0.3, 0.4, 0]}
          position={[0.95, 0, 0]}
          renderOrder={5}
          geometry={generateGeom(parseInt(selectedLevel[0]))}
        >
          <meshBasicMaterial
            map={levelSelectionFontTex}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </mesh>
        <mesh
          scale={[0.3, 0.4, 0]}
          position={[1.23, 0, 0]}
          renderOrder={5}
          geometry={generateGeom(parseInt(selectedLevel[1]))}
        >
          <meshBasicMaterial
            map={levelSelectionFontTex}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </mesh>

        <sprite scale={[0.65, 3, 0]} position={[1.1, -0.8, 0]} renderOrder={4}>
          <spriteMaterial
            map={verticalHudTex}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </sprite>
        <sprite scale={[0.5, 0.12, 0]} position={[1.1, 0.3, 0]} renderOrder={4}>
          <spriteMaterial
            map={levelSelectionTextTex}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </sprite>
        <sprite
          scale={[0.3, 0.15, 0]}
          position={[1.1, -0.35, 0]}
          renderOrder={4}
        >
          <spriteMaterial
            map={downArrowTex}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </sprite>
        <sprite scale={[0.3, 0.15, 0]} position={[1.1, 0.5, 0]} renderOrder={4}>
          <spriteMaterial
            map={upArrowTex}
            attach="material"
            transparent={true}
            depthTest={false}
          />
        </sprite>
      </a.group>

      <a.sprite
        scale={[3, 0.3, 0]}
        position={[-0.6, 0, 0]}
        renderOrder={4}
        position-x={horizontalHudPosX}
      >
        <spriteMaterial
          map={horizontalHudTex}
          attach="material"
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
    </>
  );
};

export default LevelSelection;
