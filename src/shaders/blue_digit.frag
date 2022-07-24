uniform sampler2D tex;
uniform float brightnessMultiplier;
varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(tex, vUv) * brightnessMultiplier;
}
