import React, { useMemo } from "react";
import { useTexture } from "@react-three/drei";

type ProgressBarProps = {
  progress: number;
};

const SsknProgressBar = (props: ProgressBarProps) => {
  const first = useTexture("/sprites/progressbar/progress_bar1.png");
  const second = useTexture("/sprites/progressbar/progress_bar2.png");
  const third = useTexture("/sprites/progressbar/progress_bar3.png");
  const fourth = useTexture("/sprites/progressbar/progress_bar4.png");
  const fifth = useTexture("/sprites/progressbar/progress_bar5.png");

  const full = useTexture("/sprites/progressbar/progress_bar0.png");

  const texture = useMemo(() => {
    switch (props.progress) {
      case 0:
        return first;
      case 1:
        return first;
      case 2:
        return second;
      case 3:
        return third;
      case 4:
        return fourth;
      case 5:
        return fifth;
      default:
        return full;
    }
  }, [fifth, first, fourth, full, props.progress, second, third]);

  return (
    <sprite
      visible={texture !== null}
      scale={[props.progress < 6 ? props.progress * 0.25 : 1.5, 0.2, 0]}
      position={[(props.progress - 1) * 0.205, 0, 0]}
      renderOrder={4}
    >
      <spriteMaterial map={texture} opacity={0.8} />
    </sprite>
  );
};

export default SsknProgressBar;
