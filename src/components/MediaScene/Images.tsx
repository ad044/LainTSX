import React, { useEffect, useMemo, useState } from "react";
import { useLoader } from "react-three-fiber";
import { useLevelStore, useMediaStore, useNodeStore } from "../../store";
import { a, useSpring } from "@react-spring/three";
import image_table from "../../resources/image_table.json";
import { LevelType } from "../MainScene/Site";
import site_a from "../../resources/site_a.json";
import * as THREE from "three";

const Images = () => {
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const [imageScaleY, setImageScaleY] = useState(3.75);
  const [sceneImages, setSceneImages] = useState([] as any);
  const [activeImage, setActiveImage] = useState<THREE.Texture>();

  const mediaPercentageElapsed = useMediaStore(
    (state) => state.mediaPercentageElapsed
  );

  const imageScaleState = useSpring({
    imageScaleY: imageScaleY,
    config: { duration: 300 },
  });

  const activeLevel = useLevelStore((state) => state.activeLevel);
  const activeLevelData: LevelType = useMemo(
    () => site_a[activeLevel as keyof typeof site_a],
    [activeLevel]
  );

  useEffect(() => {
    const nodeName = activeLevelData[activeNodeId].node_name;

    const images = image_table[nodeName as keyof typeof image_table];

    const imgArr: { default: string }[] = [];
    Object.values(images).forEach((img) => {
      import("../../static/media_images/site_a/" + img + ".png").then(
        (imageSrc: { default: string }) => {
          // images are unordered by default so we insert them into the arr
          // according to their last char
          imgArr.splice(parseInt(img.substr(img.length - 1)), 0, imageSrc);
          if (imgArr.length === 3) {
            setSceneImages(imgArr);
            new THREE.TextureLoader().load(imgArr[0].default, setActiveImage);
          }
        }
      );
    });
  }, [activeLevelData, activeNodeId]);

  useEffect(() => {
    if (mediaPercentageElapsed === 35 && sceneImages[1]) {
      setImageScaleY(0);
      setTimeout(() => {
        new THREE.TextureLoader().load(sceneImages[1].default, setActiveImage);
        setImageScaleY(3.75);
      }, 300);
    }
    if (mediaPercentageElapsed === 70 && sceneImages[2]) {
      setImageScaleY(0);
      setTimeout(() => {
        new THREE.TextureLoader().load(sceneImages[2].default, setActiveImage);
        setImageScaleY(3.75);
      }, 300);
    }
  }, [mediaPercentageElapsed, sceneImages]);

  return (
    <a.sprite
      position={[-0.2, 0.6, -4]}
      scale={[5, 3.75, 0]}
      scale-y={imageScaleState.imageScaleY}
    >
      {sceneImages.length === 3 ? (
        <spriteMaterial attach="material" map={activeImage} />
      ) : (
        <></>
      )}
    </a.sprite>
  );
};

export default Images;
