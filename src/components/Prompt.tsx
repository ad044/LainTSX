import React, { useCallback, useEffect } from "react";
import answerContainer from "../static/sprite/prompt_answer_container.png";
import questionContainer from "../static/sprite/prompt_question_container.png";
import yes from "../static/sprite/prompt_yes.png";
import no from "../static/sprite/prompt_no.png";
import question from "../static/sprite/prompt_question.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../store";

const Prompt = () => {
  const questionContainerTex = useLoader(
    THREE.TextureLoader,
    questionContainer
  );
  const answerContainerTex = useLoader(THREE.TextureLoader, answerContainer);
  const questionTex = useLoader(THREE.TextureLoader, question);
  const yesTex = useLoader(THREE.TextureLoader, yes);
  const noTex = useLoader(THREE.TextureLoader, no);

  const activeComponent = useStore(
    useCallback(
      (state) => state.promptComponentMatrix[state.promptComponentMatrixIdx],
      []
    )
  );

  return (
    <>
      <sprite scale={[4.1, 0.3, 0]} renderOrder={200} position={[0, 0.2, 0]}>
        <spriteMaterial
          map={questionContainerTex}
          attach="material"
          transparent={true}
          opacity={0.6}
          depthTest={false}
        />
      </sprite>

      <sprite scale={[2, 0.24, 0]} renderOrder={200} position={[0, 0.19, 0]}>
        <spriteMaterial
          map={questionTex}
          attach="material"
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite
        scale={[0.5, 0.19, 0]}
        renderOrder={200}
        position={[-1.2, -0.2, 0]}
      >
        <spriteMaterial
          map={yesTex}
          attach="material"
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite
        scale={[0.7, 0.3, 0]}
        renderOrder={199}
        position={activeComponent === "yes" ? [-1.2, -0.2, 0] : [1.2, -0.2, 0]}
      >
        <spriteMaterial
          map={answerContainerTex}
          attach="material"
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite
        scale={[0.4, 0.19, 0]}
        renderOrder={200}
        position={[1.2, -0.2, 0]}
      >
        <spriteMaterial
          map={noTex}
          attach="material"
          transparent={true}
          depthTest={false}
        />
      </sprite>
    </>
  );
};

export default Prompt;
