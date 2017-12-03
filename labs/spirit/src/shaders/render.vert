// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texturePos;
uniform sampler2D textureExtra;
uniform sampler2D textureMap;
uniform vec2 uViewport;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vExtra;
varying vec3 vMap;

const float radius = 0.005;

void main(void) {
	vec2 uv          = aVertexPosition.xy;
	vec3 position    = texture2D(texturePos, uv).xyz;
	vec3 extra       = texture2D(textureExtra, uv).xyz;
	vec3 map         = texture2D(textureMap, uv).xyz;
	gl_Position      = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	
	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
	gl_PointSize     = distOffset * (1.0 + extra.x * 0.5);
	
	
	vTextureCoord    = aTextureCoord;
	vNormal          = aNormal;
	vExtra 			 = extra;
	vMap 			 = map;
}