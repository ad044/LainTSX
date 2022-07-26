import React, { useEffect, useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "@/store";
import { FlattenedSiteLayout, MainSubscene, NodeID } from "@/types";
import { getLevelY } from "@/utils/site";
import { getRotationForSegment } from "@/utils/site";
import Rings from "./Rings";
import StaticLevelNodes from "./StaticLevelNodes";
import LevelNodes from "./LevelNodes";

type SiteProps = {
  introFinished: boolean;
};

const Site = (props: SiteProps) => {
  const wordSelected = useStore((state) => state.wordSelected);
  const level = useStore((state) => state.level);
  const siteSegment = useStore((state) => state.siteSegment);
  const prev = useStore((state) => state.prev);

  const [rotationSpring, setRotationSpring] = useSpring(() => ({
    x: 0,
    y: getRotationForSegment(wordSelected ? prev.siteSegment : siteSegment),
    config: { duration: 1200 },
  }));

  const [positionSpring, setPositionSpring] = useSpring(() => ({
    y: -getLevelY(wordSelected ? prev.level : level),
    delay: 1300,
    config: { duration: 1200 },
  }));

  const [tiltState, setTiltState] = useSpring(() => ({
    tilt: 0,
    config: { duration: 200 },
  }));

  useEffect(
    () =>
      useStore.subscribe(
        (state) => state.siteSegment,
        (siteSegment) => {
          setRotationSpring((_, controller) => ({
            y: getRotationForSegment(siteSegment, controller.get().y),
            delay: 1100,
          }));
        }
      ),
    [setRotationSpring]
  );

  useEffect(() => {
    if (wordSelected) {
      setPositionSpring({ y: -getLevelY(level), delay: 1300 });
      setRotationSpring({ y: getRotationForSegment(siteSegment), delay: 1300 });
    }
  }, [level, setPositionSpring, setRotationSpring, siteSegment, wordSelected]);

  useEffect(
    () =>
      useStore.subscribe(
        (state) => state.mainSubscene,
        (mainSubscene) => {
          if (mainSubscene === MainSubscene.Pause) {
            setRotationSpring({ x: Math.PI / 2, delay: 3600 });
          } else {
            setRotationSpring({ x: 0 });
          }
        }
      ),
    [setRotationSpring]
  );

  useEffect(
    () =>
      useStore.subscribe(
        (state) => state.level,
        (level) => {
          setPositionSpring({
            y: -getLevelY(level),
            delay: 1300,
          });
        }
      ),
    [setPositionSpring]
  );

  useEffect(
    () =>
      useStore.subscribe(
        (state) => state.cameraTiltValue,
        (cameraTilt) => {
          setTiltState({
            tilt: cameraTilt,
          });
        }
      ),
    [setTiltState]
  );

  const siteLayout = useStore((state) => state.siteLayouts[state.site]);
  const site = useStore((state) => state.site);
  const layout: FlattenedSiteLayout = useMemo(() => {
    return siteLayout.map((level) =>
      level.flat().filter((e): e is NodeID => e !== null)
    );
  }, [siteLayout]);

  return (
    <a.group rotation-x={tiltState.tilt}>
      <a.group rotation-x={rotationSpring.x}>
        <a.group rotation-y={rotationSpring.y} position-y={positionSpring.y}>
          <StaticLevelNodes flattenedLayout={layout} site={site} />
          <LevelNodes flattenedLayout={layout} site={site} />
          <Rings activateAllRings={props.introFinished} site={site} />
        </a.group>
      </a.group>
    </a.group>
  );
};

export default Site;
