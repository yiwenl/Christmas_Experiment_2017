// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vPosition;


const float PI = 3.141592653;

void main(void) {

	float a = atan(vPosition.z, vPosition.x);
	a = mod(a + PI, PI * 2.0);

	float d = abs(a - PI) / PI;

	float r = 0.001;
	d = smoothstep(0.5-r, 0.5+r, d);

    gl_FragColor = vec4(vec3(d), 1.0);
}