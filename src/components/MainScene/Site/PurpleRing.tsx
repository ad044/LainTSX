import React, { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import siteATex from "../../../static/sprites/main/site_a.png";
import siteBTex from "../../../static/sprites/main/site_b.png";
import siteLevelTex from "../../../static/sprites/main/site_levels.png";

type PurpleRingProps = {
  purpleRingPosY: number;
  level: string;
  site: string;
};

const PurpleRing = memo((props: PurpleRingProps) => {
  const siteA = useLoader(THREE.TextureLoader, siteATex);
  const siteB = useLoader(THREE.TextureLoader, siteBTex);
  const siteLevels = useLoader(THREE.TextureLoader, siteLevelTex);

  const purpleRingRef = useRef<THREE.Object3D>();

  const levelTextureOffsets = useMemo(() => {
    const formattedLevel = props.level.padStart(2, "0");

    const offsets: { [key: string]: number } = {
      "9": 0.035,
      "8": 0.039,
      "7": 0.001,
      "6": 0.005,
      "5": 0.009,
      "4": 0.0131,
      "3": 0.0176,
      "2": 0.0218,
      "1": 0.026,
      "0": 0.031,
    };

    return [
      offsets[formattedLevel.charAt(0)],
      offsets[formattedLevel.charAt(1)],
    ];
  }, [props.level]);

  const uniforms = useMemo(() => {
    const uniform = THREE.UniformsUtils.merge([THREE.UniformsLib["lights"]]);

    uniform.tex = { type: "t", value: null };
    uniform.siteLevels = { type: "t", value: siteLevels };
    uniform.siteLevelFirstCharacterOffset = {
      value: levelTextureOffsets[0],
    };
    uniform.siteLevelSecondCharacterOffset = {
      value: levelTextureOffsets[1],
    };

    return uniform;
  }, [siteLevels, levelTextureOffsets]);

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
    uniform sampler2D tex;
    uniform sampler2D siteLevels;
    uniform float siteLevelFirstCharacterOffset;
    uniform float siteLevelSecondCharacterOffset;
    
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

    bool istop(float y, float thin) {
        return y > 1.0-thin;
    }

    bool isbottom(float y, float thin) {
        return y < thin;
    }

    // sloping function
    float slope(float x, float thin) {
        return x*(1.0-thin);
    }
    
    // frag color
    vec4 color(vec2 vUv, float step, bool textureexists) {
        if (!textureexists) {
            return vec4(0.325,0.325,0.698, 1);
        } else {
            float dist = 1.0-tolocal(0.5 - mod(vUv.x+0.172, 0.5), 12, step);
            return texture2D(tex, vec2(dist, vUv.y)) ;
        } 
    }

    void main() {
      // lights
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
                             * 30.0;
      }
  
      // number of segments
      float step = 256.0;
      float thin = 0.2;
      float thick = 1.0;
      float slopefactor = 2.0;
      
      uint halfc = uint(step)/uint(2);
      
      // segment within circle
      uint segment = uint(floor(vUv.x * step));
      uint thinperiod = halfc-uint(16);
     
      uint halfel = segment % halfc;
     
      if (halfel < thinperiod-uint(1) && istop(vUv.y, thin)) {
          // thin line top
          gl_FragColor = color(vUv, step, false) * addedLights;
      } else if (halfel == thinperiod - uint(1)) {
          // thin line and corner
          float dist = tolocal(vUv.x, 1, step);
          float val = 1.0-slope(1.0-dist, thin);
          if (istop(vUv.y, thin) || (1.0-vUv.y < val-(1.0-thin*slopefactor))) {
              gl_FragColor = color(vUv, step, false) * addedLights;
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (halfel > thinperiod-uint(2) && halfel < thinperiod+uint(1)) {
          // slope down
          float dist = tolocal(vUv.x, 1, step);
          float val = 1.0-slope(dist, thin);
          if (vUv.y < val && vUv.y > val-thin*slopefactor) {
              gl_FragColor = color(vUv, step, false) * addedLights;
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (halfel > thinperiod && halfel < thinperiod+uint(4) && isbottom(vUv.y, thin)) {
          // thin line bottom
          gl_FragColor = vec4(0.325,0.325,0.698, 1) * addedLights;
      } else if (halfel > thinperiod + uint(3) && halfel < thinperiod + uint(6)) {
          // slope up
          float dist = tolocal(vUv.x, 2, step);
          float val = 1.0-slope(1.0-dist, thin);
          if ((isbottom(vUv.y, thin) && dist < thin*slopefactor) || (vUv.y < val)) {
              gl_FragColor = color(vUv, step, true) * addedLights;
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }        
      } else if (halfel > thinperiod + uint(5) && halfel < thinperiod+uint(12)) {
          // thick part
          gl_FragColor = color(vUv, step, true) * addedLights;
      } else if (halfel == thinperiod + uint(12)){
          // level first char texture
          float dist = 1.0-tolocal(0.5 - mod(vUv.x-siteLevelFirstCharacterOffset +0.004, 0.5), 11, step);
          gl_FragColor = texture2D(siteLevels,  vec2(dist, vUv.y)) * addedLights;
     } else if (halfel == thinperiod + uint(13)){
          // level second char texture
          float dist = 1.0-tolocal(0.5 - mod(vUv.x-siteLevelSecondCharacterOffset, 0.5), 11, step);
          gl_FragColor = texture2D(siteLevels,  vec2(dist, vUv.y)) * addedLights;
      } else if (halfel > thinperiod + uint(13) && halfel < thinperiod + uint(16)) {
          // slope up
          float dist = tolocal(vUv.x, 2, step);
          float val = slope(dist, thin);
          if (vUv.y > val) {
              gl_FragColor = color(vUv, step, true) * addedLights;
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }  
      } else {
          // transparent
          gl_FragColor = vec4(0, 0, 0, 0);
      }
  }
    `;

  const matRef = useRef<THREE.ShaderMaterial>();
  useFrame(() => {
    purpleRingRef.current!.rotation.y += 0.005;
  });

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.tex.value = props.site === "a" ? siteA : siteB;
      matRef.current.uniformsNeedUpdate = true;
    }
  }, [props.site, siteA, siteB]);

  return (
    <mesh
      position={[0, props.purpleRingPosY, 0]}
      scale={[26, 26, 26]}
      renderOrder={1}
      ref={purpleRingRef}
    >
      <cylinderBufferGeometry
        args={[0.05, 0.05, 0.0035, 64, 64, true]}
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
        ref={matRef}
      />
    </mesh>
  );
});

export default PurpleRing;
