import React from "react";
import blue_orb_positions from "../resources/blue_orb_positions.json";
import BlueOrb from "./BlueOrb/BlueOrb";
import { useRecoilValue } from "recoil";
import { currentBlueOrbAtom } from "./BlueOrb/CurrentBlueOrbAtom";

type ImageTableIndices = {
  1: string;
  2: string;
  3: string;
};

type ProtocolLines = {
  1: string;
  2: string;
  3: string;
  4: string;
};

type Words = {
  1: string;
  2: string;
  3: string;
};

type BlueOrbData = {
  "SLPS_016_0x offset": string;
  image_table_indices: ImageTableIndices;
  is_hidden: string;
  media_file: string;
  node_name: string;
  protocol_lines: ProtocolLines;
  site: string;
  type: string;
  unlocked_by: string;
  upgrade_requirement: string;
  words: Words;
};

type BlueOrbPositionData = {
  position: number[];
  rotation: number[];
};

type BlueOrbPositions = {
  [orbPos: string]: BlueOrbPositionData;
};

type ColumnProps = {
  columnData: [string, BlueOrbData][];
};

const Column = (props: ColumnProps) => {
  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);

  return (
    <>
      {props.columnData.map((blueOrb: [string, BlueOrbData]) => {
        // if (blueOrb[1]["unlocked_by"] === "-1")
        return (
          <BlueOrb
            sprite={blueOrb[1]["node_name"]}
            position={
              (blue_orb_positions as BlueOrbPositions)[blueOrb[0].substr(2)][
                "position"
              ]
            }
            rotation={
              (blue_orb_positions as BlueOrbPositions)[blueOrb[0].substr(2)][
                "rotation"
              ]
            }
            key={blueOrb[1]["node_name"]}
            active={blueOrb[0] === currentBlueOrb}
            level={blueOrb[0].substr(0, 2)}
          />
        );
      })}
    </>
  );
};

export default Column;
