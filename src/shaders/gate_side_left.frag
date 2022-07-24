uniform sampler2D tex1;
uniform float alpha;
uniform float offset;

varying vec2 vUv;

void main() {
	float alpha = smoothstep(0.9, 1.0, vUv.x);

	vec4 t1 = texture2D(tex1,vUv * 5.0 + offset);

	gl_FragColor = mix(t1, vec4(0,0,0,0), alpha) * 0.8;
}
