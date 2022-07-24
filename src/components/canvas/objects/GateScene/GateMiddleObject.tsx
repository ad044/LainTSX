import React, { useEffect, useState } from "react";
import { a, useSpring, useSprings } from "@react-spring/three";
import blueDigitData from "@/json/gate/blue_digit_positions.json";
import Mirror from "./Mirror";
import BlueDigit from "./BlueDigit";
import { Position } from "@/types";

type GateMiddleObjectProps = {
  intro: boolean;
  gateLvl: number;
};

const GateMiddleObject = (props: GateMiddleObjectProps) => {
  const [digitSprings, setDigitSprings] = useSprings(
    blueDigitData.length,
    (i) => ({
      position: blueDigitData[i].initial as Position,
      config: { duration: 150 },
    })
  );

  const [groupSpring, setGroupSpring] = useSpring<{ position: Position }>(
    () => ({
      position: [0, 0, 0],
      config: { duration: 900 },
    })
  );

  useEffect(() => {
    setDigitSprings((i) => ({
      position: blueDigitData[i].final,
      delay: blueDigitData[i].delay,
    }));

    setTimeout(() => setGroupSpring({ position: [-0.15, -0.2, 0] }), 1400);
  }, [setDigitSprings, setGroupSpring]);

  return (
    <>
      <a.group position={groupSpring.position} visible={props.intro}>
        {digitSprings.map((item, idx) => (
          <BlueDigit
            type={blueDigitData[idx].type}
            position={item.position}
            key={idx}
          />
        ))}
      </a.group>
      <group visible={!props.intro}>
        <Mirror
          visible={props.gateLvl > 0}
          position={[0, 0, -0.4]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Mirror
          visible={props.gateLvl > 1}
          position={[0, 0, 0.5]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Mirror
          visible={props.gateLvl > 2}
          position={[0.4, 0, 0.05]}
        />
        <Mirror
          visible={props.gateLvl > 3}
          position={[-0.4, 0, 0.05]}
        />
      </group>
    </>
  );
};

export default GateMiddleObject;
