uniform sampler2D tex1;
uniform float alpha;
uniform float offset;

varying vec2 vUv;

void main() {
	float alpha = smoothstep(1.0, 0.9, vUv.x);

	vec4 t1 = texture2D(tex1,vUv * 5.0 + offset);

	gl_FragColor = mix(vec4(0,0,0,0), t1, alpha) * 0.8;
}
