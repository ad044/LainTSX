import React, { memo, useMemo } from "react";
import * as THREE from "three";
import lofTexture from "../static/sprites/lof.png";
import holeTexture from "../static/sprites/hole.png";
import lifeTexture from "../static/sprites/life.png";
import { useLoader } from "react-three-fiber";

type GrayRingProps = {
  grayRingPosY: number;
};

const GrayRing = memo((props: GrayRingProps) => {
  const lofTex = useLoader(THREE.TextureLoader, lofTexture);
  const holeTex = useLoader(THREE.TextureLoader, holeTexture);
  const lifeTex = useLoader(THREE.TextureLoader, lifeTexture);

  const uniforms = useMemo(
    () => ({
      lof: { type: "t", value: lofTex },
      hole: { type: "t", value: holeTex },
      life: { type: "t", value: lifeTex },
    }),
    [lofTex, holeTex, lifeTex]
  );

  const vertexShader = `
    varying vec2 vUv;


    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D lof;
    uniform sampler2D hole;
    uniform sampler2D life;

    // transform coordinates to uniform within segment
    float tolocal(float x, int segments, float step) {
      float period = 1.0/step*float(segments);
      return mod(x, period) / period;
    }
    
    // check if coordinate is within the given height
    bool isheight(float y, float thin) {
        return y > 0.5-thin/2.0 && y < 0.5+thin/2.0;
    }

    // sloping function
    float slope(float x, float thin) {
      return x*(1.0-thin)/2.0;
    }

    // frag color / texture
    // #424252 hex in original textures
    vec4 color(vec2 vUv, int quadnum, bool textureexists, int thinperiod, int quadlen, float step) {
      if (!textureexists) {
        return vec4(0.259,0.259,0.322, 1);
      } else if (quadnum % 2 == 1) {
        return texture2D(hole, vec2(tolocal(vUv.x, quadlen-thinperiod, step), vUv.y));
      } else if (quadnum == 0) {
        return texture2D(lof, vec2(tolocal(vUv.x, quadlen-thinperiod, step), vUv.y));
      } else {
        return texture2D(life, vec2(tolocal(vUv.x, quadlen-thinperiod, step), vUv.y));
      }
    }

    void main() {
      // number of segments
      float step = 64.0;
      float thin = 0.3;
      
      // segment within circle
      int segment = int(floor(vUv.x * step));
      
      int quadlen = int(step)/4;
      
      // segment within circle's quad
      int quadel = int(segment) % quadlen;
      
      // which quad
      int quadnum = int(segment) / quadlen;
     
     // how big thin part is
     int thinperiod = 12;
     
      if (quadel < thinperiod && isheight(vUv.y, thin)) {
          // thin line
          gl_FragColor = color(vUv, quadnum, false, thinperiod, quadlen, step);
      } else if (quadel == thinperiod) {
          // slope up
          float dist = tolocal(vUv.x, 1, step);
          if (vUv.y > slope(1.0-dist, thin) && vUv.y < 1.0-slope(1.0-dist, thin)) {
              gl_FragColor = color(vUv, quadnum, true, thinperiod, quadlen, step);
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (quadel == quadlen-1) {
          // slope down
          float dist = tolocal(vUv.x, 1, step);
          if (vUv.y > slope(dist, thin) && vUv.y < 1.0-slope(dist, thin)) {
             gl_FragColor = color(vUv, quadnum, true, thinperiod, quadlen, step);
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (quadel > thinperiod) {
            gl_FragColor = color(vUv, quadnum, true, thinperiod, quadlen, step);
      } else {
          // transparent
            gl_FragColor = vec4(0, 0, 0, 0);
        }
  }
    `;

  return (
    <mesh
      position={[0, props.grayRingPosY, 0]}
      rotation={[0, 3.7, 0]}
      renderOrder={1}
      scale={[5, 2.5, 5]}
    >
      <cylinderBufferGeometry
        args={[0.25, 0.25, 0.027, 64, 64, true]}
        attach="geometry"
      />
      <shaderMaterial
        attach="material"
        side={THREE.DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={uniforms}
      />
    </mesh>
  );
});

export default GrayRing;
