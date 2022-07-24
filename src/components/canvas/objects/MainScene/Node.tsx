import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "@/store";
import { LainAnimation, NodeID, Position, Rotation, Scale } from "@/types";
import useNodeTexture from "@/hooks/useNodeTexture";
import { getNode, isNodeViewed, translatePositionByAngle } from "@/utils/node";
import nodePositionsJson from "@/json/node_positions.json";
import { DoubleSide, UniformsLib, UniformsUtils } from "three";
import vertex from "@/shaders/node.vert";
import fragment from "@/shaders/node.frag";
import NodeExplosion from "./NodeExplosion";
import NodeRip from "./NodeRip";
import sleep from "@/utils/sleep";
import { getRotationForSegment } from "@/utils/site";

type NodeProps = {
  id: NodeID;
  active: boolean;
};

const Node = (props: NodeProps) => {
  const [exploding, setExploding] = useState(false);
  const [shrinking, setShrinking] = useState(false);
  const lainAnimation = useStore((state) => state.lainAnimation);
  const siteSegment = useStore((state) => state.siteSegment);
  const gameProgress = useStore((state) => state.gameProgress);

  const node = useMemo(() => getNode(props.id), [props.id]);
  const { position, type } = node;
  const isViewed = useMemo(
    () => isNodeViewed(props.id, gameProgress),
    [gameProgress, props.id]
  );

  const worldPosition = nodePositionsJson[position].position as Position;
  const rotation = nodePositionsJson[position].rotation as Rotation;

  const { activeTexture, viewedTexture, normalTexture } = useNodeTexture(type);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    const uniform = UniformsUtils.merge([UniformsLib["lights"]]);

    uniform.normalTexture = {
      type: "t",
      value: isViewed ? viewedTexture : normalTexture,
    };
    uniform.activeTexture = { type: "t", value: activeTexture };
    uniform.timeMSeconds = { value: (Date.now() % (Math.PI * 3000)) / 1500.0 };

    return uniform;
  }, [isViewed, viewedTexture, normalTexture, activeTexture]);

  const [activeNodeSpring, setActiveNodeSpring] = useSpring<{
    position: Position;
    rotation: Rotation;
    scale: Scale;
    visible: boolean;
  }>(() => ({
    position: worldPosition,
    rotation: rotation,
    scale: [1, 1, 1],
    visible: true,
    config: { duration: 800 },
  }));

  const animateThrow = useCallback(
    async (angle: number) => {
      setActiveNodeSpring({
        position: translatePositionByAngle([0.9, 0, 0.3], angle),
      });

      await sleep(800);
      setActiveNodeSpring({
        position: translatePositionByAngle([0.5, 0, 0.2], angle),
      });

      await sleep(1800);
      setActiveNodeSpring({
        position: translatePositionByAngle([1.55, 0, 0.2], angle),
        rotation: [rotation[0], rotation[1], -0.005],
      });

      await sleep(100);
      setActiveNodeSpring({
        position: translatePositionByAngle([0, 0, 2], angle),
        rotation: [rotation[0], rotation[1], -0.5],
      });

      await sleep(1100);
      setActiveNodeSpring({
        position: worldPosition,
        rotation: rotation,
      });
    },
    [rotation, setActiveNodeSpring, worldPosition]
  );

  const animateKnockAndFall = useCallback(
    async (angle: number) => {
      setActiveNodeSpring({
        position: translatePositionByAngle([1.1, -0.6, 0.2], angle),
      });

      await sleep(2300);
      setActiveNodeSpring({
        visible: false,
      });

      await sleep(200);
      setActiveNodeSpring({
        position: worldPosition,
        rotation: rotation,
      });

      await sleep(700);
      setActiveNodeSpring({
        visible: true,
      });
    },
    [rotation, setActiveNodeSpring, worldPosition]
  );

  const animateKnock = useCallback(
    async (angle: number) => {
      setActiveNodeSpring({
        position: translatePositionByAngle([1.1, -0.6, 0.2], angle),
      });

      await sleep(2500);
      setActiveNodeSpring({
        position: worldPosition,
        rotation: rotation,
      });
    },
    [rotation, setActiveNodeSpring, worldPosition]
  );

  const animateExplode = useCallback(
    async (angle: number) => {
      setActiveNodeSpring({
        position: translatePositionByAngle([-0.6, 0, 0.2], angle),
      });

      await sleep(1200);
      setActiveNodeSpring({
        visible: false,
      });
      setExploding(true);

      await sleep(200);
      setActiveNodeSpring({
        position: worldPosition,
        rotation: rotation,
      });

      await sleep(1750);
      setExploding(false);

      await sleep(350);
      setActiveNodeSpring({
        visible: true,
      });
    },
    [rotation, setActiveNodeSpring, worldPosition]
  );

  const animateNodeRip = useCallback(
    async (angle: number) => {
      setActiveNodeSpring({
        position: translatePositionByAngle([0.9, 0, 0.3], angle),
      });

      await sleep(800);
      setActiveNodeSpring({
        position: translatePositionByAngle([0.5, 0, 0.2], angle),
      });

      await sleep(2000);
      setActiveNodeSpring({
        position: translatePositionByAngle([0, -0.4, 0.2], angle),
      });

      await sleep(200);
      setShrinking(true);
      setActiveNodeSpring({
        scale: [0, 0, 0],
      });

      await sleep(200);
      setActiveNodeSpring({
        position: translatePositionByAngle([0, -1.5, 0.2], angle),
      });

      await sleep(300);
      setActiveNodeSpring({
        visible: false,
        position: worldPosition,
        rotation: rotation,
        scale: [1, 1, 1],
      });

      await sleep(2900);
      setShrinking(false);

      await sleep(1100);
      setActiveNodeSpring({
        visible: true,
      });
    },
    [rotation, setActiveNodeSpring, worldPosition]
  );

  useEffect(() => {
    const angle = getRotationForSegment(siteSegment);
    switch (lainAnimation) {
      case LainAnimation.ThrowNode:
        animateThrow(angle);
        break;
      case LainAnimation.RipNode:
        animateNodeRip(angle);
        break;
      case LainAnimation.TouchNodeAndGetScared:
        animateExplode(angle);
        break;
      case LainAnimation.KnockAndFall:
        animateKnockAndFall(angle);
        break;
      case LainAnimation.Knock:
        animateKnock(angle);
        break;
    }
  }, [
    lainAnimation,
    animateThrow,
    siteSegment,
    animateNodeRip,
    animateExplode,
    animateKnockAndFall,
    animateKnock,
  ]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.timeMSeconds.value =
        (Date.now() % 3000) / 1500.0;
    }
  });

  return props.active ? (
    <>
      <a.group scale={activeNodeSpring.scale}>
        <a.mesh
          position={activeNodeSpring.position}
          // NOTE (cast to any)
          // throws a type error, but works
          rotation={activeNodeSpring.rotation as any}
          visible={activeNodeSpring.visible}
          scale={[0.36, 0.18, 0.36]}
          renderOrder={1}
        >
          <planeBufferGeometry attach="geometry" />
          <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            fragmentShader={fragment}
            vertexShader={vertex}
            side={DoubleSide}
            transparent={true}
            lights={true}
          />
        </a.mesh>
      </a.group>
      <group
        position={translatePositionByAngle(
          [-0.6, 0.45, 0],
          getRotationForSegment(siteSegment)
        )}
        rotation={[0, -getRotationForSegment(siteSegment), 0]}
      >
        {exploding && <NodeExplosion node={node} />}
      </group>
      <group rotation={[0, -getRotationForSegment(siteSegment), 0]}>
        {shrinking && <NodeRip />}
      </group>
    </>
  ) : (
    <a.mesh
      position={worldPosition}
      rotation={rotation}
      scale={[0.36, 0.18, 0.36]}
      renderOrder={1}
    >
      <planeBufferGeometry attach="geometry" />
      <meshStandardMaterial
        map={isViewed ? viewedTexture : normalTexture}
        side={DoubleSide}
        transparent={true}
      />
    </a.mesh>
  );
};

export default memo(Node);
