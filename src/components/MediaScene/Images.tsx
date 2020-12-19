import React, { useEffect, useMemo, useState } from "react";
import { useLevelStore, useMediaStore, useNodeStore } from "../../store";
import { a, useSpring } from "@react-spring/three";
import { LevelType, SiteType } from "../MainScene/Site";
import site_a from "../../resources/site_a.json";
import dummy from "../../static/sprite/dummy.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";

const Images = () => {
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const [imageScaleY, setImageScaleY] = useState(3.75);
  const [sceneImages, setSceneImages] = useState([] as any);
  const [activeImage, setActiveImage] = useState<THREE.Texture>();

  const dummyTex = useLoader(THREE.TextureLoader, dummy);

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
    const images = (site_a as SiteType)[activeLevel][activeNodeId]
      .image_table_indices;

    const imgArr: { default: string }[] = [];
    Object.entries(images).forEach((img) => {
      import("../../static/media_images/a/" + img[1] + ".png").then(
        (imageSrc: { default: string }) => {
          imgArr.splice(parseInt(img[0]), 0, imageSrc);
          if (imgArr.length === 3) {
            setSceneImages(imgArr);
            new THREE.TextureLoader().load(imgArr[0].default, setActiveImage);
          }
        }
      );
    });
  }, [activeLevel, activeLevelData, activeNodeId]);

  useEffect(() => {
    if (mediaPercentageElapsed === 0 && sceneImages[0]) {
      new THREE.TextureLoader().load(sceneImages[0].default, setActiveImage);
    }
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
      <spriteMaterial
        attach="material"
        map={activeImage ? activeImage : dummyTex}
      />
    </a.sprite>
  );
};

export default Images;
