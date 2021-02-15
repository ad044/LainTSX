import React, { memo, useEffect, useState } from "react";
import { useStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import SiteBigLetter from "./SiteBigLetter";
import sleep from "../../utils/sleep";

const MediaYellowTextAnimator = memo(() => {
  const [lastLeftComponent, setLastLeftComponent] = useState("play");
  const [textArr, setTextArr] = useState("Play".split(""));
  const [posY, setPosY] = useState(0.05);

  const trail = useTrail(textArr.length, {
    posY: posY,
    config: { duration: 280 },
  });

  const activeMediaComponent = useStore(
    (state) =>
      state.mediaComponentMatrix[state.mediaComponentMatrixIndices.sideIdx][
        state.mediaComponentMatrixIndices.sideIdx === 0
          ? state.mediaComponentMatrixIndices.leftSideIdx
          : state.mediaComponentMatrixIndices.rightSideIdx
      ]
  );

  useEffect(() => {
    if (
      (activeMediaComponent === "play" || activeMediaComponent === "exit") &&
      activeMediaComponent !== lastLeftComponent
    ) {
      setLastLeftComponent(activeMediaComponent);

      setTimeout(() => {
        if (activeMediaComponent === "play") {
          setPosY(0.05);
        } else {
          setPosY(-0.08);
        }
      }, 400);

      setTimeout(
        () =>
          setTextArr(
            (
              activeMediaComponent.charAt(0).toUpperCase() +
              activeMediaComponent.slice(1)
            ).split("")
          ),
        1000
      );
    }
  }, [activeMediaComponent, lastLeftComponent]);

  useEffect(() => {
    return () => {
      setLastLeftComponent("play");
    };
  }, []);

  return (
    <group position={[0, 0, 10]}>
      {trail.map(({ posY }, idx) => (
        <a.group
          key={idx}
          position-y={posY}
          position-x={-0.8}
          position-z={-8.7}
          scale={[0.04, 0.06, 0.04]}
        >
          <SiteBigLetter letter={textArr[idx]} letterIdx={idx} key={idx} />
        </a.group>
      ))}
    </group>
  );
});

export default MediaYellowTextAnimator;
