import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { useStore } from "../store";
import EndSelectionScreen from "../components/EndScene/EndSelectionScreen";

const EndScene = () => {
  const mediaPlayedCount = useStore((state) => state.endMediaPlayedCount);

  const mainCylinderRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (mainCylinderRef.current) {
      mainCylinderRef.current.rotation.y -= 0.01;
      if (sceneOutro) {
        mainCylinderRef.current.position.z -= 0.25;
        mainCylinderRef.current.rotation.y -= 0.05;
        if (mainCylinderRef.current.scale.y > 0.6) {
          mainCylinderRef.current.scale.y -= 0.01;
        }
      }
    }
  });

  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);
  const [sceneOutro, setSceneOutro] = useState(false);

  useEffect(() => {
    if (mediaPlayedCount === 1) {
      setTimeout(() => {
        const mediaElement = document.getElementById(
          "media"
        ) as HTMLMediaElement;

        if (mediaElement) {
          mediaElement.play();
          setIsIntro(false);
        }
      }, 3800);
    } else if (mediaPlayedCount > 1) {
      setIsOutro(true);
      setTimeout(() => {
        setSceneOutro(true);
      }, 4000);
    }
  }, [mediaPlayedCount]);

  // return mediaPlayedCount > 0 ? (
  //   <>
  //     <pointLight position={[0, 0, 5]} intensity={0.9} />
  //     <pointLight position={[0, 0, -5]} intensity={0.9} />
  //
  //     <group ref={mainCylinderRef} position={[0, -1, 2.2]}>
  //       <EndCylinder />
  //     </group>
  //     <EndSphere position={[-1.8, -1.6, 1.4]} outroAnim={sceneOutro} />
  //     <EndSphere position={[1.8, -0.5, 0]} outroAnim={sceneOutro} />
  //     <EndSphere position={[2, -1.7, 1]} outroAnim={sceneOutro} />
  //     <EndSphere position={[-1.6, 1.4, 1.5]} outroAnim={sceneOutro} />
  //     <EndSphere position={[2, 1.7, -0.5]} outroAnim={sceneOutro} />
  //     <LainSpeak intro={isIntro} outro={isOutro} />
  //   </>
  // ) : (
  //   <></>
  // );
  return <EndSelectionScreen />;
};

export default EndScene;
