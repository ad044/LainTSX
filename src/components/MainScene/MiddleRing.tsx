import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import middleRingTexture from "../../static/sprite/middle_ring_tex.png";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../store";
import MiddleRingPart from "./MiddleRing/MiddleRingPart";
import usePrevious from "../../hooks/usePrevious";
import lerp from "../../utils/lerp";

const MiddleRing = () => {
  const middleRingTex = useLoader(THREE.TextureLoader, middleRingTexture);

  const middleRingMaterialRef = useRef<THREE.ShaderMaterial>();
  const middleRingRef = useRef<THREE.Object3D>();
  const middleRingPartRef = useRef<THREE.Object3D>();

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

  const wordSelected = useStore((state) => state.wordSelected);

  const [wobbleAmp, setWobbleAmp] = useState(0);
  const [noiseAmp, setNoiseAmp] = useState(0.03);
  const [rotating, setRotating] = useState(true);
  const [fakeRingVisible, setFakeRingVisible] = useState(false);

  const noiseAmpRef = useRef(0.03);
  const wobbleAmpRef = useRef(0);

  useFrame(() => {
    if (middleRingMaterialRef.current) {
      middleRingMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      wobbleAmpRef.current = lerp(wobbleAmpRef.current, wobbleAmp, 0.1);
      noiseAmpRef.current = lerp(noiseAmpRef.current, noiseAmp, 0.1);

      middleRingMaterialRef.current.uniforms.wobbleStrength.value =
        wobbleAmpRef.current;
      middleRingMaterialRef.current.uniforms.noiseAmp.value =
        noiseAmpRef.current;

      middleRingMaterialRef.current.needsUpdate = true;
    }
    if (rotating && middleRingRef.current) {
      middleRingRef.current!.rotation.y += 0.05;
    }
    if (rotating && middleRingPartRef.current) {
      middleRingPartRef.current!.rotation.y += 0.05;
    }
  });

  const [posState, setPos] = useSpring(() => ({
    posY: -0.11,
    config: { duration: 600 },
  }));

  const [rotState, setRot] = useSpring(() => ({
    rotX: 0,
    rotZ: 0,
    config: { duration: 1000 },
  }));

  const uniforms = useMemo(
    () => ({
      tex: { type: "t", value: middleRingTex },
      uTime: { value: 1.0 },
      wobbleStrength: { value: 0.0 },
      noiseAmp: { value: 0.03 },
    }),
    [middleRingTex]
  );

  const siteRotY = useStore((state) => state.siteRot[1]);
  const activeLevel = useStore((state) => state.activeLevel);
  const subscene = useStore((state) => state.mainSubscene);
  const prevData = usePrevious({ siteRotY, activeLevel, subscene });

  useEffect(() => {
    const rotate = (rotValues: [number, number]) => {
      setTimeout(() => {
        setRot({ rotZ: rotValues[0] });
      }, 2300);

      setTimeout(() => {
        setRot({ rotZ: rotValues[1] });
      }, 3500);

      setTimeout(() => {
        setRot({ rotZ: 0 });
      }, 4500);
    };

    const moveDown = () => {
      setTimeout(() => {
        setNoiseAmp(0.06);
        setRotating(false);
      }, 800);

      setTimeout(() => {
        setPos({ posY: 1.39 });
      }, 1200);

      // set ring rotation on x axis to craete motion effect
      setTimeout(() => {
        setRot({ rotX: 0.3 });
      }, 1500);

      setTimeout(() => {
        setPos({ posY: -0.31 });
      }, 3000);

      setTimeout(() => {
        setPos({ posY: -0.11 });
      }, 3150);

      // rotate it again, set ring noise to 0
      setTimeout(() => {
        setRot({ rotX: -0.1 });
        setNoiseAmp(0);
      }, 3500);

      // rotate it back AGAIN (holy fuk psx game)
      setTimeout(() => {
        setRot({ rotX: 0.05 });
      }, 4500);

      // reset value, set noise to 0
      setTimeout(() => {
        setRot({ rotX: 0, rotZ: 0 });
        setRotating(true);
      }, 4800);

      // enable noise again in about 11-12 secs
      setTimeout(() => {
        setNoiseAmp(0.03);
      }, 11600);
    };

    const moveUp = () => {
      // change noise to 0, make the ring bend downwards
      setTimeout(() => {
        setNoiseAmp(0);
        setWobbleAmp(0.2);
      }, 300);

      // disable rotation of the ring
      setTimeout(() => {
        setRotating(false);
      }, 700);

      // make the ring bend upwards
      setTimeout(() => {
        setWobbleAmp(-0.3);
        // the middle ring stays in place, therefore we animate it
        // in the same direction as the site, creating that illusion.
        setPos({ posY: -1.39 });
      }, 1200);

      // reset the ring bend, set the rotation to slightly curve
      // to replicate a motion effect (since its moving upwards)
      // and enable rotation again
      setTimeout(() => {
        setWobbleAmp(0);
        setRot({ rotX: -0.2 });
        setRotating(true);
      }, 1500);

      setTimeout(() => {
        setPos({ posY: 0.09 });
      }, 2900);

      // reset the rotation value to 0
      setTimeout(() => {
        setRot({ rotX: 0, rotZ: 0 });
        setPos({ posY: -0.11 });
      }, 3150);

      // enable noise again in about 8~ secs
      setTimeout(() => {
        setNoiseAmp(0.03);
      }, 7800);
    };

    const pause = () => {
      setPos({ posY: 0.5 });
      setTimeout(() => {
        setFakeRingVisible(true);
      }, 600);
      setTimeout(() => {
        // move the hidden (main) ring below, cuz when the pause exists it needs to jump back up
        // instead of reappearing
        setPos({ posY: -2.5 });
      }, 1100);

      setTimeout(() => {
        setFakeRingVisible(false);
      }, 3800);
    };

    const unpause = () => {
      setTimeout(() => {
        setRot({ rotX: -0.4 });
        setRotating(true);
      }, 300);

      setTimeout(() => {
        setPos({ posY: -0.4 });
      }, 700);

      // reset the rotation value to 0
      setTimeout(() => {
        setRot({ rotZ: 0, rotX: 0 });
        setPos({ posY: -0.11 });
      }, 950);
    };

    const afterWordSelection = () => {
      setRotating(true);
      setRot({ rotX: -0.4 });

      // reset the rotation value to 0
      setTimeout(() => {
        setRot({ rotZ: 0, rotX: 0 });
      }, 3100);
    };

    if (prevData?.siteRotY !== undefined && prevData?.siteRotY !== siteRotY) {
      rotate(prevData?.siteRotY > siteRotY ? [-0.07, 0.03] : [0.07, -0.03]);
    } else if (
      prevData?.activeLevel !== undefined &&
      prevData.activeLevel !== activeLevel
    ) {
      if (prevData?.activeLevel > activeLevel) {
        moveDown();
      } else if (prevData?.activeLevel < activeLevel) {
        moveUp();
      }
    } else if (subscene === "pause") {
      pause();
    } else if (subscene === "site" && prevData?.subscene === "pause") {
      unpause();
    } else if (wordSelected) {
      afterWordSelection();
    }
  }, [
    activeLevel,
    prevData?.activeLevel,
    prevData?.siteRotY,
    prevData?.subscene,
    setPos,
    setRot,
    siteRotY,
    subscene,
    wordSelected,
  ]);

  return (
    <a.group rotation-z={rotState.rotZ}>
      <a.mesh
        position={[0, 0, 0.3]}
        position-y={posState.posY}
        ref={middleRingRef}
        rotation={[0, 0.9, 0]}
        rotation-x={rotState.rotX}
        visible={!fakeRingVisible}
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

      {fakeRingVisible && (
        <group
          rotation={[0, 0.9, 0]}
          ref={middleRingPartRef}
          position={[0, 0.5, 0.3]}
        >
          {[...Array(30).keys()].map((i) => {
            const angle = (i / 30) * 2 * Math.PI;
            return (
              <MiddleRingPart
                position={[Math.cos(angle) / 1.35, 0, Math.sin(angle) / 1.35]}
                rotation={[0, -angle + Math.PI / 2, 0]}
                key={angle}
              />
            );
          })}
        </group>
      )}
    </a.group>
  );
};

export default MiddleRing;
