import React, { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import Cou from "../../../../static/sprite/Cou.png";
import CouActive from "../../../../static/sprite/Cou_active.png";
import Dc from "../../../../static/sprite/Dc.png";
import DcActive from "../../../../static/sprite/Dc_active.png";
import SSkn from "../../../../static/sprite/SSkn.png";
import SSKnActive from "../../../../static/sprite/SSkn_active.png";
import Tda from "../../../../static/sprite/Tda.png";
import TdaActive from "../../../../static/sprite/Tda_active.png";
import Dia from "../../../../static/sprite/Dia.png";
import DiaActive from "../../../../static/sprite/Dia_active.png";
import Lda from "../../../../static/sprite/Lda.png";
import LdaActive from "../../../../static/sprite/Lda_active.png";
import MULTI from "../../../../static/sprite/MULTI.png";
import MULTIActive from "../../../../static/sprite/MULTI_active.png";
import level_y_values from "../../../../resources/level_y_values.json";
import { useNodeStore } from "../../../../store";

type NodeContructorProps = {
  nodeName: string;
  position: number[];
  rotation: number[];
  active?: boolean;
  level: string;
};

const Node = memo((props: NodeContructorProps) => {
  // the game only has a couple of sprite that it displays in the hub
  // dynamically importnig them would be worse for performance,
  // so we import all of them here and then use this function to
  // associate a sprite with the path

  const tex = useMemo(() => {
    if (props.nodeName.includes("S")) {
      return [SSkn, SSKnActive];
    } else if (
      props.nodeName.startsWith("P") ||
      props.nodeName.startsWith("G") ||
      props.nodeName.includes("?")
    ) {
      return [MULTI, MULTIActive];
    } else if (props.nodeName.includes("Dc")) {
      return [Dc, DcActive];
    } else {
      switch (props.nodeName.substr(0, 3)) {
        case "Tda":
          return [Tda, TdaActive];
        case "Cou":
          return [Cou, CouActive];
        case "Dia":
          return [Dia, DiaActive];
        case "Lda":
          return [Lda, LdaActive];
        case "Ere":
        case "Ekm":
        case "Eda":
        case "TaK":
        case "Env":
          return [MULTI, MULTIActive];
      }
    }
  }, [props.nodeName]);

  const materialRef = useRef<THREE.ShaderMaterial>();

  const nonActiveTexture = useLoader(THREE.TextureLoader, tex![0]);
  const activeTexture = useLoader(THREE.TextureLoader, tex![1]);

  const uniforms = useMemo(
    () => ({
      tex1: { type: "t", value: nonActiveTexture },
      tex2: { type: "t", value: activeTexture },
      timeMSeconds: { value: (Date.now() % (Math.PI * 2000)) / 1000.0 },
    }),
    [nonActiveTexture, activeTexture]
  );

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform float timeMSeconds;

    varying vec2 vUv;

    #define M_PI 3.1415926535897932384626433832795

    void main() {
        vec4 t1 = texture2D(tex1,vUv);
        vec4 t2 = texture2D(tex2,vUv);
        float bias = abs(sin(timeMSeconds / (1.6 / M_PI)));
        gl_FragColor = mix(t1, t2, bias);
    }
  `;

  // these pieces of state get updated transiently rather than reactively
  // to avoid excess unnecessary renders (this is absolutely crucial for performance).

  const [
    {
      activeNodePosX,
      activeNodePosY,
      activeNodePosZ,
      activeNodeRotZ,
      activeNodeVisible,
      activeNodeScale,
    },
    set,
  ] = useSpring(() => ({
    activeNodePosX: useNodeStore.getState().activeNodeState.interactedWith
      ? useNodeStore.getState().activeNodeState.posX
      : props.position[0],
    activeNodePosY: useNodeStore.getState().activeNodeState.interactedWith
      ? level_y_values[props.level as keyof typeof level_y_values] +
        useNodeStore.getState().activeNodeState.posY
      : props.position[1],
    activeNodePosZ: useNodeStore.getState().activeNodeState.interactedWith
      ? useNodeStore.getState().activeNodeState.posZ
      : props.position[2],
    activeNodeRotZ: useNodeStore.getState().activeNodeState.interactedWith
      ? useNodeStore.getState().activeNodeState.rotZ
      : 0,
    activeNodeScale: useNodeStore.getState().activeNodeState.shrinking ? 0 : 1,
    activeNodeVisible: true,
    config: { duration: 800 },
  }));

  useEffect(() => {
    useNodeStore.subscribe(set, (state) => ({
      activeNodePosX: useNodeStore.getState().activeNodeState.interactedWith
        ? state.activeNodeState.posX
        : props.position[0],
      activeNodePosY: useNodeStore.getState().activeNodeState.interactedWith
        ? state.activeNodeState.posY
        : props.position[1],
      activeNodePosZ: useNodeStore.getState().activeNodeState.interactedWith
        ? state.activeNodeState.posZ
        : props.position[2],
      activeNodeRotZ: useNodeStore.getState().activeNodeState.interactedWith
        ? state.activeNodeState.rotZ
        : 0,
      activeNodeScale: useNodeStore.getState().activeNodeState.shrinking
        ? 0
        : 1,
      activeNodeVisible: useNodeStore.getState().activeNodeState.visible,
    }));
  }, [
    props.level,
    activeNodePosX,
    activeNodePosZ,
    activeNodeRotZ,
    props.position,
    set,
    props.rotation,
  ]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.timeMSeconds.value =
        (Date.now() % (Math.PI * 2000)) / 1000.0;
    }
  });

  return (
    <group
      position={[
        0,
        level_y_values[props.level as keyof typeof level_y_values],
        0,
      ]}
    >
      {props.active ? (
        <a.group
          scale-x={activeNodeScale}
          scale-y={activeNodeScale}
          scale-z={activeNodeScale}
        >
          <a.mesh
            position-x={activeNodePosX}
            position-y={activeNodePosY}
            position-z={activeNodePosZ}
            rotation-z={activeNodeRotZ}
            rotation-y={props.rotation[1]}
            visible={activeNodeVisible}
            scale={[0.36, 0.18, 0.36]}
            renderOrder={1}
          >
            <planeBufferGeometry attach="geometry" />
            <shaderMaterial
              ref={materialRef}
              attach="material"
              uniforms={uniforms}
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              side={THREE.DoubleSide}
              transparent={true}
            />
          </a.mesh>
        </a.group>
      ) : (
        <a.mesh
          position-x={props.position[0]}
          position-y={props.position[1]}
          position-z={props.position[2]}
          rotation-y={props.rotation[1]}
          rotation-z={0}
          scale={[0.36, 0.18, 0.36]}
          renderOrder={1}
        >
          <planeBufferGeometry attach="geometry" />
          <meshStandardMaterial
            attach="material"
            map={nonActiveTexture}
            side={THREE.DoubleSide}
            transparent={true}
          />
        </a.mesh>
      )}
    </group>
  );
});

export default Node;
