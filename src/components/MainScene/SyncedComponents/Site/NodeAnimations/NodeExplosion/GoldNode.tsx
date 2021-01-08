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

  const activeNodeNameToPath = useMemo(() => {
    if (activeNodeName.includes("S")) {
      return [SSkn, SSKnGold];
    } else if (
      activeNodeName.startsWith("P") ||
      activeNodeName.startsWith("G") ||
      activeNodeName.includes("?")
    ) {
      return [MULTI, MULTIGold];
    } else if (activeNodeName.includes("Dc")) {
      return [Dc, DcGold];
    } else {
      const activeNodeNameAssocs = {
        Tda: [Tda, TdaGold],
        Cou: [Cou, CouGold],
        Dia: [Dia, DiaGold],
        Lda: [Lda, LdaGold],
        Ere: [MULTI, MULTIGold],
        Ekm: [MULTI, MULTIGold],
        Eda: [MULTI, MULTIGold],
        TaK: [MULTI, MULTIGold],
        Env: [MULTI, MULTIGold],
      };

      return activeNodeNameAssocs[
        activeNodeName.substr(0, 3) as keyof typeof activeNodeNameAssocs
      ];
    }
  }, [activeNodeName]);

  const r = useRef<THREE.Object3D>();

  const regularTex = useLoader(THREE.TextureLoader, activeNodeNameToPath[0]);
  const goldTex = useLoader(THREE.TextureLoader, activeNodeNameToPath[1]);

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
