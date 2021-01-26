import React, { Suspense, useMemo, useRef } from "react";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../../store";
import ActiveLevelNodes from "./Site/ActiveLevelNodes";
import Rings from "./Site/Rings";
import NodeAnimations from "./Site/NodeAnimations";
import InactiveLevelNodes from "./Site/InactiveLevelNodes";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import lerp from "../../../core/utils/lerp";

export type NodeDataType = {
  id: string;
  image_table_indices: { 1: string; 2: string; 3: string };
  triggers_final_video: number;
  required_final_video_viewcount: number;
  media_file: string;
  node_name: string;
  site: string;
  type: number;
  title: string;
  unlocked_by: string;
  upgrade_requirement: number;
  protocol_lines: { 1: string; 2: string; 3: string; 4: string };
  words: { 1: string; 2: string; 3: string };
  matrixIndices?: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  };
};

export type LevelType = {
  [key: string]: NodeDataType;
};

export type SiteType = {
  [key: string]: LevelType;
};

type SiteProps = {
  shouldIntro: boolean;
  introFinished: boolean;
};

const Site = (props: SiteProps) => {
  const siteRot = useStore((state) => state.siteRot);
  const sitePos = useStore((state) => state.sitePos);
  const siteState = useSpring({
    siteRotX: siteRot[0],
    siteRotY: siteRot[1],
    sitePosY: sitePos[1],
    config: { duration: 1200 },
  });

  const introWrapperRef = useRef<THREE.Object3D>();

  // imperative because having a spring here seemed to behave clunkily if that's even a word
  // the site would pop back after having done the intro anim sometimes
  useFrame(() => {
    if (introWrapperRef.current) {
      if (introWrapperRef.current.position.z < 0) {
        introWrapperRef.current.position.z += 0.05;
      }
      if (introWrapperRef.current.rotation.x > 0) {
        introWrapperRef.current.rotation.x -= 0.008;
      }
    }
  });

  return (
    <Suspense fallback={null}>
      <a.group ref={introWrapperRef} position-z={-10} rotation-x={Math.PI / 2}>
        <a.group rotation-x={siteState.siteRotX}>
          <a.group
            rotation-y={siteState.siteRotY}
            position-y={siteState.sitePosY}
          >
            <ActiveLevelNodes />
            <InactiveLevelNodes />
            <NodeAnimations />
            <Rings
              activateAllRings={props.shouldIntro ? props.introFinished : true}
            />
          </a.group>
        </a.group>
      </a.group>
    </Suspense>
  );
};

export default Site;
