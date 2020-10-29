import available_blue_orbs_on_projection from "../resources/available_blue_orbs_on_projection.json";

type GameContext = {
  scene: string;
  keyPress: string;
  siteRotIdx: number;
  blueOrbRowIdx: number;
  blueOrbColIdx: number;
};

const computeAction = (gameContext: GameContext) => {
  const availableBlueOrbs = [
    available_blue_orbs_on_projection.topRowProjection[gameContext.siteRotIdx],
    available_blue_orbs_on_projection.middleRowProjection[
      gameContext.siteRotIdx
    ],
    available_blue_orbs_on_projection.bottomRowProjection[
      gameContext.siteRotIdx
    ],
  ];

  switch (gameContext.keyPress) {
    case "left":
      let newBlueOrbRowIdx = gameContext.blueOrbRowIdx - 1;
      if(newBlueOrbRowIdx < 0) {

      }
  }
};

export default computeAction;
