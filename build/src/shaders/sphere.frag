// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
uniform sampler2D texture;
uniform float uRange;

void main(void) {
	// const float r = .02;
	float d = smoothstep(- uRange, uRange, vPosition.x);
	gl_FragColor = vec4(vec3(d), 1.0);
}

