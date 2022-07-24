import React, { useCallback, useEffect, useRef } from "react";
import { useStore } from "@/store";
import { a, useSpring } from "@react-spring/three";
import usePrevious from "@/hooks/usePrevious";
import { MainSubscene, Position } from "@/types";
import { useTexture } from "@react-three/drei";
import { getLevelDigits, getLevelLimit } from "@/utils/site";
import { PlaneBufferGeometry } from "three";

const LevelSelection = () => {
  const levelSelectionFont = useTexture("/sprites/main/select_level_font.png");
  const verticalHud = useTexture("/sprites/main/select_level_hud_vertical.png");
  const horizontalHud = useTexture(
    "/sprites/main/select_level_hud_horizontal.png"
  );
  const levelSelectionText = useTexture("/sprites/main/select_level_text.png");
  const upArrow = useTexture("/sprites/main/select_level_up_arrow.png");
  const downArrow = useTexture("/sprites/main/select_level_down_arrow.png");
  const upArrowActive = useTexture(
    "/sprites/main/select_level_up_arrow_active.png"
  );
  const downArrowActive = useTexture(
    "/sprites/main/select_level_down_arrow_active.png"
  );

  const selectedLevel = useStore((state) => state.selectedLevel);
  const activeLevel = useStore((state) => state.level);
  const subscene = useStore((state) => state.mainSubscene);
  const prev = usePrevious({ subscene, selectedLevel });

  const [positionSpring, setPositionSpring] = useSpring<{
    vertical: Position;
    horizontal: Position;
  }>(() => ({
    vertical: [0, -2.5, 0],
    horizontal: [-4, 0, 0],
    config: { duration: 500 },
  }));

  const firstNumRef = useRef<THREE.Mesh>(null);
  const secondNumRef = useRef<THREE.Mesh>(null);
  const upArrowRef = useRef<THREE.Sprite>(null);
  const downArrowRef = useRef<THREE.Sprite>(null);

  const upperLimit = useStore((state) => getLevelLimit(state.site));

  const toggleArrow = (
    ref: React.RefObject<THREE.Sprite>,
    normalTexture: THREE.Texture,
    activeTexture: THREE.Texture
  ) => {
    if (!ref.current) {
      return;
    }
    ref.current.material.map = activeTexture;
    ref.current.material.needsUpdate = true;

    setTimeout(() => {
      if (ref.current) {
        ref.current.material.map = normalTexture;
        ref.current.material.needsUpdate = true;
      }
    }, 100);
  };

  const updateLevelDisplay = useCallback((level: number) => {
    const generateGeom = (number: number) => {
      const geometry = new PlaneBufferGeometry();

      const uvAttribute = geometry.attributes.uv;

      for (let i = 0; i < uvAttribute.count; i++) {
        let u = uvAttribute.getX(i);
        let v = uvAttribute.getY(i);

        u = (u * 22) / 240 + number / 10;

        uvAttribute.setXY(i, u, v);
      }
      return geometry;
    };

    const [firstDigit, secondDigit] = getLevelDigits(level);

    if (firstNumRef.current) {
      firstNumRef.current.geometry = generateGeom(firstDigit);
    }

    if (secondNumRef.current) {
      secondNumRef.current.geometry = generateGeom(secondDigit);
    }
  }, []);

  useEffect(() => {
    if (subscene === MainSubscene.LevelSelection) {
      setPositionSpring({ vertical: [0, 0, 0], horizontal: [-0.6, 0, 0] });
      if (firstNumRef.current && secondNumRef.current) {
        updateLevelDisplay(activeLevel);
      }
    } else if (
      subscene === MainSubscene.Site &&
      prev?.subscene === MainSubscene.LevelSelection
    ) {
      setPositionSpring({ vertical: [0, -2.5, 0], horizontal: [-4, 0, 0] });
    }
  }, [
    activeLevel,
    prev?.subscene,
    setPositionSpring,
    subscene,
    updateLevelDisplay,
  ]);

  useEffect(() => {
    if (!prev?.selectedLevel || prev.selectedLevel === selectedLevel) {
      return;
    }

    if (selectedLevel > prev?.selectedLevel) {
      toggleArrow(upArrowRef, upArrow, upArrowActive);
    } else if (selectedLevel < prev?.selectedLevel) {
      toggleArrow(downArrowRef, downArrow, downArrowActive);
    }

    updateLevelDisplay(selectedLevel);
  }, [
    downArrowActive,
    downArrow,
    prev?.selectedLevel,
    selectedLevel,
    upArrowActive,
    upArrow,
    updateLevelDisplay,
  ]);

  return (
    <>
      <a.group position={positionSpring.vertical} renderOrder={5}>
        <mesh
          scale={[0.3, 0.4, 0]}
          position={[0.95, 0, 0]}
          renderOrder={5}
          ref={firstNumRef}
        >
          <meshBasicMaterial
            map={levelSelectionFont}
            transparent={true}
            depthTest={false}
          />
        </mesh>
        <mesh
          scale={[0.3, 0.4, 0]}
          position={[1.23, 0, 0]}
          renderOrder={5}
          ref={secondNumRef}
        >
          <meshBasicMaterial
            map={levelSelectionFont}
            transparent={true}
            depthTest={false}
          />
        </mesh>

        <sprite scale={[0.65, 3, 0]} position={[1.1, -0.8, 0]} renderOrder={4}>
          <spriteMaterial
            map={verticalHud}
            transparent={true}
            depthTest={false}
          />
        </sprite>
        <sprite scale={[0.5, 0.12, 0]} position={[1.1, 0.3, 0]} renderOrder={4}>
          <spriteMaterial
            map={levelSelectionText}
            transparent={true}
            depthTest={false}
          />
        </sprite>
        <sprite
          scale={[0.3, 0.15, 0]}
          position={[1.1, -0.35, 0]}
          renderOrder={4}
          visible={selectedLevel !== 1}
          ref={downArrowRef}
        >
          <spriteMaterial
            map={downArrow}
            transparent={true}
            depthTest={false}
            color={0xffffff}
          />
        </sprite>
        <sprite
          scale={[0.3, 0.15, 0]}
          position={[1.1, 0.5, 0]}
          visible={selectedLevel !== upperLimit}
          renderOrder={4}
          ref={upArrowRef}
        >
          <spriteMaterial
            map={upArrow}
            transparent={true}
            depthTest={false}
            color={0xffffff}
          />
        </sprite>
      </a.group>

      <a.sprite
        scale={[3, 0.3, 0]}
        renderOrder={4}
        position={positionSpring.horizontal}
      >
        <spriteMaterial
          map={horizontalHud}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
    </>
  );
};

export default LevelSelection;
