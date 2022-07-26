import useNodeTexture from "@/hooks/useNodeTexture";
import { useStore } from "@/store";
import { LainAnimation, NodeID } from "@/types";
import {
  getNode,
  getNodeWorldPosition,
  getNodeWorldRotation,
  isNodeViewed,
} from "@/utils/node";
import { memo, useEffect, useMemo, useRef } from "react";
import { DoubleSide } from "three";

type StaticNodeProps = {
  id: NodeID;
};

const StaticNode = (props: StaticNodeProps) => {
  const currentNode = useStore((state) => state.node);
  const node = useMemo(() => getNode(props.id), [props.id]);
  const ref = useRef<THREE.Mesh>(null);

  useEffect(
    () =>
      useStore.subscribe(
        (state) => state.lainAnimation,
        (lainAnimation) => {
          switch (lainAnimation) {
            case LainAnimation.ThrowNode:
            case LainAnimation.RipNode:
            case LainAnimation.TouchNodeAndGetScared:
            case LainAnimation.KnockAndFall:
            case LainAnimation.Knock:
              if (
                ref.current &&
                props.id === currentNode?.id &&
                ref.current.visible
              ) {
                ref.current.visible = false;
              }
              break;
            default:
              if (ref.current && !ref.current.visible) {
                ref.current.visible = true;
              }
              break;
          }
        }
      ),
    [currentNode?.id, props.id]
  );

  const { position, type } = node;

  const worldPosition = getNodeWorldPosition(position);
  const rotation = getNodeWorldRotation(position);
  const gameProgress = useStore((state) => state.gameProgress);

  const { viewedTexture, normalTexture } = useNodeTexture(type);

  const isViewed = useMemo(
    () => isNodeViewed(props.id, gameProgress),
    [gameProgress, props.id]
  );

  return (
    <mesh
      ref={ref}
      position={worldPosition}
      rotation={rotation}
      scale={[0.36, 0.18, 0.36]}
      renderOrder={1}
    >
      <planeBufferGeometry attach="geometry" />
      <meshStandardMaterial
        map={isViewed ? viewedTexture : normalTexture}
        side={DoubleSide}
        transparent={true}
      />
    </mesh>
  );
};

export default memo(StaticNode);
