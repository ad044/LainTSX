import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Clock, DoubleSide, MathUtils } from "three";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "@/store";
import usePrevious from "@/hooks/usePrevious";
import sleep from "@/utils/sleep";
import { Direction, MainSubscene, Position, Rotation } from "@/types";
import { useTexture } from "@react-three/drei";
import vertex from "@/shaders/middle_ring.vert";
import fragment from "@/shaders/middle_ring.frag";
import { getChangeDirection } from "@/utils/site";

type MiddleRingPartProps = {
  position: Position;
  rotation: Rotation;
};

const MiddleRingPart = (props: MiddleRingPartProps) => {
  const middleRing = useTexture("/sprites/main/middle_ring_tex.png");

  const middleRingPart = useMemo(() => {
    middleRing.repeat.set(0.4, 1);
    return middleRing;
  }, [middleRing]);

  const [positionSpring, setPositionSpring] = useSpring<{ value: Position }>(
    () => ({
      value: props.position,
      config: { duration: 600 },
    })
  );

  const subscene = useStore((state) => state.mainSubscene);

  useEffect(() => {
    (async () => {
      const [x, y, z] = props.position;

      await sleep(300);
      setPositionSpring({ value: [x / 0.9, y, z / 0.9] });

      await sleep(400);
      setPositionSpring({ value: [x, y, z] });

      await sleep(400);
      setPositionSpring({ value: [x / 0.9, y, z / 0.9] });

      await sleep(400);
      setPositionSpring({ value: [x, y, z] });

      await sleep(800);
      setPositionSpring({ value: [x / 0.2, y, z / 0.2] });

      await sleep(700);
      setPositionSpring({ value: [x, y, z] });
    })();
  }, [props.position, setPositionSpring, subscene]);

  return (
    <a.group position={positionSpring.value} rotation={props.rotation}>
      <a.mesh scale={[0.16, 0.032, 0]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          map={middleRingPart}
          transparent={true}
          side={DoubleSide}
        />
      </a.mesh>
    </a.group>
  );
};

const MiddleRing = () => {
  const middleRing = useTexture("/sprites/main/middle_ring_tex.png");

  const clock = new Clock();

  const wordSelected = useStore((state) => state.wordSelected);

  const [wobbleAmp, setWobbleAmp] = useState(0);
  const [noiseAmp, setNoiseAmp] = useState(0.03);
  const [rotating, setRotating] = useState(true);
  const [fakeRingVisible, setFakeRingVisible] = useState(false);

  const noiseAmpRef = useRef(0.03);
  const wobbleAmpRef = useRef(0);
  const middleRingMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const middleRingPartRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (middleRingMaterialRef.current) {
      middleRingMaterialRef.current.uniforms.uTime.value =
        clock.getElapsedTime();
      wobbleAmpRef.current = MathUtils.lerp(
        wobbleAmpRef.current,
        wobbleAmp,
        0.1
      );
      noiseAmpRef.current = MathUtils.lerp(noiseAmpRef.current, noiseAmp, 0.1);

      middleRingMaterialRef.current.uniforms.wobbleStrength.value =
        wobbleAmpRef.current;
      middleRingMaterialRef.current.uniforms.noiseAmp.value =
        noiseAmpRef.current;

      middleRingMaterialRef.current.needsUpdate = true;
    }
    if (rotating && middleRingRef.current) {
      middleRingRef.current!.rotation.y += 3 * delta;
    }
    if (rotating && middleRingPartRef.current) {
      middleRingPartRef.current!.rotation.y += 3 * delta;
    }
  });

  const [positionSpring, setPositionSpring] = useSpring<{ value: Position }>(
    () => ({
      value: [0, -0.11, 0.3],
      config: { duration: 600 },
    })
  );

  const [rotationSpring, setRotationSpring] = useSpring<{ value: Rotation }>(
    () => ({
      value: [0, 0.9, 0],
      config: { duration: 1000 },
    })
  );

  const [wrapperSpring, setWrapperSpring] = useSpring<{ rotation: Rotation }>(
    () => ({
      rotation: [0, 0, 0],
      config: { duration: 1000 },
    })
  );

  const uniforms = useMemo(
    () => ({
      tex: { type: "t", value: middleRing },
      uTime: { value: 1.0 },
      wobbleStrength: { value: 0.0 },
      noiseAmp: { value: 0.03 },
    }),
    [middleRing]
  );

  const siteSegment = useStore((state) => state.siteSegment);
  const level = useStore((state) => state.level);
  const subscene = useStore((state) => state.mainSubscene);
  const prev = usePrevious({ siteSegment, level, subscene });

  const isAnimatingRef = useRef(false);

  // on word selection
  useEffect(() => {
    (async () => {
      if (!isAnimatingRef.current && wordSelected) {
        isAnimatingRef.current = true;

        setRotating(true);
        setRotationSpring({ value: [-0.4, 0.9, 0] });

        // reset the rotation value to 0
        await sleep(3100);
        setRotationSpring({ value: [0, 0.9, 0] });

        isAnimatingRef.current = false;
      }
    })();
  }, [setRotationSpring, wordSelected]);

  // on site segment change
  useEffect(() => {
    (async () => {
      if (
        !isAnimatingRef.current &&
        prev?.siteSegment !== undefined &&
        prev?.siteSegment !== siteSegment
      ) {
        const changeDirection = getChangeDirection(
          siteSegment,
          prev.siteSegment
        );

        const values =
          changeDirection === Direction.Right ? [-0.07, 0.03] : [0.07, -0.03];
        isAnimatingRef.current = true;

        await sleep(2300);
        setWrapperSpring({ rotation: [0, 0, values[0]] });

        await sleep(1200);
        setWrapperSpring({ rotation: [0, 0, values[1]] });

        isAnimatingRef.current = false;

        await sleep(1000);
      }
    })();
  }, [prev?.siteSegment, setRotationSpring, setWrapperSpring, siteSegment]);

  // on level change
  useEffect(() => {
    (async () => {
      if (prev?.level !== undefined && prev.level !== level) {
        isAnimatingRef.current = true;
        if (prev?.level > level) {
          await sleep(800);
          setNoiseAmp(0.06);
          setRotating(false);

          await sleep(400);
          setPositionSpring({ value: [0, 1.39, 0.3] });

          await sleep(300);
          setRotationSpring({ value: [0.3, 0.9, 0] });

          await sleep(1500);
          setPositionSpring({ value: [0, -0.31, 0.3] });

          await sleep(150);
          setPositionSpring({ value: [0, -0.11, 0.3] });

          await sleep(350);
          setRotationSpring({ value: [-0.1, 0.9, 0] });
          setNoiseAmp(0);

          await sleep(1000);
          setRotationSpring({ value: [0.05, 0.9, 0] });

          await sleep(300);
          setRotationSpring({ value: [0, 0.9, 0] });
          setRotating(true);

          isAnimatingRef.current = false;

          await sleep(6000);
          setNoiseAmp(0.03);
        } else if (prev?.level < level) {
          await sleep(300);
          setNoiseAmp(0);
          setWobbleAmp(0.2);

          await sleep(400);
          setRotating(false);

          await sleep(500);
          setWobbleAmp(-0.3);
          setPositionSpring({ value: [0, -1.39, 0.3] });

          await sleep(300);

          setWobbleAmp(0);
          setRotationSpring({ value: [-0.2, 0.9, 0] });
          setRotating(true);

          await sleep(1400);
          setPositionSpring({ value: [0, -0.09, 0.3] });

          await sleep(250);
          setRotationSpring({ value: [0, 0.9, 0] });
          setPositionSpring({ value: [0, -0.11, 0.3] });

          isAnimatingRef.current = false;

          await sleep(3000);
          setNoiseAmp(0.03);
        }
      }
    })();
  }, [level, prev?.level, setPositionSpring, setRotationSpring]);

  // on pause
  useEffect(() => {
    (async () => {
      if (!isAnimatingRef.current && subscene === MainSubscene.Pause) {
        isAnimatingRef.current = true;

        setPositionSpring({ value: [0, 0.5, 0.3] });

        await sleep(600);
        setFakeRingVisible(true);

        await sleep(500);
        // move the hidden (main) ring below, cuz when the pause exists it needs to jump back up
        // instead of reappearing
        setPositionSpring({ value: [0, -2.5, 0.3] });

        await sleep(2700);
        setFakeRingVisible(false);
        isAnimatingRef.current = false;
      }
    })();
  }, [setPositionSpring, subscene]);

  // on unpause
  useEffect(() => {
    (async () => {
      if (
        !isAnimatingRef.current &&
        subscene === MainSubscene.Site &&
        prev?.subscene === MainSubscene.Pause
      ) {
        isAnimatingRef.current = true;

        await sleep(300);
        setRotationSpring({ value: [-0.4, 0.9, 0] });
        setRotating(true);

        await sleep(400);
        setPositionSpring({ value: [0, -0.4, 0.3] });

        await sleep(250);
        setRotationSpring({ value: [0, 0.9, 0] });
        setPositionSpring({ value: [0, -0.11, 0.3] });
        isAnimatingRef.current = false;
      }
    })();
  }, [prev?.subscene, setPositionSpring, setRotationSpring, subscene]);

  return (
    // NOTE (cast to any)
    // throws a type error, but works
    <a.group rotation={wrapperSpring.rotation as any}>
      <a.mesh
        position={positionSpring.value}
        rotation={rotationSpring.value as any}
        visible={!fakeRingVisible}
        ref={middleRingRef}
      >
        <cylinderBufferGeometry
          args={[0.75, 0.75, 0.027, 64, 64, true]}
          attach="geometry"
        />
        <shaderMaterial
          side={DoubleSide}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          ref={middleRingMaterialRef}
          transparent={true}
        />
      </a.mesh>

      {fakeRingVisible && (
        <group
          rotation={[0, 0.9, 0]}
          ref={middleRingPartRef}
          position={[0, 0.5, 0.3]}
        >
          {[...Array(30).keys()].map((i) => {
            const angle = (i / 30) * 2 * Math.PI;
            return (
              <MiddleRingPart
                position={[Math.cos(angle) / 1.35, 0, Math.sin(angle) / 1.35]}
                rotation={[0, -angle + Math.PI / 2, 0]}
                key={angle}
              />
            );
          })}
        </group>
      )}
    </a.group>
  );
};

export default MiddleRing;
