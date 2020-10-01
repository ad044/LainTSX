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

    const uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"]]);

    uniforms.lof = { type: "t", value: lofTex };
    uniforms.hole = { type: "t", value: holeTex };
    uniforms.life = { type: "t", value: lifeTex };

    const vertexShader = `
    varying vec2 vUv;

    varying vec3 vPos;
    varying vec3 vNormal;

    void main() {
      vUv = uv;

      vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
      vNormal = normalMatrix * normal;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D lof;
    uniform sampler2D hole;
    uniform sampler2D life;
    
    // lights
    varying vec3 vPos;
    varying vec3 vNormal;

    struct PointLight {
      vec3 position;
      vec3 color;
      float distance;
    };
    
    uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

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
      } else if (uint(quadnum) % uint(2) == uint(1)) {
        return texture2D(hole, vec2(tolocal(vUv.x, quadlen-thinperiod, step), vUv.y));
          // return vec4(tolocal(vUv.x, quadlen-thinperiod, step), 0, 0, 1);
      } else if (quadnum == 0) {
        return texture2D(lof, vec2(tolocal(vUv.x, quadlen-thinperiod, step), vUv.y));
      } else {
        return texture2D(life, vec2(tolocal(vUv.x, quadlen-thinperiod, step), vUv.y));
      }
    }
    
    void main() {
    
      //lights
      vec4 addedLights = vec4(0.0,
                        0.0,
                        0.0,
                        1.0);
                            
      for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
          vec3 lightDirection = normalize(vPos
                                - pointLights[l].position);
          addedLights.rgb += clamp(dot(-lightDirection,
                                   vNormal), 0.0, 1.0)
                             * pointLights[l].color
                             * 50.0;
      }
  

      // number of segments
      float step = 64.0;
      
      // thin line height
      float thin = 0.3;
      
      // segment within circle
      int segment = int(floor(vUv.x * step));
      
      int quadlen = int(step)/4;
      
      // segment within circle's quad
      uint quadel = uint(segment) % uint(quadlen);
      
      // which quad
      int quadnum = int(uint(segment) / uint(quadlen));
     
     // how big thin part is
     int thinperiod = 8;
     
      if (quadel < uint(thinperiod) && isheight(vUv.y, thin)) {
          // thin line
          gl_FragColor = color(vUv, quadnum, false, thinperiod, quadlen, step) * addedLights;
      } else if (quadel == uint(thinperiod)) {
          // slope up
          float dist = tolocal(vUv.x, 1, step);
          if (vUv.y > slope(1.0-dist, thin) && vUv.y < 1.0-slope(1.0-dist, thin)) {
              gl_FragColor = color(vUv, quadnum, true, thinperiod, quadlen, step) * addedLights;
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (quadel == uint(quadlen-1)) {
          // slope down
          float dist = tolocal(vUv.x, 1, step);
          if (vUv.y > slope(dist, thin) && vUv.y < 1.0-slope(dist, thin)) {
             gl_FragColor = color(vUv, quadnum, true, thinperiod, quadlen, step) * addedLights;
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (quadel > uint(thinperiod)) {
            gl_FragColor = color(vUv, quadnum, true, thinperiod, quadlen, step) * addedLights;
      } else {
          // transparent
            gl_FragColor = vec4(0, 0, 0, 0);
        }
  }
    `;

    return (
        <mesh
            position={[0, props.grayRingPosY, 0]}
            rotation={[0, 3.95, 0]}
            renderOrder={1}
            scale={[33, 33, 33]}
        >
            <cylinderBufferGeometry
                args={[0.036, 0.036, 0.003, 64, 64, true]}
                attach="geometry"
            />
            <shaderMaterial
                attach="material"
                side={THREE.DoubleSide}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                uniforms={uniforms}
                lights={true}
            />
        </mesh>
    );
});

export default GrayRing;
