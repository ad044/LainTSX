import React, { memo, useMemo } from "react";
import { useLoader } from "react-three-fiber";
import { a } from "@react-spring/three";
import * as THREE from "three";
import Cou from "../../../static/sprite/Cou.png";
import CouViewed from "../../../static/sprite/Cou_viewed.png";
import Dc from "../../../static/sprite/Dc.png";
import DcViewed from "../../../static/sprite/Dc_viewed.png";
import SSkn from "../../../static/sprite/SSkn.png";
import SSknViewed from "../../../static/sprite/SSkn_viewed.png";
import Tda from "../../../static/sprite/Tda.png";
import TdaViewed from "../../../static/sprite/Tda_viewed.png";
import Dia from "../../../static/sprite/Dia.png";
import DiaViewed from "../../../static/sprite/Dia_viewed.png";
import Lda from "../../../static/sprite/Lda.png";
import LdaViewed from "../../../static/sprite/Lda_viewed.png";
import MULTI from "../../../static/sprite/MULTI.png";
import MULTIViewed from "../../../static/sprite/MULTI_viewed.png";
import level_y_values from "../../../resources/level_y_values.json";

type NodeContructorProps = {
  nodeName: string;
  position: number[];
  rotation: number[];
  level: string;
  viewed: boolean;
};

const InactiveLevelNode = memo((props: NodeContructorProps) => {
  const tex = useMemo(() => {
    if (props.nodeName.includes("S")) {
      return [SSkn, SSknViewed];
    } else if (
      props.nodeName.startsWith("P") ||
      props.nodeName.startsWith("G") ||
      props.nodeName.includes("?")
    ) {
      return [MULTI, MULTIViewed];
    } else if (props.nodeName.includes("Dc")) {
      return [Dc, DcViewed];
    } else {
      switch (props.nodeName.substr(0, 3)) {
        case "Tda":
          return [Tda, TdaViewed];
        case "Cou":
          return [Cou, CouViewed];
        case "Dia":
          return [Dia, DiaViewed];
        case "Lda":
          return [Lda, LdaViewed];
        case "Ere":
        case "Ekm":
        case "Eda":
        case "TaK":
        case "Env":
          return [MULTI, MULTIViewed];
      }
    }
  }, [props.nodeName]);

  const nonActiveTexture = useLoader(
    THREE.TextureLoader,
    props.viewed ? tex![1] : tex![0]
  );

  return (
    <group
      position={[
        0,
        level_y_values[props.level as keyof typeof level_y_values],
        0,
      ]}
    >
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
    </group>
  );
});

export default InactiveLevelNode;
