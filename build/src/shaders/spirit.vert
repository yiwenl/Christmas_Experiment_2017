// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLeftView;
uniform mat4 uLeftProj;
uniform vec3 uPosition;

varying vec2 vTextureCoord;
varying vec4 vScreenPosition;
varying vec3 vNormal;

void main(void) {
	vec3 position   = aVertexPosition + uPosition;
	gl_Position     = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vScreenPosition = uLeftProj * uLeftView * uModelMatrix * vec4(position, 1.0);;
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
}