import React, { useEffect, useState } from "react";
import BlueZero from "./GateMiddleObject/BlueZero";
import BlueOne from "./GateMiddleObject/BlueOne";
import { a, useSpring, useSprings } from "@react-spring/three";
import blue_digit_positions from "../../resources/blue_digit_positions.json";
import Mirror from "./GateMiddleObject/Mirror";

type GateMiddleObjectProps = {
  intro: boolean;
  gateLvl: number;
};

const GateMiddleObject = (props: GateMiddleObjectProps) => {
  const [middleGroupPos, setMiddleGroupPos] = useState<number[]>();

  const [springs, set] = useSprings(44, (intIdx) => {
    const idx = intIdx.toString();
    return {
      type: blue_digit_positions[idx as keyof typeof blue_digit_positions].type,
      posX:
        blue_digit_positions[idx as keyof typeof blue_digit_positions]
          .initial_x,
      posY:
        blue_digit_positions[idx as keyof typeof blue_digit_positions]
          .initial_y,
      visibility: false,
      config: { duration: 150 },
    };
  });

  useEffect(() => {
    set((intIdx) => {
      const idx = intIdx.toString();
      return {
        posX:
          blue_digit_positions[idx as keyof typeof blue_digit_positions]
            .final_x,
        posY:
          blue_digit_positions[idx as keyof typeof blue_digit_positions]
            .final_y,
        delay:
          blue_digit_positions[idx as keyof typeof blue_digit_positions].delay,
        visibility: true,
      };
    });

    setTimeout(() => setMiddleGroupPos([-0.15, -0.2, -0.1]), 1400);
  }, [set]);

  const middleObjectGroupState = useSpring({
    posX: middleGroupPos ? middleGroupPos[0] : 0,
    posY: middleGroupPos ? middleGroupPos[1] : 0,
    posZ: middleGroupPos ? middleGroupPos[2] : 0,
    config: { duration: 900 },
  });

  return (
    <>
      <a.group
        position-x={middleObjectGroupState.posX}
        position-y={middleObjectGroupState.posY}
        position-z={middleObjectGroupState.posZ}
        visible={props.intro}
      >
        {springs.map((item, idx) =>
          item.type.get() === 1 ? (
            <BlueOne
              posX={item.posX}
              posY={item.posY}
              key={idx}
              visibility={item.visibility}
            />
          ) : (
            <BlueZero
              posX={item.posX}
              posY={item.posY}
              key={idx}
              visibility={item.visibility}
            />
          )
        )}
      </a.group>
      <Mirror
        visible={props.gateLvl === 1 ? !props.intro : props.gateLvl > 0}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, 0, -0.4]}
      />
      <Mirror
        visible={props.gateLvl === 2 ? !props.intro : props.gateLvl > 1}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, 0, 0.5]}
      />
      <Mirror
        visible={props.gateLvl === 3 ? !props.intro : props.gateLvl > 2}
        position={[0.4, 0, 0.05]}
      />
      <Mirror
        visible={props.gateLvl === 4 ? !props.intro : props.gateLvl > 3}
        position={[-0.4, 0, 0.05]}
      />
    </>
  );
};

export default GateMiddleObject;
