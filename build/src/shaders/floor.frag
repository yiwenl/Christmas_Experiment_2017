// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;

void main(void) {
	float d = distance(vTextureCoord, vec2(.5));
	d = smoothstep(.5, 0.0, d);
    gl_FragColor = vec4(vec3(1.0), d);
}