import React, { memo, Suspense } from "react";
import site_a from "../../resources/site_a.json";
import Level from "../Level";
import level_y_values from "../../resources/level_y_values.json";
import blue_orb_positions from "../../resources/blue_orb_positions.json";
import BlueOrb from "../BlueOrb/BlueOrb";
import { useRecoilValue } from "recoil";
import { currentBlueOrbAtom } from "../BlueOrb/CurrentBlueOrbAtom";
import { useSpring, a } from "@react-spring/three";
import {sitePosYAtom, siteRotYAtom} from "./SiteAtom";

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
  green_text: string;
};

type BlueOrbPositionData = {
  position: number[];
  rotation: number[];
};

type BlueOrbPositions = {
  [orbPos: string]: BlueOrbPositionData;
};

export type SiteData = {
  [id: string]: BlueOrbData;
};

const Site = memo(() => {
  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);

  const siteRotY = useRecoilValue(siteRotYAtom);
  const sitePosY = useRecoilValue(sitePosYAtom);

  const siteState = useSpring({
    siteRotY: siteRotY,
    sitePosY: sitePosY,
    config: { duration: 1200 },
  });

  return (
    <Suspense fallback={<>loading...</>}>
      {/*distance between LEVELS is 1.5*/}
      <a.group rotation-y={siteState.siteRotY} position-y={siteState.sitePosY}>
        {Object.entries(level_y_values).map((level: [string, number]) => {
          return (
            <Level
              levelPosY={level[1]}
              key={level[1]}
              level={level[0].toString()}
            />
          );
        })}

        {Object.entries(site_a).map((blueOrb) => {
          if ((blueOrb as any)[1]["unlocked_by"] === "-1")
            return (
              <BlueOrb
                sprite={(blueOrb as any)[1]["node_name"]}
                position={
                  (blue_orb_positions as any)[(blueOrb as any)[0].substr(2)][
                    "position"
                  ]
                }
                rotation={
                  (blue_orb_positions as any)[(blueOrb as any)[0].substr(2)][
                    "rotation"
                  ]
                }
                key={(blueOrb as any)[1]["node_name"]}
                active={(blueOrb as any)[0] === currentBlueOrb}
                level={(blueOrb as any)[0].substr(0, 2)}
              />
            );
        })}
      </a.group>
    </Suspense>
  );
});

export default Site;
