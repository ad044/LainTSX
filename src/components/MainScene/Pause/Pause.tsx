import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import PauseSquare from "./PauseSquare";
import PauseBigLetter from "../../TextRenderer/PauseBigLetter";
import { useStore } from "../../../store";

const Pause = () => {
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

  const letterLocs = useMemo(
    () => ({
      "05": { letter: "E" },
      "11": { letter: "S" },
      "33": { letter: "C" },
      "45": { letter: "A" },
      "51": { letter: "L" },
    }),
    []
  );

  const subscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.currentScene);
  const setInputCooldown = useStore((state) => state.setInputCooldown);

  const [visible, setVisible] = useState(false);
  const [finished, setFinished] = useState(false);
  const [exit, setExit] = useState(false);

  const activeComponent = useStore(
    useCallback((state) => (finished ? state.activePauseComponent : ""), [
      finished,
    ])
  );

  const isMountedRef = useRef<boolean>();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, [scene]);

  useEffect(() => {
    if (subscene === "pause") {
      setTimeout(() => setVisible(true), 4400);
      setTimeout(() => setFinished(true), 7300);
      setTimeout(() => setInputCooldown(1000), 7600);

      return () => {
        setExit(true);

        if (isMountedRef.current) {
          setTimeout(() => {
            setVisible(false);
            setFinished(false);
            setExit(false);
          }, 1200);
        } else {
          setVisible(false);
          setFinished(false);
          setExit(false);
        }
      };
    }
  }, [setInputCooldown, subscene]);

  const whenActive = useCallback((rowIdx: number, colIdx: number) => {
    switch (rowIdx) {
      case 5:
        if (colIdx > 1 && colIdx < 5) return "load";
        break;
      case 4:
        if (colIdx > 5 && colIdx < 7) return "about";
        break;
      case 3:
        if (colIdx > 3 && colIdx < 7) return "change";
        break;
      case 1:
        if (colIdx > 1 && colIdx < 5) return "save";
        break;
      case 0:
        if (colIdx > 4 && colIdx < 7) return "exit";
        break;
    }
  }, []);

  return (
    <>
      {visible && (
        <group position={[-0.9, -0.7, 0]} scale={[0.85, 0.85, 0]}>
          {[0, 1, 2, 3, 2, 1, 0].map((r: number, rowIdx: number) =>
            [0, 1, 2, 3, 4, 5, 6].map((c: number, colIdx: number) => {
              const key = `${rowIdx}${colIdx}`;

              const letter = letterLocs[key as keyof typeof letterLocs];
              if (letter)
                return (
                  <React.Fragment key={`${key}fragment`}>
                    <PauseBigLetter
                      letter={letter.letter}
                      letterIdx={0}
                      position={[colIdx / 2.8, rowIdx / 2.8, 0]}
                      rowIdx={rowIdx}
                      colIdx={colIdx}
                      mainLetter={true}
                      active={
                        letter.letter ===
                        activeComponent.charAt(0).toUpperCase()
                      }
                      introFinished={finished}
                      exit={exit}
                    />
                    <PauseSquare
                      geometry={squareGeoms[r][c]}
                      colIdx={colIdx}
                      rowIdx={rowIdx}
                      letter={letter.letter}
                      introFinished={finished}
                      exit={exit}
                    />
                  </React.Fragment>
                );
              else
                return (
                  <PauseSquare
                    geometry={squareGeoms[r][c]}
                    colIdx={colIdx}
                    rowIdx={rowIdx}
                    key={key}
                    active={activeComponent === whenActive(rowIdx, colIdx)}
                    introFinished={finished}
                    exit={exit}
                  />
                );
            })
          )}

          <>
            {"oad".split("").map((letter, idx) => (
              <PauseBigLetter
                letter={letter}
                letterIdx={idx}
                key={idx}
                position={[2 / 2.8 + idx / 2.8, 5 / 2.8, 0]}
                active={activeComponent === "load"}
              />
            ))}
            {"bout".split("").map((letter, idx) => (
              <PauseBigLetter
                letter={letter}
                letterIdx={idx}
                position={[6 / 2.8 + idx / 2.8, 4 / 2.8, 0]}
                active={activeComponent === "about"}
                key={idx}
              />
            ))}

            {"hange".split("").map((letter, idx) => (
              <PauseBigLetter
                letter={letter}
                letterIdx={idx}
                position={[4 / 2.8 + idx / 2.8, 3 / 2.8, 0]}
                active={activeComponent === "change"}
                key={idx}
              />
            ))}

            {"ave".split("").map((letter, idx) => (
              <PauseBigLetter
                letter={letter}
                letterIdx={idx}
                position={[2 / 2.8 + idx / 2.8, 1 / 2.8, 0]}
                active={activeComponent === "save"}
                key={idx}
              />
            ))}
            {"xit".split("").map((letter, idx) => (
              <PauseBigLetter
                letter={letter}
                letterIdx={idx}
                position={[6 / 2.8 + idx / 2.8, 0, 0]}
                key={idx}
                active={activeComponent === "exit"}
              />
            ))}
          </>
        </group>
      )}
    </>
  );
};

export default Pause;
