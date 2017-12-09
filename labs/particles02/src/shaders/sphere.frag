// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec4 vScreenPosition;

uniform float uRange;


void main(void) {
	float d = smoothstep( -uRange, uRange, vPosition.x);
	gl_FragColor = vec4(vec3(d), 1.0);
}

