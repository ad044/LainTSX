export const calculatePosAfterMove = (
  currentData: {
    siteRotY: number;
    sitePosY: number;
    matrixIndices: { rowIdx: number; colIdx: number; matrixIdx: number };
  },
  prevData: { siteRotY: number; sitePosY: number }
) => {
  if (currentData.sitePosY > prevData.sitePosY) {
    // todo
    // instead of 1 i need to calculate the amplifier value
    return { posX: 0, posY: 1 * 1 };
  } else if (currentData.sitePosY < prevData.sitePosY) {
    return { posX: 0, posY: -1 * 1 };
  } else {
    if (
      currentData.matrixIndices.colIdx === 0 ||
      currentData.matrixIndices.colIdx === 3
    ) {
      if (currentData.siteRotY > prevData.siteRotY) {
        return { posX: 1.5, posY: 0 };
      } else if (currentData.siteRotY < prevData.siteRotY) {
        return { posX: -1.5, posY: 0 };
      }
    } else if (
      currentData.matrixIndices.colIdx === 1 ||
      currentData.matrixIndices.colIdx === 2
    ) {
      if (currentData.siteRotY > prevData.siteRotY) {
        return { posX: 0.5, posY: 0 };
      } else if (currentData.siteRotY < prevData.siteRotY) {
        return { posX: -0.5, posY: 0 };
      }
    }
  }
};
