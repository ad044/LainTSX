import React, { memo, useEffect, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../static/sprites/main/big_hud.png";
import longHud from "../../static/sprites/main/long_hud.png";
import boringHud from "../../static/sprites/main/boring_hud.png";
import { useStore } from "../../store";
import lerp from "../../utils/lerp";
import GreenTextRenderer from "../TextRenderer/GreenTextRenderer";
import usePrevious from "../../hooks/usePrevious";
import { getNodeHud } from "../../helpers/node-helpers";
import { HUDData } from "../../types/types";

// the hud is an imperative mess. unfortunately this seems to perform by far the best out of all the approaches i've tried.

const HUD = memo(() => {
  const activeRef = useRef(true);
  const currentHudRef = useRef(
    getNodeHud(useStore.getState().activeNode.matrixIndices!)
  );
  const activeNode = useStore((state) => state.activeNode);
  const siteRotY = useStore((state) => state.siteRot[1]);
  const activeLevel = useStore((state) => state.activeLevel);
  const subscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.currentScene);
  const protocolLinesToggled = useStore((state) => state.protocolLinesToggled);
  const prevData = usePrevious({
    siteRotY,
    activeLevel,
    subscene,
    scene,
    protocolLinesToggled,
  });

  const longHudRef = useRef<THREE.Object3D>();
  const boringHudRef = useRef<THREE.Object3D>();
  const bigHudRef = useRef<THREE.Object3D>();
  const nodeTitleRef = useRef<THREE.Object3D>();
  const protocolLine1Ref = useRef<THREE.Object3D>();
  const protocolLine2Ref = useRef<THREE.Object3D>();
  const protocolLine3Ref = useRef<THREE.Object3D>();

  const protocolLineTitleRefs = useRef([
    useRef<THREE.Object3D>(),
    useRef<THREE.Object3D>(),
    useRef<THREE.Object3D>(),
  ]);

  useFrame(() => {
    if (longHudRef.current && bigHudRef.current && boringHudRef.current) {
      const hud = currentHudRef.current;

      longHudRef.current.position.x = lerp(
        longHudRef.current.position.x,
        activeRef.current ? hud.long.position[0] : hud.long.initial_position[0],
        0.12
      );
      boringHudRef.current.position.x = lerp(
        boringHudRef.current.position.x,
        activeRef.current
          ? hud.boring.position[0]
          : hud.boring.initial_position[0],
        0.12
      );
      bigHudRef.current.position.x = lerp(
        bigHudRef.current.position.x,
        activeRef.current ? hud.big.position[0] : hud.big.initial_position[0],
        0.12
      );
    }
  });

  useEffect(() => {
    const mirror = () => {
      longHudRef.current!.scale.x = -Math.abs(longHudRef.current!.scale.x);
      boringHudRef.current!.scale.x = -Math.abs(boringHudRef.current!.scale.x);
      bigHudRef.current!.scale.x = -Math.abs(bigHudRef.current!.scale.x);
      nodeTitleRef.current!.scale.x = -Math.abs(nodeTitleRef.current!.scale.x);
      nodeTitleRef.current!.position.x = 0.2;

      if (protocolLinesToggled) {
        protocolLineTitleRefs.current.forEach((ref) => {
          ref.current!.scale.x = -Math.abs(ref.current!.scale.x);
          ref.current!.position.x = 0.2;
        });
      }
    };

    const unMirror = () => {
      longHudRef.current!.scale.x = Math.abs(longHudRef.current!.scale.x);
      boringHudRef.current!.scale.x = Math.abs(boringHudRef.current!.scale.x);
      bigHudRef.current!.scale.x = Math.abs(bigHudRef.current!.scale.x);
      nodeTitleRef.current!.scale.x = Math.abs(nodeTitleRef.current!.scale.x);
      nodeTitleRef.current!.position.x = -0.2;

      if (protocolLinesToggled) {
        protocolLineTitleRefs.current.forEach((ref) => {
          ref.current!.scale.x = Math.abs(ref.current!.scale.x);
          ref.current!.position.x = -0.2;
        });
      }
    };

    const setPos = (hud: HUDData, pos: string) => {
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
      if (
        protocolLine1Ref.current &&
        protocolLine2Ref.current &&
        protocolLine3Ref.current
      ) {
        protocolLine1Ref.current.position.set(
          ...(hud.big.protocol_line_positions[0] as [number, number, number])
        );
        protocolLine2Ref.current.position.set(
          ...(hud.big.protocol_line_positions[1] as [number, number, number])
        );
        protocolLine3Ref.current.position.set(
          ...(hud.big.protocol_line_positions[2] as [number, number, number])
        );
      }
    };

    if (activeRef.current !== undefined) {
      const hud = getNodeHud(activeNode.matrixIndices!);
      if (
        !(scene === "main" && prevData?.scene === "main") ||
        (subscene === "site" && prevData?.subscene === "pause") ||
        subscene === "pause" ||
        protocolLinesToggled !== prevData?.protocolLinesToggled
      ) {
        // set to final pos instantly
        setPos(hud, "position");
        if (hud.mirrored) mirror();
        else unMirror();
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

              if (hud.mirrored) mirror();
              else unMirror();

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
    prevData?.activeLevel,
    prevData?.scene,
    prevData?.siteRotY,
    prevData?.subscene,
    prevData?.protocolLinesToggled,
    scene,
    siteRotY,
    subscene,
    protocolLinesToggled,
    activeNode.matrixIndices,
    activeNode.node_name,
  ]);
  const longHudTex = useLoader(THREE.TextureLoader, longHud);
  const boringHudTex = useLoader(THREE.TextureLoader, boringHud);
  const bigHudTex = useLoader(THREE.TextureLoader, bigHud);

  return (
    <group position={[0, 0, 10]}>
      <mesh scale={[1, 0.03, 1]} renderOrder={2} ref={longHudRef}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={longHudTex}
          transparent={true}
          depthTest={false}
        />
      </mesh>
      <mesh scale={[1, 0.03, 1]} renderOrder={2} ref={boringHudRef}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={boringHudTex}
          transparent={true}
          depthTest={false}
        />
      </mesh>
      <group ref={bigHudRef}>
        <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
          <planeBufferGeometry attach="geometry" />
          <meshBasicMaterial
            attach="material"
            map={bigHudTex}
            transparent={true}
            depthTest={false}
          />
        </mesh>
        <group ref={nodeTitleRef} scale={[0.016, 0.03, 0.016]}>
          <GreenTextRenderer textToRender={activeNode.title.split("")} />
        </group>
        {protocolLinesToggled && (
          <>
            <group ref={protocolLine1Ref}>
              <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
                <planeBufferGeometry attach="geometry" />
                <meshBasicMaterial
                  attach="material"
                  map={bigHudTex}
                  transparent={true}
                  depthTest={false}
                />
              </mesh>
              <group
                scale={[0.016, 0.03, 0.016]}
                ref={protocolLineTitleRefs.current[0]}
              >
                <GreenTextRenderer
                  textToRender={activeNode.protocol_lines["1"].split("")}
                />
              </group>
            </group>
            <group ref={protocolLine2Ref}>
              <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
                <planeBufferGeometry attach="geometry" />
                <meshBasicMaterial
                  attach="material"
                  map={bigHudTex}
                  transparent={true}
                  depthTest={false}
                />
              </mesh>
              <group
                scale={[0.016, 0.03, 0.016]}
                ref={protocolLineTitleRefs.current[1]}
              >
                <GreenTextRenderer
                  textToRender={activeNode.protocol_lines["2"].split("")}
                />
              </group>
            </group>

            <group ref={protocolLine3Ref}>
              <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
                <planeBufferGeometry attach="geometry" />
                <meshBasicMaterial
                  attach="material"
                  map={bigHudTex}
                  transparent={true}
                  depthTest={false}
                />
              </mesh>
              <group
                scale={[0.016, 0.03, 0.016]}
                ref={protocolLineTitleRefs.current[2]}
              >
                <GreenTextRenderer
                  textToRender={activeNode.protocol_lines["3"].split("")}
                />
              </group>
            </group>
          </>
        )}
      </group>
    </group>
  );
});

export default HUD;
