import React, { memo, Suspense } from "react";
import site_a from "../resources/site_a.json";
import blue_orb_positions from "../resources/blue_orb_positions.json";
import BlueOrb from "./BlueOrb/BlueOrb";
import { useRecoilValue } from "recoil";
import { currentBlueOrbAtom } from "./BlueOrb/CurrentBlueOrbAtom";
import Level from "./Level";
import level_y_values from "../resources/level_y_values.json";

const Site = memo(() => {
  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);

  return (
    <>
      <Suspense fallback={<>loading...</>}>
        {/* distance between LEVELS is 1.5 */}

        {Object.values(level_y_values).map((yVal) => {
          return <Level levelPosY={yVal} />;
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
                active={(blueOrb as any)[1] === currentBlueOrb}
                level={(blueOrb as any)[0].substr(0, 2)}
              />
            );
        })}
      </Suspense>
    </>
  );
});

export default Site;
