import React, { memo } from "react";
import { useStore } from "@/store";
import { PromptComponent } from "@/types";
import { useTexture } from "@react-three/drei";

const Prompt = () => {
  const questionContainer = useTexture(
    "/sprites/prompt/prompt_question_container.png"
  );
  const answerContainer = useTexture(
    "/sprites/prompt/prompt_answer_container.png"
  );
  const question = useTexture("/sprites/prompt/prompt_question.png");
  const yes = useTexture("/sprites/prompt/prompt_yes.png");
  const no = useTexture("/sprites/prompt/prompt_no.png");

  const activeComponent = useStore((state) => state.promptComponent);

  const promptVisible = useStore((state) => state.promptVisible);

  return (
    <group visible={promptVisible}>
      <sprite scale={[4.1, 0.3, 0]} renderOrder={200} position={[0, 0.2, 0]}>
        <spriteMaterial
          map={questionContainer}
          transparent={true}
          opacity={0.6}
          depthTest={false}
        />
      </sprite>

      <sprite scale={[2, 0.24, 0]} renderOrder={200} position={[0, 0.19, 0]}>
        <spriteMaterial map={question} transparent={true} depthTest={false} />
      </sprite>

      <sprite
        scale={[0.5, 0.19, 0]}
        renderOrder={200}
        position={[-1.2, -0.2, 0]}
      >
        <spriteMaterial map={yes} transparent={true} depthTest={false} />
      </sprite>

      <sprite
        scale={[0.7, 0.3, 0]}
        renderOrder={199}
        position={
          activeComponent === PromptComponent.Yes
            ? [-1.2, -0.2, 0]
            : [1.2, -0.2, 0]
        }
      >
        <spriteMaterial
          map={answerContainer}
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite
        scale={[0.4, 0.19, 0]}
        renderOrder={200}
        position={[1.2, -0.2, 0]}
      >
        <spriteMaterial map={no} transparent={true} depthTest={false} />
      </sprite>
    </group>
  );
};

export default memo(Prompt);
