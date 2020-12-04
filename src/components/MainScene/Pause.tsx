import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import PauseSquare from "./PauseSquare";
import StaticBigLetter from "../TextRenderer/StaticBigLetter";
import { usePauseStore } from "../../store";

const Pause = (props: { visible: boolean }) => {
  const [intro, setIntro] = useState(true);
  const [animation, setAnimation] = useState(false);

  const componentMatrixIdx = usePauseStore((state) => state.componentMatrixIdx);
  const activeComponent = usePauseStore(
    useCallback(
      (state) => (intro ? "" : state.componentMatrix[componentMatrixIdx]),
      [componentMatrixIdx, intro]
    )
  );

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

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        setAnimation(true);
      }, 1000);
      setTimeout(() => {
        setIntro(false);
      }, 3000);
    }
  }, [props.visible]);

  return animation ? (
    <group position={[-1, -0.8, 0]} scale={[0.9, 0.9, 0]}>
      {[0, 1, 2, 3, 2, 1, 0].map((row: number, rowIdx: number) =>
        [0, 1, 2, 3, 4, 5, 6].map((col: number) => {
          if (rowIdx === 5 && col > 0 && col < 5) {
            return col === 1 ? (
              <>
                <StaticBigLetter
                  color={"white"}
                  letter={"L"}
                  letterIdx={col}
                  position={[0.35, 1.8, 0]}
                  scale={[0.25, 0.25, 0.25]}
                  active={!(activeComponent === "load")}
                  key={col}
                  rowIdx={rowIdx}
                  colIdx={col}
                />
                <PauseSquare
                  geometry={squareGeoms[row][col]}
                  rowIdx={rowIdx}
                  colIdx={col}
                  key={col}
                  shouldDisappear={true}
                />
              </>
            ) : (
              <PauseSquare
                geometry={squareGeoms[row][col]}
                rowIdx={rowIdx}
                colIdx={col}
                active={!(activeComponent === "load")}
                key={col}
              />
            );
          } else if (rowIdx === 4 && col > 4 && col < 7) {
            return col === 5 ? (
              <>
                <StaticBigLetter
                  color={"white"}
                  letter={"A"}
                  letterIdx={col}
                  position={[1.78, 1.43, 0]}
                  scale={[0.25, 0.25, 0]}
                  active={!(activeComponent === "about")}
                  key={col}
                  rowIdx={rowIdx}
                  colIdx={col}
                />
                <PauseSquare
                  geometry={squareGeoms[row][col]}
                  rowIdx={rowIdx}
                  colIdx={col}
                  key={col}
                  shouldDisappear={true}
                />
              </>
            ) : (
              <PauseSquare
                geometry={squareGeoms[row][col]}
                rowIdx={rowIdx}
                colIdx={col}
                active={!(activeComponent === "about")}
                key={col}
              />
            );
          } else if (rowIdx === 3 && col > 2 && col < 7) {
            return col === 3 ? (
              <>
                <StaticBigLetter
                  color={"white"}
                  letter={"C"}
                  letterIdx={col}
                  position={[1.05, 1.07, 0]}
                  scale={[0.25, 0.25, 0]}
                  active={!(activeComponent === "change")}
                  key={col}
                  rowIdx={rowIdx}
                  colIdx={col}
                />
                <PauseSquare
                  geometry={squareGeoms[row][col]}
                  rowIdx={rowIdx}
                  colIdx={col}
                  key={col}
                  shouldDisappear={true}
                />
              </>
            ) : (
              <PauseSquare
                geometry={squareGeoms[row][col]}
                rowIdx={rowIdx}
                colIdx={col}
                active={!(activeComponent === "change")}
                key={col}
              />
            );
          } else if (rowIdx === 1 && col > 0 && col < 5) {
            return col === 1 ? (
              <>
                <StaticBigLetter
                  color={"white"}
                  letter={"S"}
                  letterIdx={col}
                  position={[0.35, 0.35, 0]}
                  scale={[0.25, 0.25, 0]}
                  active={!(activeComponent === "save")}
                  key={col}
                  rowIdx={rowIdx}
                  colIdx={col}
                />
                <PauseSquare
                  geometry={squareGeoms[row][col]}
                  rowIdx={rowIdx}
                  colIdx={col}
                  key={col}
                  shouldDisappear={true}
                />
              </>
            ) : (
              <PauseSquare
                geometry={squareGeoms[row][col]}
                rowIdx={rowIdx}
                colIdx={col}
                active={!(activeComponent === "save")}
                key={col}
              />
            );
          } else if (rowIdx === 0 && col > 4 && col < 7) {
            return col === 5 ? (
              <>
                <StaticBigLetter
                  color={"white"}
                  letter={"E"}
                  letterIdx={col}
                  position={[1.78, 0, 0]}
                  scale={[0.25, 0.25, 0]}
                  active={!(activeComponent === "exit")}
                  key={col}
                  rowIdx={1}
                  colIdx={col}
                />
                <PauseSquare
                  geometry={squareGeoms[row][col]}
                  rowIdx={rowIdx}
                  colIdx={col}
                  key={col}
                  shouldDisappear={true}
                />
              </>
            ) : (
              <PauseSquare
                geometry={squareGeoms[row][col]}
                rowIdx={rowIdx}
                colIdx={col}
                active={!(activeComponent === "exit")}
                key={col}
              />
            );
          } else {
            return (
              <PauseSquare
                geometry={squareGeoms[row][col]}
                rowIdx={rowIdx}
                colIdx={col}
                key={col}
                active={true}
              />
            );
          }
        })
      )}
      {"Load".split("").map((letter, idx) => (
        <StaticBigLetter
          color={idx > 0 ? "yellow" : "orange"}
          letter={letter}
          letterIdx={idx}
          key={idx}
          position={[0.35 + idx / 2.8, 1.8, 0]}
          scale={[0.25, 0.25, 0.25]}
          active={activeComponent === "load"}
        />
      ))}

      {"About".split("").map((letter, idx) => (
        <StaticBigLetter
          color={idx > 0 ? "yellow" : "orange"}
          letter={letter}
          letterIdx={idx}
          position={[1.78 + idx / 2.8, 1.43, 0]}
          scale={[0.25, 0.25, 0]}
          active={activeComponent === "about"}
          key={idx}
        />
      ))}

      {"Change".split("").map((letter, idx) => (
        <StaticBigLetter
          color={idx > 0 ? "yellow" : "orange"}
          letter={letter}
          letterIdx={idx}
          position={[1.05 + idx / 2.8, 1.07, 0]}
          scale={[0.25, 0.25, 0]}
          active={activeComponent === "change"}
          key={idx}
        />
      ))}

      {"Save".split("").map((letter, idx) => (
        <StaticBigLetter
          color={idx > 0 ? "yellow" : "orange"}
          letter={letter}
          letterIdx={idx}
          position={[0.35 + idx / 2.8, 0.35, 0]}
          scale={[0.25, 0.25, 0]}
          active={activeComponent === "save"}
          key={idx}
        />
      ))}

      {"Exit".split("").map((letter, idx) => (
        <StaticBigLetter
          color={idx > 0 ? "yellow" : "orange"}
          letter={letter}
          letterIdx={idx}
          position={[1.78 + idx / 2.8, 0, 0]}
          scale={[0.25, 0.25, 0]}
          key={idx}
          active={activeComponent === "exit"}
        />
      ))}
    </group>
  ) : (
    <></>
  );
};

export default Pause;
