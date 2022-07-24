precision highp float;

uniform sampler2D normalTexture;
uniform sampler2D activeTexture;
uniform float timeMSeconds;

varying vec2 vUv;

// lights
varying vec3 vPos;
varying vec3 vNormal;

struct PointLight {
  vec3 position;
  vec3 color;
  float distance;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

void main() {
  vec4 addedLights = vec4(0.0, 0.0, 0.0, 1.0);

  for (int l = 0; l < NUM_POINT_LIGHTS; l++) {
    vec3 lightDirection = normalize(vPos - pointLights[l].position);
    addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) *
                       pointLights[l].color * 50.0;
  }

  vec4 t1 = texture2D(normalTexture, vUv);
  vec4 t2 = texture2D(activeTexture, vUv);
  float bias = (1.0 - timeMSeconds) - floor(1.0 - timeMSeconds);
  gl_FragColor = mix(t1, t2, bias);
}
