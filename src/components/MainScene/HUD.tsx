import React, { memo, useEffect, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../static/sprite/big_hud.png";
import longHud from "../../static/sprite/long_hud.png";
import boringHud from "../../static/sprite/long_hud_boring.png";
import { useStore } from "../../store";
import lerp from "../../utils/lerp";
import GreenTextRenderer from "../TextRenderer/GreenTextRenderer";
import usePrevious from "../../hooks/usePrevious";
import { getNodeHud } from "../../helpers/node-helpers";

export type HUDType = {
  mirrored: number;
  long: {
    position: number[];
    initial_position: number[];
  };
  boring: {
    position: number[];
    initial_position: number[];
  };
  big: {
    position: number[];
    initial_position: number[];
  };
  big_text: number[];
  medium_text: {
    position: number[];
    initial_position: number[];
  };
};

const HUD = memo(() => {
  const activeRef = useRef(true);
  const currentHudRef = useRef(
    getNodeHud(useStore.getState().activeNode.matrixIndices!)
  );
  const activeNodeMatrixIndices = useStore(
    (state) => state.activeNode.matrixIndices
  );
  const siteRotY = useStore((state) => state.siteRot[1]);
  const activeLevel = useStore((state) => state.activeLevel);
  const subscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.currentScene);
  const prevData = usePrevious({ siteRotY, activeLevel, subscene, scene });

  const lerpObject = (
    obj: THREE.Object3D,
    posX: number,
    initialPosX: number
  ) => {
    obj.position.x = lerp(
      obj.position.x,
      activeRef.current ? posX : initialPosX,
      0.12
    );
  };

  // this part is imperative because it performs a lot better than having a toggleable spring.
  useFrame(() => {
    if (
      longHudRef.current &&
      bigHudRef.current &&
      boringHudRef.current &&
      greenTextRef.current
    ) {
      const hud = currentHudRef.current;
      lerpObject(
        longHudRef.current,
        hud.long.position[0],
        hud.long.initial_position[0]
      );
      lerpObject(
        boringHudRef.current,
        hud.boring.position[0],
        hud.boring.initial_position[0]
      );
      lerpObject(
        bigHudRef.current,
        hud.big.position[0],
        hud.big.initial_position[0]
      );
      lerpObject(
        greenTextRef.current,
        hud.medium_text.position[0],
        hud.medium_text.initial_position[0]
      );
    }
  });

  useEffect(() => {
    const mirror = () => {
      longHudRef.current!.scale.x = -Math.abs(longHudRef.current!.scale.x);
      boringHudRef.current!.scale.x = -Math.abs(boringHudRef.current!.scale.x);
      bigHudRef.current!.scale.x = -Math.abs(bigHudRef.current!.scale.x);
    };

    const unMirror = () => {
      longHudRef.current!.scale.x = Math.abs(longHudRef.current!.scale.x);
      boringHudRef.current!.scale.x = Math.abs(boringHudRef.current!.scale.x);
      bigHudRef.current!.scale.x = Math.abs(bigHudRef.current!.scale.x);
    };

    const setPos = (hud: HUDType, pos: string) => {
      longHudRef.current!.position.set(
        ...(hud.long[pos as keyof typeof hud.long] as [number, number, number])
      );
      boringHudRef.current!.position.set(
        ...(hud.boring[pos as keyof typeof hud.boring] as [
          number,
          number,
          number
        ])
      );
      bigHudRef.current!.position.set(
        ...(hud.big[pos as keyof typeof hud.big] as [number, number, number])
      );
      greenTextRef.current!.position.set(
        ...(hud.medium_text[pos as keyof typeof hud.medium_text] as [
          number,
          number,
          number
        ])
      );
    };

    if (activeRef.current !== undefined) {
      const hud = getNodeHud(activeNodeMatrixIndices!);
      if (
        !(scene === "main" && prevData?.scene === "main") ||
        (subscene === "site" && prevData?.subscene === "pause") ||
        subscene === "pause"
      ) {
        // set to final pos instantly
        setPos(hud, "position");
      } else {
        if (
          prevData?.siteRotY !== siteRotY ||
          prevData?.activeLevel !== activeLevel ||
          subscene === "level_selection"
        ) {
          activeRef.current = false;
        } else {
          const wasHidden = !activeRef.current;
          activeRef.current = false;
          setTimeout(
            () => {
              // set to initial pos instantly while its hidden
              setPos(hud, "initial_position");
              if (hud.mirrored) {
                mirror();
              } else {
                unMirror();
              }
              currentHudRef.current = hud;
              activeRef.current = true;
            },
            wasHidden ? 0 : 500
          );
        }
      }
    }
  }, [
    activeLevel,
    activeNodeMatrixIndices,
    prevData?.activeLevel,
    prevData?.scene,
    prevData?.siteRotY,
    prevData?.subscene,
    scene,
    siteRotY,
    subscene,
  ]);

  const longHudRef = useRef<THREE.Object3D>();
  const boringHudRef = useRef<THREE.Object3D>();
  const bigHudRef = useRef<THREE.Object3D>();
  const greenTextRef = useRef<THREE.Object3D>();

  const longHudTex = useLoader(THREE.TextureLoader, longHud);
  const boringHudTex = useLoader(THREE.TextureLoader, boringHud);
  const bigHudTex = useLoader(THREE.TextureLoader, bigHud);

  return (
    <group position={[0, 0, 10]}>
      <mesh
        scale={[1, 0.03, 1]}
        renderOrder={2}
        ref={longHudRef}
        position-z={-8.6}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={longHudTex}
          transparent={true}
          depthTest={false}
        />
      </mesh>
      <mesh
        scale={[1, 0.03, 1]}
        renderOrder={2}
        ref={boringHudRef}
        position-z={-8.6}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={boringHudTex}
          transparent={true}
          depthTest={false}
        />
      </mesh>
      <mesh
        scale={[0.5, 0.06, 1]}
        renderOrder={2}
        ref={bigHudRef}
        position-z={-8.6}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={bigHudTex}
          transparent={true}
          depthTest={false}
        />
      </mesh>
      <group position-z={-8.7} scale={[0.02, 0.035, 0.02]} ref={greenTextRef}>
        <GreenTextRenderer />
      </group>
    </group>
  );
});

export default HUD;
