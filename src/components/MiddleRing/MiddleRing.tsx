import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import middleRingTexture from "../../static/sprites/middle_ring_tex.png";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import {
  middleRingAnimDurationAtom,
  middleRingNoiseAtom, middleRingPosYAtom,
  middleRingRotatingAtom,
  middleRingRotXAtom,
  middleRingRotZAtom,
  middleRingWobbleStrengthAtom,
} from "./MiddleRingAtom";
import { useRecoilValue } from "recoil";

const MiddleRing = () => {
  const middleRingTex = useLoader(THREE.TextureLoader, middleRingTexture);

  const middleRingWobbleStrength = useRecoilValue(middleRingWobbleStrengthAtom);
  const middleRingRotating = useRecoilValue(middleRingRotatingAtom);
  const middleRingNoise = useRecoilValue(middleRingNoiseAtom);
  const middleRingPosY = useRecoilValue(middleRingPosYAtom);
  const middleRingRotX = useRecoilValue(middleRingRotXAtom);
  const middleRingRotZ = useRecoilValue(middleRingRotZAtom);

  const middleRingAnimDuration = useRecoilValue(middleRingAnimDurationAtom);

  const middleRingWobbleState = useSpring({
    middleRingWobbleStrength: middleRingWobbleStrength,
    middleRingNoise: middleRingNoise,
    config: { duration: 200 },
  });

  const middleRingPosState = useSpring({
    middleRingPosY: middleRingPosY,
    config: { duration: middleRingAnimDuration },
  });

  const middleRingRotState = useSpring({
    middleRingRotX: middleRingRotX,
    middleRingRotZ: middleRingRotZ,
    config: { duration: 1000 },
  });

  const uniforms = useMemo(
    () => ({
      tex: { type: "t", value: middleRingTex },
      uTime: { value: 1.0 },
      wobbleStrength: { value: 0.0 },
      noiseAmp: { value: 0.03 },
    }),
    [middleRingTex]
  );

  const middleRingMaterialRef = useRef<THREE.ShaderMaterial>();
  const middleRingRef = useRef<THREE.Object3D>();

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float wobbleStrength;
    uniform float noiseAmp;

    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
               
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;

      // offset of the wobble when jumping
      const float angleOffset = -0.8f;
      
      // compute world position of the vertex
      // (ie, position after model rotation and translation)
      vec4 worldPos = modelMatrix * vec4(position, 0.0);
      float wobbleAngle = atan(worldPos.x, worldPos.z) + angleOffset;
      
      vec3 pos = position;
      
      // noise modifiers
      float noiseFreq = 0.5;
      
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.y += snoise(noisePos) * noiseAmp + wobbleStrength * sin(wobbleAngle * 2.0);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
  `;

  const fragmentShader = `
    uniform sampler2D tex;

    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D( tex, vUv);
    }
  `;

  const clock = new THREE.Clock();

  useFrame(() => {
    if (middleRingMaterialRef.current) {
      middleRingMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      middleRingMaterialRef.current.uniforms.wobbleStrength.value = middleRingWobbleState.middleRingWobbleStrength.get();
      middleRingMaterialRef.current.uniforms.noiseAmp.value = middleRingWobbleState.middleRingNoise.get();

      middleRingMaterialRef.current.needsUpdate = true;
    }
    if (middleRingRotating) {
      middleRingRef.current!.rotation.y += 0.05;
    }
  });

  return (
    <a.group
      rotation-z={middleRingRotState.middleRingRotZ}
    >
      <a.mesh
        position={[0, 0, 0.3]}
        position-y={middleRingPosState.middleRingPosY}
        ref={middleRingRef}
        rotation={[0, 0.9, 0]}
        rotation-x={middleRingRotState.middleRingRotX}
      >
        <cylinderBufferGeometry
          args={[0.75, 0.75, 0.027, 64, 64, true]}
          attach="geometry"
        />
        <shaderMaterial
          attach="material"
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          ref={middleRingMaterialRef}
          transparent={true}
        />
      </a.mesh>
    </a.group>
  );
};

export default MiddleRing;
