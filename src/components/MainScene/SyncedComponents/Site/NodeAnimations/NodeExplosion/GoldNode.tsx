import React, { useEffect, useMemo, useRef, useState } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import Cou from "../../../../../../static/sprite/Cou.png";
import CouGold from "../../../../../../static/sprite/Cou_gold.png";
import Dc from "../../../../../../static/sprite/Dc.png";
import DcGold from "../../../../../../static/sprite/Dc_gold.png";
import SSkn from "../../../../../../static/sprite/SSkn.png";
import SSKnGold from "../../../../../../static/sprite/SSkn_gold.png";
import Tda from "../../../../../../static/sprite/Tda.png";
import TdaGold from "../../../../../../static/sprite/Tda_gold.png";
import Dia from "../../../../../../static/sprite/Dia.png";
import DiaGold from "../../../../../../static/sprite/Dia_gold.png";
import Lda from "../../../../../../static/sprite/Lda.png";
import LdaGold from "../../../../../../static/sprite/Lda_gold.png";
import MULTI from "../../../../../../static/sprite/MULTI.png";
import MULTIGold from "../../../../../../static/sprite/MULTI_gold.png";
import {
  useLevelStore,
  useNodeStore,
  useSiteStore,
} from "../../../../../../store";
import site_a from "../../../../../../resources/site_a.json";
import site_b from "../../../../../../resources/site_b.json";
import { SiteType } from "../../../Site";
import SSKnActive from "../../../../../../static/sprite/SSkn_active.png";
import MULTIActive from "../../../../../../static/sprite/MULTI_active.png";
import DcActive from "../../../../../../static/sprite/Dc_active.png";
import TdaActive from "../../../../../../static/sprite/Tda_active.png";
import CouActive from "../../../../../../static/sprite/Cou_active.png";
import DiaActive from "../../../../../../static/sprite/Dia_active.png";
import LdaActive from "../../../../../../static/sprite/Lda_active.png";

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

type GoldNodeProps = {
  visible: boolean;
  goldTexture: boolean;
};

const GoldNode = (props: GoldNodeProps) => {
  const { nodes } = useLoader<GLTFResult>(GLTFLoader, "models/goldNode.glb");
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const activeLevel = useLevelStore((state) => state.activeLevel);

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = currentSite === "a" ? site_a : site_b;

  const activeNodeData = (siteData as SiteType)[activeLevel][activeNodeId];
  const activeNodeName = activeNodeData.node_name;

  const tex = useMemo(() => {
    if (activeNodeName.includes("S")) {
      return [SSkn, SSKnActive];
    } else if (
      activeNodeName.startsWith("P") ||
      activeNodeName.startsWith("G") ||
      activeNodeName.includes("?")
    ) {
      return [MULTI, MULTIActive];
    } else if (activeNodeName.includes("Dc")) {
      return [Dc, DcActive];
    } else {
      switch (activeNodeName.substr(0, 3)) {
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
  }, [activeNodeName]);

  const r = useRef<THREE.Object3D>();

  const regularTex = useLoader(THREE.TextureLoader, tex![0]);
  const goldTex = useLoader(THREE.TextureLoader, tex![1]);

  useEffect(() => {
    if (r.current && !props.visible) {
      r.current.rotation.x = Math.PI / 2;
      r.current.rotation.y = 0;
      r.current.rotation.z = Math.PI / 2 - 0.3;
    }
  }, [props.visible]);

  useFrame(() => {
    if (r.current && props.visible) {
      r.current.rotation.y -= 0.03;
      r.current.rotation.z += 0.03;
    }
  });


  return (
    <mesh
      geometry={nodes.Cube.geometry}
      position={[-0.155, -0.45, 0]}
      rotation={[Math.PI / 2, 0, Math.PI / 2 - 0.3]}
      scale={[-0.1 / 1.15, 0.2 / 1.35, 0.1 / 1.15]}
      ref={r}
    >
      <meshBasicMaterial
        attach="material"
        map={props.goldTexture ? goldTex : regularTex}
        transparent={true}
      />
    </mesh>
  );
};

export default GoldNode;
