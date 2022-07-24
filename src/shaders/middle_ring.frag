uniform sampler2D tex;

varying vec2 vUv;

void main() {
	gl_FragColor = texture2D( tex, vUv);
}
