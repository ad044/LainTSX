import { useEffect, useState } from "react";
import { PlaneBufferGeometry } from "three";

const useLetterGeometry = (
  letterData: number[],
  atlasWidth: number,
  atlasHeight: number
) => {
  const [letterGeometry, setLetterGeometry] = useState<PlaneBufferGeometry>();

  useEffect(() => {
    const geometry = new PlaneBufferGeometry();

    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * letterData[2]) / atlasWidth + letterData[0] / atlasWidth;

      v =
        (v * letterData[3]) / atlasHeight +
        (1 - letterData[3] / atlasHeight - letterData[1] / atlasHeight) -
        letterData[4] / atlasHeight;

      uvAttribute.setXY(i, u, v);
    }

    setLetterGeometry(geometry);
  }, [atlasHeight, atlasWidth, letterData]);

  return letterGeometry;
};

export default useLetterGeometry;
