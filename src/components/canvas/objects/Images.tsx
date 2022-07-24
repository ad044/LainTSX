import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store";
import { a, useSpring } from "@react-spring/three";
import { TextureLoader } from "three";
import { GameSite, NodeData } from "@/types";
import { useTexture } from "@react-three/drei";

type ImagesProps = {
  imageTableIndices: NodeData["image_table_indices"];
};

const Images = ({ imageTableIndices }: ImagesProps) => {
  const [imageScaleY, setImageScaleY] = useState(3.75);
  const [activeImage, setActiveImage] = useState<THREE.Texture>();

  const site = useStore((state) => state.site);

  const dummy = useTexture("/sprites/dummy.png");

  const mediaPercentageElapsed = useStore(
    (state) => state.mediaPercentageElapsed
  );

  const imageScaleState = useSpring({
    imageScaleY: imageScaleY,
    config: { duration: 300 },
  });

  const textureLoader = useMemo(() => new TextureLoader(), []);

  useEffect(() => {
    const siteStr = site === GameSite.A ? "a" : "b";

    let image: number | null = null;

    if (mediaPercentageElapsed === 0) {
      image = imageTableIndices[0];
    }

    if (mediaPercentageElapsed === 35) {
      image = imageTableIndices[1];
    }

    if (mediaPercentageElapsed === 70) {
      image = imageTableIndices[2];
    }

    if (image !== null) {
      setImageScaleY(0);
    }

    const timer = setTimeout(() => {
      if (image) {
        const path = `/media/images/${siteStr}/${image}.png`;
        textureLoader.load(path, setActiveImage);
        setImageScaleY(3.75);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [imageTableIndices, mediaPercentageElapsed, site, textureLoader]);

  return (
    <a.sprite
      position={[-0.2, 0.6, -4]}
      scale={[5, 3.75, 0]}
      scale-y={imageScaleState.imageScaleY}
    >
      <spriteMaterial map={activeImage ? activeImage : dummy} />
    </a.sprite>
  );
};

export default Images;
