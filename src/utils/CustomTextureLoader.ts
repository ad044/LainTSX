import {
  Loader,
  RGBAFormat,
  RGBFormat,
  ImageLoader,
  Texture,
  LinearFilter,
  NearestFilter,
  ClampToEdgeWrapping,
} from "three";

/*

custom implementation of TextureLoader that automatically sets minFilter to NearestFilter for proper WebGL1 support.

this is still experimental

*/
export class CustomTextureLoader extends Loader {
  load = (
    url: string,
    onLoad?: (texture: Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): Texture => {
    const texture = new Texture();

    texture.generateMipmaps = false;
    texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
    texture.minFilter = LinearFilter;

    const loader = new ImageLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.setPath(this.path);

    loader.load(
      url,
      function (image: HTMLImageElement) {
        texture.image = image;

        const isJPEG =
          url.search(/\.jpe?g($|\?)/i) > 0 ||
          url.search(/^data:image\/jpeg/) === 0;

        texture.format = isJPEG ? RGBFormat : RGBAFormat;
        texture.needsUpdate = true;

        if (onLoad !== undefined) {
          onLoad(texture);
        }
      },
      onProgress,
      onError
    );
    return texture;
  };
}

export default CustomTextureLoader;
