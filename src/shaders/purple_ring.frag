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

uniform PointLight pointLights[NUM_POINT_LIGHTS];

// transform coordinates to uniform within segment
float tolocal(float x, int segments, float step) {
  float period = 1.0 / step * float(segments);
  return mod(x, period) / period;
}

// check if coordinate is within the given height
bool isheight(float y, float thin) {
  return y > 0.5 - thin / 2.0 && y < 0.5 + thin / 2.0;
}

bool istop(float y, float thin) { return y > 1.0 - thin; }

bool isbottom(float y, float thin) { return y < thin; }

// sloping function
float slope(float x, float thin) { return x * (1.0 - thin); }

// frag color
vec4 color(vec2 vUv, float step, bool textureexists) {
  if (!textureexists) {
    return vec4(0.325, 0.325, 0.698, 1);
  } else {
    float dist = 1.0 - tolocal(0.5 - mod(vUv.x + 0.172, 0.5), 12, step);
    return texture2D(tex, vec2(dist, vUv.y));
  }
}

void main() {
  // lights
  vec4 addedLights = vec4(0.0, 0.0, 0.0, 1.0);

  for (int l = 0; l < NUM_POINT_LIGHTS; l++) {
    vec3 lightDirection = normalize(vPos - pointLights[l].position);
    addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) *
                       pointLights[l].color * 12.0;
  }

  // number of segments
  float step = 256.0;
  float thin = 0.2;
  float thick = 1.0;
  float slopefactor = 2.0;

  int halfc = int(step) / 2;

  // segment within circle
  int segment = int(floor(vUv.x * step));
  int thinperiod = halfc - 16;

  int halfel = int(mod(float(segment), float(halfc)));

  if (halfel < thinperiod - 1 && istop(vUv.y, thin)) {
    // thin line top
    gl_FragColor = color(vUv, step, false) * addedLights;
  } else if (halfel == thinperiod - 1) {
    // thin line and corner
    float dist = tolocal(vUv.x, 1, step);
    float val = 1.0 - slope(1.0 - dist, thin);
    if (istop(vUv.y, thin) ||
        (1.0 - vUv.y < val - (1.0 - thin * slopefactor))) {
      gl_FragColor = color(vUv, step, false) * addedLights;
    } else {
      gl_FragColor = vec4(0, 0, 0, 0);
    }
  } else if (halfel > thinperiod - 2 && halfel < thinperiod + 1) {
    // slope down
    float dist = tolocal(vUv.x, 1, step);
    float val = 1.0 - slope(dist, thin);
    if (vUv.y < val && vUv.y > val - thin * slopefactor) {
      gl_FragColor = color(vUv, step, false) * addedLights;
    } else {
      gl_FragColor = vec4(0, 0, 0, 0);
    }
  } else if (halfel > thinperiod && halfel < thinperiod + 4 &&
             isbottom(vUv.y, thin)) {
    // thin line bottom
    gl_FragColor = vec4(0.325, 0.325, 0.698, 1) * addedLights;
  } else if (halfel > thinperiod + 3 && halfel < thinperiod + 6) {
    // slope up
    float dist = tolocal(vUv.x, 2, step);
    float val = 1.0 - slope(1.0 - dist, thin);
    if ((isbottom(vUv.y, thin) && dist < thin * slopefactor) || (vUv.y < val)) {
      gl_FragColor = color(vUv, step, true) * addedLights;
    } else {
      gl_FragColor = vec4(0, 0, 0, 0);
    }
  } else if (halfel > thinperiod + 5 && halfel < thinperiod + 12) {
    // thick part
    gl_FragColor = color(vUv, step, true) * addedLights;
  } else if (halfel == thinperiod + 12) {
    // level first char texture
    float dist =
        1.0 -
        tolocal(0.5 - mod(vUv.x - siteLevelFirstCharacterOffset + 0.004, 0.5),
                11, step);
    gl_FragColor = texture2D(siteLevels, vec2(dist, vUv.y)) * addedLights;
  } else if (halfel == thinperiod + 13) {
    // level second char texture
    float dist =
        1.0 - tolocal(0.5 - mod(vUv.x - siteLevelSecondCharacterOffset, 0.5),
                      11, step);
    gl_FragColor = texture2D(siteLevels, vec2(dist, vUv.y)) * addedLights;
  } else if (halfel > thinperiod + 13 && halfel < thinperiod + 16) {
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
