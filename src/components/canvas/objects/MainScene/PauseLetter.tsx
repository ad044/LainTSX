import bigFont from "@/json/font/big_font.json";
import { a, useSpring } from "@react-spring/three";
import React, { useMemo, memo } from "react";
import { useTexture } from "@react-three/drei";
import useLetterGeometry from "@/hooks/useLetterGeometry";
import { FrontSide } from "three";
import { MatrixIndex2D, Position, Rotation } from "@/types";

export type PauseLetterProps = {
  indices: MatrixIndex2D;
  position: Position;
  letter: string;
  isMain: boolean;

  active: boolean;
  introFinished: boolean;
  exit: boolean;
};

const PauseLetter = (props: PauseLetterProps) => {
  const whiteFont = useTexture("/sprites/fonts/white_and_green_texture.png");
  const orangeFont = useTexture("/sprites/fonts/orange_font_texture.png");
  const yellowFont = useTexture("/sprites/fonts/yellow_font_texture.png");

  const { row, col } = props.indices;

  const letterData = useMemo(
    () => bigFont.glyphs[props.letter as keyof typeof bigFont.glyphs],
    [props.letter]
  );

  const geom = useLetterGeometry(letterData, 256, 136);

  const mainLetterIntroSpring = useSpring({
    from: {
      rotation: [Math.PI, Math.PI / 2, 0],
    },
    to: {
      rotation: [0, 0, 0],
    },
    delay: (row + col) * 100 + 500,
    config: { duration: 500 },
  });

  const targetExitPos = useMemo(() => {
    let x, y;
    if (col! < 3) x = -1;
    else if (col! > 3) x = 1;
    else x = 0;

    if (row! < 3) y = -1;
    else if (row! > 3) y = 1;
    else y = 0;

    return [props.position[0] + x * 2.2, props.position[1] + y * 2.2, 0];
  }, [col, props.position, row]);

  const mainLetterSpring = useSpring<{
    position: Position;
    orangeRotation: Rotation;
    whiteRotation: Rotation;
  }>({
    orangeRotation: props.active ? [0, 0, 0] : [Math.PI, Math.PI / 2, 0],
    whiteRotation:
      props.active || props.exit ? [Math.PI, Math.PI / 2, 0] : [0, 0, 0],
    position: props.exit ? targetExitPos : props.position,
    config: { duration: 500 },
  });

  const letterSpring = useSpring<{ rotation: [number, number, number] }>({
    rotation: props.active ? [0, 0, 0] : [Math.PI, Math.PI / 2, 0],
    config: { duration: 500 },
  });

  return (
    <>
      {props.isMain ? (
        <>
          <a.mesh
            scale={[0.25, 0.25, 0]}
            geometry={geom}
            // NOTE (cast to any)
            // throws a type error, but works
            rotation={
              (props.introFinished
                ? mainLetterSpring.orangeRotation
                : mainLetterIntroSpring.rotation) as any
            }
            position={mainLetterSpring.position}
            renderOrder={100}
          >
            <meshBasicMaterial
              map={props.introFinished ? orangeFont : whiteFont}
              transparent={true}
              side={FrontSide}
              depthTest={false}
            />
          </a.mesh>
          <a.mesh
            scale={[0.25, 0.25, 0]}
            geometry={geom}
            position={mainLetterSpring.position}
            // NOTE (cast to any)
            // throws a type error, but works
            rotation={
              props.introFinished
                ? mainLetterSpring.whiteRotation
                : ([Math.PI, Math.PI / 2, 0] as any)
            }
            renderOrder={100}
          >
            <meshBasicMaterial
              map={whiteFont}
              transparent={true}
              side={FrontSide}
              depthTest={false}
            />
          </a.mesh>
        </>
      ) : (
        <a.mesh
          position={[
            props.position[0],
            -letterData[4] / 50 + props.position[1],
            props.position[2],
          ]}
          scale={[0.25, 0.25, 0]}
          geometry={geom}
          // NOTE (cast to any)
          // throws a type error, but works
          rotation={letterSpring.rotation as any}
          renderOrder={100}
        >
          <meshBasicMaterial
            map={yellowFont}
            transparent={true}
            side={FrontSide}
            depthTest={false}
          />
        </a.mesh>
      )}
    </>
  );
};

export default memo(PauseLetter);
