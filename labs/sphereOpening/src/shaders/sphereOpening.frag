// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;

uniform float uOffset;
uniform sampler2D texture;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main(void) {
	vec2 uv = vTextureCoord;
	uv.y *= 2.0;
	uv.x = 2.0 - uv.x;
	uv.x -= uOffset * 2.0;

	float range = 0.01 + pow(uOffset, 0.75) * 2.0;
	float t = 0.0;

	float d = smoothstep( t-range, t + range, vPosition.x);
	vec4 map = texture2D(texture, uv);
	// map.rgb = mix(vec3(d), map.rgb, uOffset );
	map.rgb *= d;

    gl_FragColor = map;
}