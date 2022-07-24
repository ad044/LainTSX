import React, { createRef, memo, useEffect, useMemo } from "react";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";
import { useStore } from "@/store";
import { getLevelLimit, getLevelY } from "@/utils/site";
import { FlattenedSiteLayout, MainSubscene } from "@/types";
import Node from "./Node";

type LevelsProps = {
  flattenedLayout: FlattenedSiteLayout;
  activateAllLevels: boolean;
};

const Levels = (props: LevelsProps) => {
  const level = useStore((state) => state.level);
  const site = useStore((state) => state.site);
  const node = useStore((state) => state.node);
  const isPaused = useStore(
    (state) => state.mainSubscene === MainSubscene.Pause
  );

  const refs = useMemo(
    () =>
      Array.from({ length: getLevelLimit(site) + 1 }, () =>
        createRef<THREE.Group>()
      ),
    [site]
  );

  useEffect(() => {
    if (props.activateAllLevels) {
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.visible = true;
        }
      });
    }
  }, [props.activateAllLevels, refs]);

  useEffect(() => {
    if (!props.activateAllLevels) {
      const start = Math.max(0, level - 2);
      const end = Math.min(getLevelLimit(site), level + 2);

      refs.forEach((ref, idx) => {
        if (ref.current && (idx <= start || idx >= end)) {
          ref.current.visible = false;
        }
      });
    }
  }, [site, level, props.activateAllLevels, refs]);

  return (
    <>
      {refs.map(
        (ref, level) =>
          level > 0 && (
            <group position={[0, getLevelY(level), 0]} key={level} ref={ref}>
              {props.flattenedLayout[level].map((nodeId) => (
                <Node
                  key={nodeId}
                  id={nodeId}
                  active={node !== null && node.id === nodeId && !isPaused}
                />
              ))}
              <PurpleRing level={level} site={site} />
              <GrayRing />
              <CyanCrystal />
            </group>
          )
      )}
    </>
  );
};

export default memo(Levels);
