// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform sampler2D textureMap;
uniform sampler2D textureLife;
uniform float percent;
uniform float time;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vShadowCoord;
varying float vLife;
varying float vOffset;

const float radius = 0.015;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 extra   = texture2D(textureExtra, uv).rgb;
	vLife   = texture2D(textureLife, uv).r;
	vec4 wsPosition  = uModelMatrix * vec4(pos, 1.0);
	vec4 screenPos = uProjectionMatrix * uViewMatrix * wsPosition;
	gl_Position  = screenPos;

	screenPos	/= screenPos.w;
	vec2 uvScreen = screenPos.xy * .5 + .5;
	float colorMap = texture2D(textureMap, uvScreen).r;
	

	float g 	 = mix(extra.g, 1.0, .75);
	vec3 color 	 = vec3(g);
	vec3 invertColor = vec3(1.0 - g);
	color 		 = mix(color, invertColor, colorMap);
	vColor       = vec4(color, 1.0);

	float life = smoothstep(0.0, 0.3, vLife);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (1.0 + extra.x * 1.0) * life;

	vNormal 	 = aNormal;
	vShadowCoord = uShadowMatrix * wsPosition;
	vOffset = colorMap;
}