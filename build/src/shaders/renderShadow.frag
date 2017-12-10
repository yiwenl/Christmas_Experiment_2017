precision highp float;
varying vec4 vColor;

uniform sampler2D textureShadow;
varying vec4 vShadowCoord;

void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;


	float bias = 0.005;

	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;

	float visibility = 1.0;
	float depth = texture2D(textureShadow, uv).r;
	if(depth < shadowCoord.z - bias) {
		visibility = 0.0;
	}
	visibility = mix(visibility, 1.0, .75);

	vec4 color = vColor;

	color.rgb *= visibility;


    gl_FragColor = color;
}