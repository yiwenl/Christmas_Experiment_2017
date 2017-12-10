// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uPosition;

varying vec2 vTextureCoord;
varying vec4 vScreenPosition;

void main(void) {
	vec3 position = aVertexPosition + uPosition;
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    gl_Position = vScreenPosition;
    vTextureCoord = aTextureCoord;
}