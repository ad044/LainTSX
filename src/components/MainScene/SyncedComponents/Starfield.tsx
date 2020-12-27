import React from "react";
import Star from "./Starfield/Star";

type StarfieldProps = {
  visible: boolean;
};

const Starfield = (props: StarfieldProps) => {
  const LCG = (a: number, c: number, m: number, s: number) => () =>
    (s = (s * a + c) % m);

  const lcgInstance = LCG(1664525, 1013904223, 2 ** 32, 2);

  const [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromRight,
    posesWhiteFromLeft,
  ] = [5, 5, 5, 5, 5, 5].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000000,
      lcgInstance() / 10000000000 - 10,
      lcgInstance() / 1000000000,
    ])
  );

  const [posesBlueFromBottom, posesCyanFromBottom, posesWhiteFromBottom] = [
    60,
    60,
    60,
  ].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000050,
      lcgInstance() / 100000099 - 10,
      lcgInstance() / 1000000050,
    ])
  );

  return (
    <>
      <group position={[0, -1, 2]} visible={props.visible}>
        <group rotation={[0, 0.75, Math.PI / 2]} position={[-0.7, -1, -5]}>
          {posesBlueFromLeft.map((poses, idx) => (
            <Star position={poses} color={"blue"} key={idx} />
          ))}
          {posesWhiteFromLeft.map((poses, idx) => (
            <Star position={poses} color={"white"} key={idx} />
          ))}
          {posesCyanFromLeft.map((poses, idx) => (
            <Star position={poses} color={"cyan"} key={idx} />
          ))}
        </group>
        <group rotation={[0, 2.5, Math.PI / 2]} position={[-0.7, -1, -1]}>
          {posesBlueFromRight.map((poses, idx) => (
            <Star position={poses} color={"blue"} key={idx} />
          ))}
          {posesWhiteFromRight.map((poses, idx) => (
            <Star position={poses} color={"white"} key={idx} />
          ))}
          {posesCyanFromRight.map((poses, idx) => (
            <Star position={poses} color={"cyan"} key={idx} />
          ))}
        </group>
      </group>
      <group
        position={[-3, -15, -19]}
        rotation={[Math.PI / 4, 0, 0]}
        visible={!props.visible}
      >
        {posesBlueFromBottom.map((poses, idx) => (
          <Star position={poses} color={"blue"} key={idx} introStar={true} />
        ))}
        {posesWhiteFromBottom.map((poses, idx) => (
          <Star position={poses} color={"white"} key={idx} introStar={true} />
        ))}
        {posesCyanFromBottom.map((poses, idx) => (
          <Star position={poses} color={"cyan"} key={idx} introStar={true} />
        ))}
      </group>
    </>
  );
};

export default Starfield;
