import React, { useEffect, useMemo, useRef } from "react";
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
import { useStore } from "../../../../../../store";

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

  const activeNodeName = useStore(
    (state) => state.activeNode.node_name
  );

  const tex = useMemo(() => {
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
      switch (activeNodeName.substr(0, 3)) {
        case "Tda":
          return [Tda, TdaGold];
        case "Cou":
          return [Cou, CouGold];
        case "Dia":
          return [Dia, DiaGold];
        case "Lda":
          return [Lda, LdaGold];
        case "Ere":
        case "Ekm":
        case "Eda":
        case "TaK":
        case "Env":
          return [MULTI, MULTIGold];
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
