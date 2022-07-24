import React, { memo, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store";
import usePrevious from "@/hooks/usePrevious";
import { getNodeHud, isNodeVisible } from "@/utils/node";
import { HUDData, MainSubscene, Position, TextType } from "@/types";
import { useTexture } from "@react-three/drei";
import TextRenderer from "../TextRenderer/TextRenderer";
import AnimatedBigTextRenderer from "../TextRenderer/AnimatedBigTextRenderer";
import { MathUtils } from "three";
import {logError} from "@/utils/log";

// the hud is an imperative mess. unfortunately this seems to perform by far the best out of all the approaches i've tried.

const getInitialX = (pos: Position): number =>
  pos[0] > 0 ? pos[0] + 1 : pos[0] - 1;

const HUD = () => {
  const activeRef = useRef(true);
  const nodeMatrixIndex = useStore((state) => state.nodeMatrixIndex);
  const gameProgress = useStore((state) => state.gameProgress);
  const node = useStore((state) => state.node);
  const siteSegment = useStore((state) => state.siteSegment);
  const level = useStore((state) => state.level);
  const subscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.scene);
  const protocolLinesEnabled = useStore((state) => state.protocolLinesEnabled);
  const prev = usePrevious({
    siteSegment,
    level,
    subscene,
    scene,
    protocolLinesEnabled,
  });

  const long = useTexture("/sprites/main/long_hud.png");
  const boring = useTexture("/sprites/main/boring_hud.png");
  const big = useTexture("/sprites/main/big_hud.png");

  const currentHudRef = useRef(getNodeHud(nodeMatrixIndex));
  const longHudRef = useRef<THREE.Mesh>(null);
  const boringHudRef = useRef<THREE.Mesh>(null);
  const bigHudRef = useRef<THREE.Group>(null);
  const nodeTitleRef = useRef<THREE.Group>(null);

  const protocolLine1Ref = useRef<THREE.Group>(null);
  const protocolLine2Ref = useRef<THREE.Group>(null);
  const protocolLine3Ref = useRef<THREE.Group>(null);

  const protocolLineTitleRefs = useRef([
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ]);

  useFrame((_, delta) => {
    if (longHudRef.current && bigHudRef.current && boringHudRef.current) {
      const { long, boring, big } = currentHudRef.current;

      const toIterate: [React.RefObject<THREE.Mesh | THREE.Group>, Position][] =
        [
          [longHudRef, long],
          [boringHudRef, boring],
          [bigHudRef, big],
        ];

      toIterate.forEach(([ref, targetPos]) => {
        if (ref.current) {
          const targetX = targetPos[0];
          ref.current.position.x = MathUtils.lerp(
            ref.current.position.x,
            activeRef.current ? targetX : getInitialX(targetPos),
            7 * delta
          );
        }
      });
    }
  });

  const setHud = (hud: HUDData, initial?: boolean) => {
    if (
      !longHudRef.current ||
      !boringHudRef.current ||
      !bigHudRef.current ||
      !nodeTitleRef.current
    ) {
      return;
    }

    longHudRef.current.position.set(...hud.long);
    boringHudRef.current.position.set(...hud.boring);
    bigHudRef.current.position.set(...hud.big);
    if (initial) {
      longHudRef.current.position.x = getInitialX(hud.long);
      boringHudRef.current.position.x = getInitialX(hud.boring);
      bigHudRef.current.position.x = getInitialX(hud.big);
    }

    protocolLine1Ref.current?.position.set(...hud.protocol_line_positions[0]);
    protocolLine2Ref.current?.position.set(...hud.protocol_line_positions[1]);
    protocolLine3Ref.current?.position.set(...hud.protocol_line_positions[2]);

    longHudRef.current.scale.x =
      Math.abs(longHudRef.current.scale.x) * (hud.mirrored ? -1 : 1);
    boringHudRef.current.scale.x =
      Math.abs(boringHudRef.current.scale.x) * (hud.mirrored ? -1 : 1);
    bigHudRef.current.scale.x =
      Math.abs(bigHudRef.current.scale.x) * (hud.mirrored ? -1 : 1);
    nodeTitleRef.current.scale.x =
      Math.abs(nodeTitleRef.current.scale.x) * (hud.mirrored ? -1 : 1);
    nodeTitleRef.current.position.x = hud.mirrored ? 0.2 : -0.2;

    protocolLineTitleRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.scale.x =
          Math.abs(ref.current.scale.x) * (hud.mirrored ? -1 : 1);
        ref.current.position.x = hud.mirrored ? 0.2 : -0.2;
      }
    });
  };

  const [text, setText] = useState(node ? node.name : "Unknown");
  const [textType, setTextType] = useState<
    TextType.BigYellow | TextType.BigOrange
  >(TextType.BigYellow);
  const [textShrinked, setTextShrinked] = useState(false);
  const [textPos, setTextPos] = useState<Position>(
    getNodeHud(nodeMatrixIndex).text
  );

  // when to hide
  useEffect(() => {
    if (
      prev?.siteSegment !== siteSegment ||
      prev?.level !== level ||
      subscene === MainSubscene.LevelSelection
    ) {
      activeRef.current = false;
    }
  }, [level, prev?.level, prev?.siteSegment, siteSegment, subscene]);

  useEffect(() => {
    if (subscene === MainSubscene.LevelSelection) {
      // when entering level selection
      setTextShrinked(true);
      setTextType(TextType.BigOrange);
      setTimeout(() => setTextPos([-0.02, 0.005, -8.7]), 400);
      setTimeout(() => setText("JumpTo"), 1000);
      setTimeout(() => setTextShrinked(false), 1200);
    } else {
      // when exiting level selection
      setTextType(TextType.BigYellow);
    }
  }, [subscene]);

  // changing node matrix index
  useEffect(() => {
    if (subscene !== MainSubscene.Site) {
      return;
    }

    const hud = getNodeHud(nodeMatrixIndex);

    const wasHidden = !activeRef.current;
    activeRef.current = false;

    setTextShrinked(true);

    setTimeout(() => setTextPos(hud.text), 400);

    setTimeout(() => setTextShrinked(false), 1200);

    setTimeout(
      () => {
        setHud(hud, true);

        currentHudRef.current = hud;
        activeRef.current = true;
      },
      wasHidden ? 0 : 500
    );
  }, [nodeMatrixIndex, subscene]);

  // changing node
  useEffect(() => {
    if (subscene !== MainSubscene.Site) {
      return;
    }

    if (node !== null && isNodeVisible(node, gameProgress)) {
      setTimeout(() => setText(node.name), 1000);
    } else {
      setText("Unknown");
    }
  }, [node, gameProgress, subscene]);

  return (
    <group>
      <AnimatedBigTextRenderer
        position={textPos}
        text={text}
        shrinked={textShrinked}
        scale={[0.035, 0.055, 0.035]}
        type={textType}
      />
      <group position={[0, 0, 10]}>
        <mesh scale={[1, 0.03, 1]} renderOrder={2} ref={longHudRef}>
          <planeBufferGeometry attach="geometry" />
          <meshBasicMaterial map={long} transparent={true} depthTest={false} />
        </mesh>
        <mesh scale={[1, 0.03, 1]} renderOrder={2} ref={boringHudRef}>
          <planeBufferGeometry attach="geometry" />
          <meshBasicMaterial
            map={boring}
            transparent={true}
            depthTest={false}
          />
        </mesh>
        <group ref={bigHudRef}>
          <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
            <planeBufferGeometry attach="geometry" />
            <meshBasicMaterial map={big} transparent={true} depthTest={false} />
          </mesh>
          <group ref={nodeTitleRef} scale={[0.016, 0.03, 0.016]}>
            <TextRenderer
              type={TextType.MediumGreen}
              text={node ? node.title : ""}
              scale={[1.7, 1, 1.7]}
            />
          </group>
          {node &&
            protocolLinesEnabled &&
            node.protocol_lines[0] !== null &&
            node.protocol_lines[1] !== null &&
            node.protocol_lines[2] !== null && (
              <>
                <group ref={protocolLine1Ref}>
                  <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
                    <planeBufferGeometry attach="geometry" />
                    <meshBasicMaterial
                      map={big}
                      transparent={true}
                      depthTest={false}
                    />
                  </mesh>
                  <group
                    scale={[0.016, 0.03, 0.016]}
                    ref={protocolLineTitleRefs.current[0]}
                  >
                    <TextRenderer
                      type={TextType.MediumGreen}
                      text={node.protocol_lines[0]}
                      scale={[1.7, 1, 1.7]}
                    />
                  </group>
                </group>
                <group ref={protocolLine2Ref}>
                  <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
                    <planeBufferGeometry attach="geometry" />
                    <meshBasicMaterial
                      map={big}
                      transparent={true}
                      depthTest={false}
                    />
                  </mesh>
                  <group
                    scale={[0.016, 0.03, 0.016]}
                    ref={protocolLineTitleRefs.current[1]}
                  >
                    <TextRenderer
                      type={TextType.MediumGreen}
                      text={node.protocol_lines[1]}
                      scale={[1.7, 1, 1.7]}
                    />
                  </group>
                </group>

                <group ref={protocolLine3Ref}>
                  <mesh scale={[0.5, 0.06, 1]} renderOrder={2}>
                    <planeBufferGeometry attach="geometry" />
                    <meshBasicMaterial
                      map={big}
                      transparent={true}
                      depthTest={false}
                    />
                  </mesh>
                  <group
                    scale={[0.016, 0.03, 0.016]}
                    ref={protocolLineTitleRefs.current[2]}
                  >
                    <TextRenderer
                      type={TextType.MediumGreen}
                      text={node.protocol_lines[2]}
                      scale={[1.7, 1, 1.7]}
                    />
                  </group>
                </group>
              </>
            )}
        </group>
      </group>
    </group>
  );
};

export default memo(HUD);
