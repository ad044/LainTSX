uniform vec3 color1;
uniform vec3 color2;
uniform float alpha;

varying vec2 vUv;

void main() {
	float alpha = smoothstep(0.0, 1.0, vUv.y);
	float colorMix = smoothstep(1.0, 2.0, 1.8);

	gl_FragColor = vec4(mix(color1, color2, colorMix), alpha) * 0.8;
}
