import React, { useEffect, useRef } from "react";
import level_selection_font from "../../static/sprites/main/select_level_font.png";
import verticalHud from "../../static/sprites/main/select_level_hud_vertical.png";
import horizontalHud from "../../static/sprites/main/select_level_hud_horizontal.png";
import levelSelectionText from "../../static/sprites/main/select_level_text.png";
import upArrow from "../../static/sprites/main/select_level_up_arrow.png";
import downArrow from "../../static/sprites/main/select_level_down_arrow.png";
import upArrowActive from "../../static/sprites/main/select_level_up_arrow_active.png";
import downArrowActive from "../../static/sprites/main/select_level_down_arrow_active.png";
import { useStore } from "../../store";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import usePrevious from "../../hooks/usePrevious";

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
  const upArrowActiveTex = useLoader(THREE.TextureLoader, upArrowActive);
  const downArrowActiveTex = useLoader(THREE.TextureLoader, downArrowActive);

  const selectedLevel = useStore((state) => state.selectedLevel)
    .toString()
    .padStart(2, "0");
  const activeLevel = useStore((state) => state.activeLevel);
  const subscene = useStore((state) => state.mainSubscene);
  const prevData = usePrevious({ subscene, selectedLevel });

  const [pos, set] = useSpring(() => ({
    vertPosY: -2.5,
    horizPosX: -4,
    config: { duration: 500 },
  }));

  const fstNumberRef = useRef<THREE.Mesh>();
  const sndNumberRef = useRef<THREE.Mesh>();
  const upArrowRef = useRef<THREE.Sprite>();
  const downArrowRef = useRef<THREE.Sprite>();

  useEffect(() => {
    const generateGeom = (number: number) => {
      const geometry = new THREE.PlaneBufferGeometry();

      const uvAttribute = geometry.attributes.uv;

      for (let i = 0; i < uvAttribute.count; i++) {
        let u = uvAttribute.getX(i);
        let v = uvAttribute.getY(i);

        u = (u * 22) / 240 + number / 10;

        uvAttribute.setXY(i, u, v);
      }
      return geometry;
    };

    if (subscene === "level_selection") {
      set({ vertPosY: 0, horizPosX: -0.6 });
      if (fstNumberRef.current && sndNumberRef.current) {
        fstNumberRef.current.geometry = generateGeom(parseInt(activeLevel[0]));
        sndNumberRef.current.geometry = generateGeom(parseInt(activeLevel[1]));
      }
    } else if (
      subscene === "site" &&
      prevData?.subscene === "level_selection"
    ) {
      set({ vertPosY: -2.5, horizPosX: -4 });
    }
    if (selectedLevel !== prevData?.selectedLevel) {
      if (fstNumberRef.current && sndNumberRef.current) {
        fstNumberRef.current.geometry = generateGeom(
          parseInt(selectedLevel[0])
        );
        sndNumberRef.current.geometry = generateGeom(
          parseInt(selectedLevel[1])
        );

        if (
          prevData?.selectedLevel &&
          upArrowRef.current &&
          downArrowRef.current
        ) {
          if (selectedLevel > prevData?.selectedLevel) {
            upArrowRef.current.material.map = upArrowActiveTex;
            upArrowRef.current.material.needsUpdate = true;

            setTimeout(() => {
              upArrowRef.current!.material.map = upArrowTex;
              upArrowRef.current!.material.needsUpdate = true;
            }, 100);
          } else if (selectedLevel < prevData?.selectedLevel) {
            downArrowRef.current.material.map = downArrowActiveTex;
            downArrowRef.current.material.needsUpdate = true;

            setTimeout(() => {
              downArrowRef.current!.material.map = downArrowTex;
              downArrowRef.current!.material.needsUpdate = true;
            }, 100);
          }
        }
      }
    }
  }, [
    activeLevel,
    downArrowActiveTex,
    downArrowTex,
    prevData?.selectedLevel,
    prevData?.subscene,
    selectedLevel,
    set,
    subscene,
    upArrowActiveTex,
    upArrowTex,
  ]);

  return (
    <>
      <a.group position-y={pos.vertPosY} renderOrder={5}>
        <mesh
          scale={[0.3, 0.4, 0]}
          position={[0.95, 0, 0]}
          renderOrder={5}
          ref={fstNumberRef}
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
          ref={sndNumberRef}
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
          ref={downArrowRef}
        >
          <spriteMaterial
            map={downArrowTex}
            attach="material"
            transparent={true}
            depthTest={false}
            color={0xffffff}
          />
        </sprite>
        <sprite
          scale={[0.3, 0.15, 0]}
          position={[1.1, 0.5, 0]}
          renderOrder={4}
          ref={upArrowRef}
        >
          <spriteMaterial
            map={upArrowTex}
            attach="material"
            transparent={true}
            depthTest={false}
            color={0xffffff}
          />
        </sprite>
      </a.group>

      <a.sprite
        scale={[3, 0.3, 0]}
        position={[-0.6, 0, 0]}
        renderOrder={4}
        position-x={pos.horizPosX}
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
