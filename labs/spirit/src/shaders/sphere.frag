// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec4 vScreenPosition;

uniform sampler2D texture;
uniform float uRange;
uniform float uOffset;
uniform float uTime;


float rand(float n){return fract(sin(n) * 43758.5453123);}


void main(void) {
	// const float r = .02;
	

	vec4 coord = vScreenPosition / vScreenPosition.w;
	float t = rand(coord.y + uTime);
	float range = uRange * uOffset * 200.0;

	float d = smoothstep( -range, range, vPosition.x);

	d -= (t + uOffset) * uOffset * d;


	gl_FragColor = vec4(vec3(d), 1.0);
}



/*

const float r = .025;
float d = smoothstep(0.25 - r, 0.25 + r, abs(vTextureCoord.x - 0.5));
gl_FragColor = vec4(vec3(d), 1.0);

*/