import { Position, Scale, TextType } from "@/types";
import { a, useTrail, useSprings } from "@react-spring/three";
import Letter from "./Letter";
import { useTexture } from "@react-three/drei";
import useText from "@/hooks/useText";

type BigTextRendererProps = {
  position: Position;
  scale: Scale;
  text: string;
  shrinked: boolean;
  type: TextType.BigOrange | TextType.BigYellow;
};

const AnimatedBigTextRenderer = (props: BigTextRendererProps) => {
  const { font, texture } = useText(props.type);
  const orangeFont = useTexture("/sprites/fonts/orange_font_texture.png");

  const trail = useTrail(props.text.length, {
    position: props.position,
    config: { duration: 100 },
  });

  const springs = useSprings(
    props.text.length,
    props.text.split("").map((_, i) => ({
      x: props.shrinked ? 0 : i + 0.3,
      config: { duration: 200 },
    }))
  );

  return (
    <group position={[0, 0, 10]}>
      {trail.map(({ position }, idx) => (
        <a.group key={idx} position={position} scale={props.scale}>
          <Letter
            key={idx}
            texture={idx === 0 ? orangeFont : texture}
            letter={props.text[idx]}
            font={font}
            posX={springs[idx].x}
            scale={[1, 1, 0]}
          />
        </a.group>
      ))}
    </group>
  );
};

export default AnimatedBigTextRenderer;
