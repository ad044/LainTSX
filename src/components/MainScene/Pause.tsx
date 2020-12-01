import React, { useCallback, useMemo, useRef, useState } from "react";
import pauseGrayBoxes from "../../static/sprite/pause_gray_boxes.png";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import BigLetter from "../TextRenderer/BigLetter";

const Pause = () => {
  const grayBoxesTex = useLoader(THREE.TextureLoader, pauseGrayBoxes);

  const generateSqaureGeom = useCallback((row: number, square: number) => {
    const geometry = new THREE.PlaneBufferGeometry();
    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * 16) / 256 + (row * 64) / 256 + (square * 16) / 256;

      uvAttribute.setXY(i, u, v);
    }
    return geometry;
  }, []);

  const squareGeoms = useMemo(
    () =>
      [0, 1, 2, 3].map((row: number) =>
        [0, 1, 2, 3, 2, 1, 0].map((col: number) => generateSqaureGeom(row, col))
      ),
    [generateSqaureGeom]
  );

  return (
    <group position={[-1, -0.8, 0]} scale={[0.9, 0.9, 0]}>
      {[0, 1, 2, 3, 2, 1, 0].map((row: number, rowIdx: number) =>
        [0, 1, 2, 3, 4, 5, 6].map((col: number) => {
          if (rowIdx === 5 && col > 0) {
            return col === 1 ? (
              <>
                <group scale={[0.2, 0.2, 0]} position={[0.1, 1.8, 0]}>
                  <BigLetter
                    color={"white"}
                    letter={"L"}
                    letterIdx={col}
                    yellowTextOffsetXCoeff={col / 7}
                    key={col}
                  />
                </group>
                )
              </>
            ) : (
              <mesh
                geometry={squareGeoms[row][col]}
                position={[col / 2.8, rowIdx / 2.8, 0]}
                scale={[col > 3 ? -0.25 : 0.25, rowIdx <= 3 ? -0.25 : 0.25, 0]}
                key={col}
              >
                <meshBasicMaterial
                  attach="material"
                  map={grayBoxesTex}
                  side={
                    (col > 3 && rowIdx <= 3) || (col <= 3 && rowIdx > 3)
                      ? THREE.FrontSide
                      : THREE.BackSide
                  }
                />
              </mesh>
            );
          } else if (rowIdx === 4 && col === 4) {
            return (
              <>
                <group scale={[0.2, 0.2, 0]} position={[0.1, 1.45, 0]}>
                  <BigLetter
                    color={"white"}
                    letter={"A"}
                    letterIdx={col}
                    yellowTextOffsetXCoeff={col / 7}
                    key={col}
                  />
                </group>
              </>
            );
          } else if (rowIdx === 3 && col === 3) {
            return (
              <>
                <group scale={[0.2, 0.2, 0]} position={[0.12, 1.05, 0]}>
                  <BigLetter
                    color={"white"}
                    letter={"C"}
                    letterIdx={col}
                    yellowTextOffsetXCoeff={col / 7}
                    key={col}
                  />
                </group>
              </>
            );
          } else {
            return (
              <mesh
                geometry={squareGeoms[row][col]}
                position={[col / 2.8, rowIdx / 2.8, 0]}
                scale={[col > 3 ? -0.25 : 0.25, rowIdx <= 3 ? -0.25 : 0.25, 0]}
                key={col}
              >
                <meshBasicMaterial
                  attach="material"
                  map={grayBoxesTex}
                  side={
                    (col > 3 && rowIdx <= 3) || (col <= 3 && rowIdx > 3)
                      ? THREE.FrontSide
                      : THREE.BackSide
                  }
                />
              </mesh>
            );
          }
        })
      )}
      {/*{"Load".split("").map((letter, idx) => (*/}
      {/*  <group scale={[0.2, 0.2, 0]} position={[0.35 + idx / 8, 1.8, 0]}>*/}
      {/*    <BigLetter*/}
      {/*      color={idx > 0 ? "yellow" : "orange"}*/}
      {/*      letter={letter}*/}
      {/*      letterIdx={idx}*/}
      {/*      yellowTextOffsetXCoeff={0}*/}
      {/*      key={idx}*/}
      {/*    />*/}
      {/*  </group>*/}
      {/*))}*/}

      {/*{"About".split("").map((letter, idx) => (*/}
      {/*  <group scale={[0.2, 0.2, 0]} position={[1.4 + idx / 8, 1.45, 0]}>*/}
      {/*    <BigLetter*/}
      {/*      color={idx > 0 ? "yellow" : "orange"}*/}
      {/*      letter={letter}*/}
      {/*      letterIdx={idx}*/}
      {/*      yellowTextOffsetXCoeff={0}*/}
      {/*      key={idx}*/}
      {/*    />*/}
      {/*  </group>*/}
      {/*))}*/}

      {/*{"Change".split("").map((letter, idx) => (*/}
      {/*  <group scale={[0.2, 0.2, 0]} position={[1 + idx / 6, 1.05, 0]}>*/}
      {/*    <BigLetter*/}
      {/*      color={idx > 0 ? "yellow" : "orange"}*/}
      {/*      letter={letter}*/}
      {/*      letterIdx={idx}*/}
      {/*      yellowTextOffsetXCoeff={0}*/}
      {/*      key={idx}*/}
      {/*    />*/}
      {/*  </group>*/}
      {/*))}*/}

      {/*{"Save".split("").map((letter, idx) => (*/}
      {/*  <group scale={[0.2, 0.2, 0]} position={[0.3 + idx / 7, 0.35, 0]}>*/}
      {/*    <BigLetter*/}
      {/*      color={idx > 0 ? "yellow" : "orange"}*/}
      {/*      letter={letter}*/}
      {/*      letterIdx={idx}*/}
      {/*      yellowTextOffsetXCoeff={0}*/}
      {/*      key={idx}*/}
      {/*    />*/}
      {/*  </group>*/}
      {/*))}*/}

      {/*{"Exit".split("").map((letter, idx) => (*/}
      {/*  <group scale={[0.2, 0.2, 0]} position={[1.75 + idx / 8, 0, 0]}>*/}
      {/*    <BigLetter*/}
      {/*      color={idx > 0 ? "yellow" : "orange"}*/}
      {/*      letter={letter}*/}
      {/*      letterIdx={idx}*/}
      {/*      yellowTextOffsetXCoeff={0}*/}
      {/*      key={idx}*/}
      {/*    />*/}
      {/*  </group>*/}
      {/*))}*/}
    </group>
  );
};

export default Pause;
