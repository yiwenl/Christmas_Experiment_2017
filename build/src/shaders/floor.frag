// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform sampler2D textureShadow;

varying vec2 vTextureCoord;
varying vec4 vShadowCoord;

void main(void) {
	float d = distance(vTextureCoord, vec2(.5));
	d = smoothstep(.5, 0.0, d);

	float bias = 0.005;

	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;

	float visibility = 1.0;
	float depth = texture2D(textureShadow, uv).r;
	if(depth < shadowCoord.z - bias) {
		visibility = 0.0;
	}
	visibility = mix(visibility, 1.0, .5);


    gl_FragColor = vec4(vec3(visibility), d);
}