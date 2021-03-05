import React, { MutableRefObject } from "react";
import audioVisualizerOrangeOrb from "../../../static/sprites/media/audio_visual_orb_orange.png";
import audioVisualizerYellowOrb from "../../../static/sprites/media/audio_visual_orb_yellow.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";

type AudioVisualizerColumnProps = {
  position: number[];
  refs: {
    ref1: MutableRefObject<THREE.Object3D>;
    ref2: MutableRefObject<THREE.Object3D>;
    ref3: MutableRefObject<THREE.Object3D>;
    ref4: MutableRefObject<THREE.Object3D>;
  };
};

const AudioVisualizerColumn = (props: AudioVisualizerColumnProps) => {
  const orangeAudioVisualizerOrb = useLoader(
    THREE.TextureLoader,
    audioVisualizerOrangeOrb
  );
  const yellowAudioVisualizerOrb = useLoader(
    THREE.TextureLoader,
    audioVisualizerYellowOrb
  );

  const { ref1, ref2, ref3, ref4 } = props.refs;

  return (
    <group position={props.position as [number, number, number]}>
      <mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-5.2, 3.8, 0]}
        renderOrder={10}
        visible={false}
        ref={ref1}
      >
        <meshBasicMaterial
          attach="material"
          map={orangeAudioVisualizerOrb}
          transparent={true}
          opacity={0.5}
          depthTest={false}
        />
        <planeBufferGeometry attach="geometry" />
      </mesh>
      <mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-4.65, 3.8, 0]}
        ref={ref2}
        visible={false}
        renderOrder={5}
      >
        <meshBasicMaterial
          attach="material"
          map={yellowAudioVisualizerOrb}
          opacity={0.5}
          transparent={true}
          depthTest={false}
        />
        <planeBufferGeometry attach="geometry" />
      </mesh>

      <mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-4.1, 3.8, 0]}
        ref={ref3}
        visible={false}
        renderOrder={5}
      >
        <meshBasicMaterial
          attach="material"
          map={yellowAudioVisualizerOrb}
          opacity={0.5}
          transparent={true}
          depthTest={false}
        />
        <planeBufferGeometry attach="geometry" />
      </mesh>
      <mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-3.55, 3.8, 0]}
        renderOrder={10}
        visible={false}
        ref={ref4}
      >
        <meshBasicMaterial
          attach="material"
          map={yellowAudioVisualizerOrb}
          opacity={0.5}
          transparent={true}
          depthTest={false}
        />
        <planeBufferGeometry attach="geometry" />
      </mesh>
    </group>
  );
};

export default AudioVisualizerColumn;
