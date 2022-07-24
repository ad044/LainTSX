import React, { memo, useMemo } from "react";
import { FrontSide, BackSide, PlaneBufferGeometry } from "three";
import { a, useSpring } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { MatrixIndex2D, Position, Rotation } from "@/types";

export type PauseSquareProps = {
  indices: MatrixIndex2D;
  position: Position;
  isLetterSquare: boolean;
  active: boolean;
  introFinished: boolean;
  exit: boolean;
};

const PauseSquare = (props: PauseSquareProps) => {
  const square = useTexture("/sprites/main/pause_gray_boxes.png");
  const { row, col } = props.indices;

  const introSpring = useSpring<{ position: Position; rotation: Rotation }>({
    from: {
      position: [1.05, 1.07, 0],
      rotation: [Math.PI, Math.PI, -1],
    },
    to: async (next) => {
      await next({
        position: props.position,
        rotation: [Math.PI, Math.PI, 0],
        config: { duration: 500 },
      });
      await next({
        rotation: [0, props.isLetterSquare ? Math.PI / 2 : 0, 0],
        delay: (row + col) * 100,
        config: { duration: 200 },
      });
    },
  });

  const targetExitPos = useMemo(() => {
    let x, y;
    if (col < 3) x = -1;
    else if (col > 3) x = 1;
    else x = 0;

    if (row < 3) y = -1;
    else if (row > 3) y = 1;
    else y = 0;

    return [props.position[0] + x * 2.2, props.position[1] + y * 2.2, 0];
  }, [col, props.position, row]);

  const spring = useSpring<{ position: Position; rotation: Rotation }>({
    position: props.exit ? targetExitPos : props.position,
    rotation: [
      props.active ? Math.PI : 0,
      props.isLetterSquare
        ? Math.PI / 2
        : props.active || props.exit
        ? Math.PI / 2
        : 0,
      0,
    ],
    config: { duration: 500 },
  });

  const geom = useMemo(() => {
    let vOffset = col;
    if (vOffset > 3) {
      vOffset = 6 - col;
    }

    let uOffset = row;
    if (uOffset > 3) {
      uOffset = 6 - row;
    }

    const geometry = new PlaneBufferGeometry();
    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * 16) / 256 + (uOffset * 64) / 256 + (vOffset * 16) / 256;

      uvAttribute.setXY(i, u, v);
    }
    return geometry;
  }, [col, row]);

  return (
    <a.mesh
      position={props.introFinished ? spring.position : introSpring.position}
      // NOTE (cast to any)
      // throws a type error, but works
      rotation={
        (props.introFinished ? spring.rotation : introSpring.rotation) as any
      }
      geometry={geom}
      scale={[col > 3 ? -0.25 : 0.25, row <= 3 ? -0.25 : 0.25, 0]}
      renderOrder={100}
    >
      <meshBasicMaterial
        map={square}
        side={
          (col > 3 && row <= 3) || (col <= 3 && row > 3) ? FrontSide : BackSide
        }
        transparent={true}
        depthTest={false}
      />
    </a.mesh>
  );
};

export default memo(PauseSquare);
