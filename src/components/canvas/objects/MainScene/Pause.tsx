import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PauseSquare from "./PauseSquare";
import PauseLetter from "./PauseLetter";
import { useStore } from "@/store";
import { MainSubscene, PauseComponent, Position } from "@/types";
import { handleEvent } from "@/core";
import { setInputCooldown } from "@/core/events";

enum CellType {
  Square,
  MainSquareLetter,
  SquareLetter,
}

type SquareCell = {
  type: CellType.Square;
};

type LetterCell = {
  type: CellType.MainSquareLetter;
  letter: string;
};

type SquareLetterCell = {
  type: CellType.SquareLetter;
  letter: string;
};

const Pause = () => {
  const subscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.scene);

  const [visible, setVisible] = useState(false);
  const [finished, setFinished] = useState(false);
  const [exit, setExit] = useState(false);

  const activeComponent = useStore(
    useCallback((state) => (finished ? state.pauseComponent : null), [finished])
  );

  const isMountedRef = useRef<boolean>();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, [scene]);

  useEffect(() => {
    if (subscene === MainSubscene.Pause) {
      setTimeout(() => setVisible(true), 4400);
      setTimeout(() => setFinished(true), 7300);
      setTimeout(() => handleEvent(setInputCooldown(1000)), 7600);

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
  }, [subscene]);

  const componentInRange = (i: number, j: number): PauseComponent | null => {
    if (i === 5 && j > 1 && j < 5) {
      return PauseComponent.Load;
    }

    if (i === 4 && j > 5 && j < 10) {
      return PauseComponent.About;
    }

    if (i === 3 && j > 3 && j < 9) {
      return PauseComponent.Change;
    }

    if (i === 1 && j > 1 && j < 5) {
      return PauseComponent.Save;
    }

    if (i === 0 && j > 4 && j < 9) {
      return PauseComponent.Exit;
    }

    return null;
  };

  const isLetterActive = (
    currentComponent: PauseComponent | null,
    letter: string
  ) => {
    switch (letter) {
      case "L":
        return currentComponent === PauseComponent.Load;
      case "A":
        return currentComponent === PauseComponent.About;
      case "C":
        return currentComponent === PauseComponent.Change;
      case "S":
        return currentComponent === PauseComponent.Save;
      case "E":
        return currentComponent === PauseComponent.Exit;
      default:
        return false;
    }
  };

  // square cell
  const s = (): SquareCell => ({ type: CellType.Square });
  // main square letter cell
  const msl = (letter: string): LetterCell => ({
    type: CellType.MainSquareLetter,
    letter: letter,
  });
  // regular square letter cell
  const sl = (letter: string): SquareLetterCell => ({
    type: CellType.SquareLetter,
    letter: letter,
  });

  // prettier-ignore
  const cells = useMemo(
    () =>
      [
        [s(), s(), s(), s(), s(), s(), s(), null, null, null],
        [s(), msl("L"), sl("o"), sl("a"), sl("d"), s(), s(), null, null, null],
        [s(), s(), s(), s(), s(), msl("A"), sl("b"), sl("o"), sl("u"), sl("t")],
        [s(), s(), s(), msl("C"), sl("h"), sl("a"), sl("n"), sl("g"), sl("e"), null],
        [s(), s(), s(), s(), s(), s(), s(), null, null, null],
        [s(), msl("S"), sl("a"), sl("v"), sl("e"), s(), s(), null, null, null],
        [s(), s(), s(), s(), s(), msl("E"), sl("x"), sl("i"), sl("t"), null],
      ].reverse(),
    []
  );

  return visible ? (
    <group position={[-0.9, -0.7, 0]} scale={[0.85, 0.85, 0]}>
      {cells.map((row, i) =>
        row.map((cell, j) => {
          if (!cell) {
            return;
          }

          const position: Position = [j / 2.8, i / 2.8, 0];

          switch (cell.type) {
            case CellType.Square: {
              return (
                <PauseSquare
                  key={i + j}
                  position={position}
                  indices={{ row: i, col: j }}
                  isLetterSquare={false}
                  active={false}
                  introFinished={finished}
                  exit={exit}
                />
              );
            }
            case CellType.MainSquareLetter: {
              return (
                <React.Fragment key={i + j}>
                  <PauseLetter
                    position={position}
                    indices={{ row: i, col: j }}
                    letter={cell.letter}
                    isMain={true}
                    active={isLetterActive(activeComponent, cell.letter)}
                    introFinished={finished}
                    exit={exit}
                  />
                  <PauseSquare
                    position={position}
                    indices={{ row: i, col: j }}
                    isLetterSquare={true}
                    introFinished={finished}
                    exit={exit}
                    active={false}
                  />
                </React.Fragment>
              );
            }
            case CellType.SquareLetter: {
              if (j < 7) {
                return (
                  <React.Fragment key={i + j}>
                    <PauseLetter
                      position={position}
                      indices={{ row: i, col: j }}
                      letter={cell.letter}
                      isMain={false}
                      active={
                        activeComponent !== null &&
                        activeComponent === componentInRange(i, j)
                      }
                      introFinished={finished}
                      exit={exit}
                    />
                    <PauseSquare
                      position={position}
                      indices={{ row: i, col: j }}
                      isLetterSquare={false}
                      active={activeComponent === componentInRange(i, j)}
                      introFinished={finished}
                      exit={exit}
                    />
                  </React.Fragment>
                );
              } else {
                return (
                  <PauseLetter
                    key={i + j}
                    position={position}
                    indices={{ row: i, col: j }}
                    letter={cell.letter}
                    isMain={false}
                    active={
                      activeComponent !== null &&
                      activeComponent === componentInRange(i, j)
                    }
                    introFinished={finished}
                    exit={exit}
                  />
                );
              }
            }
          }
        })
      )}
    </group>
  ) : (
    <></>
  );
};

export default Pause;
