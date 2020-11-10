import React from "react";
import loadDataUnderline from "../../static/sprite/load_data_header_underline.png";
import loadDataQuestionContainer from "../../static/sprite/load_data_question_container.png";
import loadDataAnswerContainer from "../../static/sprite/load_data_answer_container.png";
import areYouSure from "../../static/sprite/are_you_sure.png";
import yes from "../../static/sprite/Yes.png";
import no from "../../static/sprite/No.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { useBootStore } from "../../store";

type BootLoadDataProps = {
  visible: boolean;
};

const BootLoadData = (props: BootLoadDataProps) => {
  const loadDataUnderlineTex = useLoader(
    THREE.TextureLoader,
    loadDataUnderline
  );
  const loadDataQuestionContainerTex = useLoader(
    THREE.TextureLoader,
    loadDataQuestionContainer
  );
  const loadDataAnswerContainerTex = useLoader(
    THREE.TextureLoader,
    loadDataAnswerContainer
  );
  const areYouSureTex = useLoader(THREE.TextureLoader, areYouSure);
  const yesTex = useLoader(THREE.TextureLoader, yes);
  const noTex = useLoader(THREE.TextureLoader, no);

  const activeLoadDataElement = useBootStore(
    (state) => state.activeLoadDataElement
  );

  return (
    <>
      {props.visible ? (
        <>
          <sprite scale={[4.1, 0.3, 0]} renderOrder={2} position={[0, 0.2, 0]}>
            <spriteMaterial
              map={loadDataQuestionContainerTex}
              attach="material"
              transparent={true}
              opacity={0.6}
            />
          </sprite>

          <sprite scale={[2, 0.24, 0]} renderOrder={3} position={[0, 0.19, 0]}>
            <spriteMaterial
              map={areYouSureTex}
              attach="material"
              transparent={true}
            />
          </sprite>

          <sprite
            scale={[0.5, 0.19, 0]}
            renderOrder={3}
            position={[-1.2, -0.2, 0]}
          >
            <spriteMaterial map={yesTex} attach="material" transparent={true} />
          </sprite>

          <sprite
            scale={[0.7, 0.3, 0]}
            renderOrder={2}
            position={
              activeLoadDataElement === "yes" ? [-1.2, -0.2, 0] : [1.2, -0.2, 0]
            }
          >
            <spriteMaterial
              map={loadDataAnswerContainerTex}
              attach="material"
              transparent={true}
            />
          </sprite>

          <sprite
            scale={[0.4, 0.19, 0]}
            renderOrder={3}
            position={[1.2, -0.2, 0]}
          >
            <spriteMaterial map={noTex} attach="material" transparent={true} />
          </sprite>

          <sprite
            scale={[3.5, 0.01, 0]}
            position={[-0.5, -1.15, 0]}
            renderOrder={2}
          >
            <spriteMaterial
              map={loadDataUnderlineTex}
              attach="material"
              transparent={true}
            />
          </sprite>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BootLoadData;
