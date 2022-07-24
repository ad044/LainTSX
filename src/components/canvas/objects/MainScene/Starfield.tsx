import React, { memo, useCallback, useMemo, useRef } from "react";
import LCG from "@/utils/lcg";
import { a } from "@react-spring/three";
import { Color, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import vertex from "@/shaders/intro_star.vert";
import fragment from "@/shaders/intro_star.frag";
import { Position } from "@/types";

type StarData = { positions: Position[]; color: string };

type StarfieldProps = {
  shouldIntro: boolean;
  mainVisible: boolean;
};

type IntroStarProps = {
  position: Position;
  color: string;
};

const IntroStar = (props: IntroStarProps) => {
  const uniforms = useMemo(
    () => ({
      color1: {
        value: new Color("white"),
      },
      color2: {
        value: new Color(props.color),
      },
    }),
    [props.color]
  );

  const starRef = useRef<THREE.Mesh>(null);

  const amp = useRef(Math.random() / 10);

  useFrame((_, delta) => {
    if (starRef.current && starRef.current.visible) {
      starRef.current.position.y += (15 + amp.current) * delta;
    }
  });

  return (
    <mesh
      position={props.position}
      scale={[0.01, 2, 0.01]}
      renderOrder={-1}
      ref={starRef}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <a.shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        transparent={true}
        depthWrite={false}
        uniforms={uniforms}
      />
    </mesh>
  );
};

type StarProps = {
  position: Position;
  color: string;
  shouldIntro: boolean;
};

const Star = (props: StarProps) => {
  const uniforms = useMemo(
    () => ({
      color1: {
        value: new Color("white"),
      },
      color2: {
        value: new Color(props.color),
      },
    }),
    [props.color]
  );

  const starRef = useRef<THREE.Mesh>(null);

  const amp = useRef(Math.random() / 10);

  const introAmpRef = useRef(props.shouldIntro ? 5 : 0);

  useFrame((_, delta) => {
    if (starRef.current) {
      if (starRef.current.position.y > 4) {
        starRef.current.position.y = props.position[1];
      }
      starRef.current.position.y +=
        (0.01 + amp.current + introAmpRef.current) * delta * 50;
      introAmpRef.current = MathUtils.lerp(introAmpRef.current, 0, delta);
    }
  });

  return (
    <mesh
      position={props.position}
      scale={[0.01, 2, 0.01]}
      renderOrder={-1}
      ref={starRef}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <a.shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        transparent={true}
        depthWrite={false}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const Starfield = (props: StarfieldProps) => {
  const lcgInstance = useMemo(() => LCG(1664525, 1013904223, 2 ** 32, 2), []);

  const generatePositions = useCallback((): Position[] => {
    return Array.from({ length: 5 }, () => [
      lcgInstance() / 1000000000,
      lcgInstance() / 10000000000 - 10,
      lcgInstance() / 1000000000,
    ]);
  }, [lcgInstance]);

  const generateIntroPositions = useCallback((): Position[] => {
    return Array.from({ length: 80 }, () => [
      lcgInstance() / 1000000050,
      lcgInstance() / 100000059 + 5,
      lcgInstance() / 1000000050,
    ]);
  }, [lcgInstance]);

  const generateStarData = (generator: () => Position[]): StarData[] => {
    return [
      { positions: generator(), color: "blue" },
      { positions: generator(), color: "white" },
      { positions: generator(), color: "cyan" },
    ];
  };

  const leftStars: StarData[] = useMemo(
    () => generateStarData(generatePositions),
    [generatePositions]
  );

  const rightStars: StarData[] = useMemo(
    () => generateStarData(generatePositions),
    [generatePositions]
  );

  const bottomStars: StarData[] = useMemo(
    () => generateStarData(generateIntroPositions),
    [generateIntroPositions]
  );

  return (
    <>
      <group position={[0, -1, 2]} visible={props.mainVisible}>
        <group rotation={[0, 0.75, Math.PI / 2]} position={[-0.7, -1, -5]}>
          {leftStars.map((starData: StarData, i: number) =>
            starData.positions.map((position, j: number) => (
              <Star
                shouldIntro={props.shouldIntro}
                color={starData.color}
                position={position}
                key={i + j}
              />
            ))
          )}
        </group>
        <group rotation={[0, 2.5, Math.PI / 2]} position={[-0.7, -1, -1]}>
          {rightStars.map((starData: StarData, i: number) =>
            starData.positions.map((position, j: number) => (
              <Star
                shouldIntro={props.shouldIntro}
                color={starData.color}
                position={position}
                key={i + j}
              />
            ))
          )}
        </group>
      </group>
      {props.shouldIntro && (
        <group position={[-2, -15, -30]} rotation={[Math.PI / 3, 0, 0]}>
          {bottomStars.map((starData: StarData, i: number) =>
            starData.positions.map((position, j: number) => (
              <IntroStar
                color={starData.color}
                position={position}
                key={i + j}
              />
            ))
          )}
        </group>
      )}
      )
    </>
  );
};

export default memo(Starfield);
