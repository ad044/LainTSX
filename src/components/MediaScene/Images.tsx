import React, { useEffect, useMemo, useState } from "react";
import {
  useLevelStore,
  useMediaStore,
  useNodeStore,
  useSiteStore,
} from "../../store";
import { a, useSpring } from "@react-spring/three";
import { LevelType, SiteType } from "../MainScene/Site";
import site_a from "../../resources/site_a.json";
import site_b from "../../resources/site_b.json";
import dummy from "../../static/sprite/dummy.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";

const Images = () => {
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const [imageScaleY, setImageScaleY] = useState(3.75);
  const [sceneImages, setSceneImages] = useState([] as any);
  const [activeImage, setActiveImage] = useState<THREE.Texture>();

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = currentSite === "a" ? site_a : site_b;

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
    () => siteData[activeLevel as keyof typeof siteData],
    [activeLevel, siteData]
  );

  useEffect(() => {
    const images = (siteData as SiteType)[activeLevel][activeNodeId]
      .image_table_indices;

    // checking the length of the img arr doesn't work in some cases
    // since the amount of images varies from 1 to 3.
    // we try all 3 of them for each case, so logging the count to
    // determine whether or not its complete is optimal i think.
    let imgTries = 0;
    const imgArr: { default: string }[] = [];
    Object.entries(images).forEach((img) => {
      imgTries++;
      if (img[1] !== "-1") {
        import(
          "../../static/media_images/" + currentSite + "/" + img[1] + ".png"
        ).then((imageSrc: { default: string }) => {
          imgArr.splice(parseInt(img[0]), 0, imageSrc);
          console.log(imgTries);
          if (imgTries === 3) {
            setSceneImages(imgArr);
            new THREE.TextureLoader().load(imgArr[0].default, setActiveImage);
            console.log(imgArr);
          }
        });
      }
    });
  }, [activeLevel, activeLevelData, activeNodeId, currentSite, siteData]);

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
