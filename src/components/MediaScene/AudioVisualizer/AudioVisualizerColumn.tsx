import React, { useEffect, useMemo, useRef, useState } from "react";
import audioVisualizerOrangeOrb from "../../../static/sprite/audio_visual_orb_orange.png";
import audioVisualizerYellowOrb from "../../../static/sprite/audio_visual_orb_yellow.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useAudioVisualizerStore, useBlueOrbStore } from "../../../store";
import { useSpring, a } from "@react-spring/three";
import level_y_values from "../../../resources/level_y_values.json";

type AudioVisualizerColumnProps = {
  position: number[];
  idx: number;
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

  const [
    { fstOrbVisible, sndOrbVisible, thirdOrbVisible, fourthOrbVisible },
    set,
  ] = useSpring(() => ({
    fstOrbVisible: false,
    sndOrbVisible: false,
    thirdOrbVisible: false,
    fourthOrbVisible: false,
    config: { duration: 800 },
  }));

  useEffect(() => {
    useAudioVisualizerStore.subscribe(set, (state) => ({
      fstOrbVisible: state.frequency[props.idx * 32] >= 64,
      sndOrbVisible: state.frequency[props.idx * 32] >= 128,
      thirdOrbVisible: state.frequency[props.idx * 32] >= 192,
      fourthOrbVisible: state.frequency[props.idx * 32] >= 255,
    }));
  }, [props.position, set]);

  return (
    <group position={props.position as [number, number, number]}>
      <a.mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-5.2, 3.8, 0]}
        visible={fstOrbVisible}
        renderOrder={10}
      >
        <meshBasicMaterial
          attach="material"
          map={orangeAudioVisualizerOrb}
          transparent={true}
          opacity={0.5}
          depthTest={false}
        />
        <planeBufferGeometry attach="geometry" />
      </a.mesh>
      <a.mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-4.65, 3.8, 0]}
        visible={sndOrbVisible}
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
      </a.mesh>

      <a.mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-4.1, 3.8, 0]}
        visible={thirdOrbVisible}
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
      </a.mesh>
      <a.mesh
        scale={[0.4, 0.4, 0.4]}
        position={[-3.55, 3.8, 0]}
        visible={fourthOrbVisible}
        renderOrder={10}
      >
        <meshBasicMaterial
          attach="material"
          map={yellowAudioVisualizerOrb}
          opacity={0.5}
          transparent={true}
          depthTest={false}
        />
        <planeBufferGeometry attach="geometry" />
      </a.mesh>
    </group>
  );
};

export default AudioVisualizerColumn;
