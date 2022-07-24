import { FontData, TextType } from "@/types";
import { useTexture } from "@react-three/drei";
import mediumFontJson from "@/json/font/medium_font.json";
import bigFontJson from "@/json/font/big_font.json";
import jpFontJson from "@/json/font/jp_font.json";

const getFontDataAndTexture = (textType: TextType) => {
  switch (textType) {
    case TextType.MediumGreen:
      return {
        texture: "/sprites/fonts/white_and_green_texture.png",
        font: mediumFontJson,
      };
    case TextType.MediumBlack:
      return {
        texture: "/sprites/fonts/orange_font_texture.png",
        font: mediumFontJson,
      };
    case TextType.MediumOrange:
      return {
        texture: "/sprites/fonts/white_and_orange_texture.png",
        font: mediumFontJson,
      };
    case TextType.MediumWhite:
      return {
        texture: "/sprites/fonts/yellow_font_texture.png",
        font: mediumFontJson,
      };
    case TextType.BigOrange:
      return {
        texture: "/sprites/fonts/orange_font_texture.png",
        font: bigFontJson,
      };
    case TextType.BigYellow:
      return {
        texture: "/sprites/fonts/yellow_font_texture.png",
        font: bigFontJson,
      };
    case TextType.Jp:
      return {
        texture: "/sprites/fonts/orange_jp_font.png",
        font: jpFontJson,
      };
  }
};

const useText = (
  textType: TextType
): { texture: THREE.Texture; font: FontData } => {
  const { font, texture } = getFontDataAndTexture(textType);
  return {
    texture: useTexture(texture),
    font: font,
  };
};

export default useText;
