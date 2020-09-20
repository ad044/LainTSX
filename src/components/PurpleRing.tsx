import React, {memo, useMemo, useRef} from "react";
import {useFrame, useLoader} from "react-three-fiber";
import * as THREE from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import siteATex from "../static/sprites/site_a.png";
import siteBTex from "../static/sprites/site_b.png";

type PurpleRingProps = {
  purpleRingPosY: number;
};

type GLTFResult = GLTF & {
  nodes: {
    Circle002: THREE.Mesh;
  };
  materials: {};
};

const PurpleRing = memo((props: PurpleRingProps) => {
  const siteA = useLoader(THREE.TextureLoader, siteATex);
  const siteB = useLoader(THREE.TextureLoader, siteBTex);

  const purpleRingRef = useRef<THREE.Object3D>();

  const uniforms = useMemo(
    () => ({
      siteA: { type: "t", value: siteA },
      siteB: { type: "t", value: siteB },
    }),
    [siteA, siteB]
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
    uniform sampler2D siteA;
    uniform sampler2D siteB;

    
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
    vec4 color(vec2 vUv, float step, bool textureexists, int quadnum) {
        if (!textureexists) {
            return vec4(0.325,0.325,0.698, 1);
        } else if (quadnum == 1) {
            float dist = 1.0-tolocal(1.0-vUv.x+0.5, 6, step);
            return texture2D(siteA, vec2(dist, vUv.y));
        } else {
            float dist = 1.0-tolocal(1.0-vUv.x, 6, step);
            return texture2D(siteA, vec2(dist, vUv.y));
        }
    }

    void main() {
      // number of segments
      float step = 128.0;
      float thin = 0.25;
      float thick = 1.0;
      float slopefactor = 1.0;
      
      // segment within circle
      int segment = int(floor(vUv.x * step));
      
      int quadlen = int(step)/2;
      
      // segment within circle's quad
      int quadel = int(segment) % quadlen;
      
      // which quad
      int quadnum = int(segment) / quadlen;
      
      int thinperiod = 48;
     
      if (quadel < thinperiod-1 && istop(vUv.y, thin)) {
          // thin line top
          gl_FragColor = color(vUv, step, false, quadnum);
      } else if (quadel == thinperiod - 1) {
          // thin line and corner
          float dist = tolocal(vUv.x, 1, step);
          float val = 1.0-slope(1.0-dist, thin);
          if (istop(vUv.y, thin) || (dist > 1.0-thin*slopefactor && 1.0-vUv.y < val-(1.0-thin*slopefactor))) {
              gl_FragColor = color(vUv, step, false, quadnum);
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (quadel == thinperiod) {
          // slope down
          float dist = tolocal(vUv.x, 1, step);
          float val = 1.0-slope(dist, thin);
          if (vUv.y < val && vUv.y > val-thin*slopefactor) {
              gl_FragColor = color(vUv, step, false, quadnum);
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }
      } else if (quadel == thinperiod+1 && isbottom(vUv.y, thin)) {
          // thin line bottom
          gl_FragColor = vec4(0.325,0.325,0.698, 1);
      } else if (quadel == thinperiod + 2) {
          // slope up
          float dist = tolocal(vUv.x, 1, step);
          float val = 1.0-slope(1.0-dist, thin);
          if ((isbottom(vUv.y, thin) && dist < thin*slopefactor) || (vUv.y < val)) {
              gl_FragColor = color(vUv, step, true, quadnum);
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }        
      } else if (quadel > thinperiod + 2 && quadel < thinperiod+7) {
          // thick part
          gl_FragColor = color(vUv, step, true, quadnum);
      } else if (quadel == thinperiod+7) {
          // slope up
          float dist = tolocal(vUv.x, 1, step);
          float val = slope(dist, thin);
          if (vUv.y > val) {
              gl_FragColor = color(vUv, step, true, quadnum);
          } else {
              gl_FragColor = vec4(0, 0, 0, 0);
          }        
      } else if (quadel > thinperiod+7 && istop(vUv.y, thin)) {
          // thin line top
          gl_FragColor = color(vUv, step, false, quadnum);
      } else {
          // transparent
          gl_FragColor = vec4(0, 0, 0, 0);
      }
  }
    `;

  // useFrame(() => {
  //   purpleRingRef.current!.rotation.y += 0.01;
  // });

  return (
    <mesh
      position={[0, props.purpleRingPosY, 0]}
      rotation={[0, 0.5, 0]}
      renderOrder={1}
      scale={[25, 25, 25]}
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
      />
    </mesh>
  );
});

export default PurpleRing;
