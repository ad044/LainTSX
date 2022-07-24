import React from "react";
import { useTexture } from "@react-three/drei";
import { Position } from "@/types";

type AudioVisualizerColumnProps = {
  position: Position;
  refs: React.RefObject<THREE.Mesh>[];
};

const AudioVisualizerColumn = (props: AudioVisualizerColumnProps) => {
  const orangeAudioVisualizerOrb = useTexture(
    "/sprites/media/audio_visual_orb_orange.png"
  );
  const yellowAudioVisualizerOrb = useTexture(
    "/sprites/media/audio_visual_orb_yellow.png"
  );

  const [ref1, ref2, ref3, ref4] = props.refs;

  return (
    <group position={props.position}>
      <mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-5.2, 3.8, 0]}
        renderOrder={10}
        visible={false}
        ref={ref1}
      >
        <meshBasicMaterial
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
