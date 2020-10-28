import React, { useEffect, useState } from "react";
import { useLoader } from "react-three-fiber";
import { useImageStore, useMediaStore } from "../../store";
import * as THREE from "three";
import sex from "../../static/sprite/gray_ring_lof.png";
import { a, useSpring } from "@react-spring/three";

const Images = () => {
  const [imageScaleY, setImageScaleY] = useState(3.75);
  const images = useImageStore((state) => state.images);
  const [activeImage, setActiveImage] = useState<any>(sex);

  const activeImageTex = useLoader(THREE.TextureLoader, activeImage);

  const mediaPercentageElapsed = useMediaStore(
    (state) => state.mediaPercentageElapsed
  );

  const imageScaleState = useSpring({
    imageScaleY: imageScaleY,
    config: { duration: 300 },
  });

  useEffect(() => {
    if (images[1]) {
      setActiveImage(images[1].default);
    }
  }, [images]);

  useEffect(() => {
    if (mediaPercentageElapsed === 35 && images[2]) {
      setImageScaleY(0);
      setTimeout(() => {
        setActiveImage(images[2]!.default);
        setImageScaleY(3.75);
      }, 300);
    }
    if (mediaPercentageElapsed === 70 && images[3]) {
      setImageScaleY(0);
      setTimeout(() => {
        setActiveImage(images[3]!.default);
        setImageScaleY(3.75);
      }, 300);
    }
  }, [images, mediaPercentageElapsed]);

  return (
    <a.sprite
      position={[-0.2, 0.6, -4]}
      scale={[5, 3.75, 0]}
      scale-y={imageScaleState.imageScaleY}
    >
      <spriteMaterial attach="material" map={activeImageTex} />
    </a.sprite>
  );
};

export default Images;
