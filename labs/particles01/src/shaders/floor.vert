// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec4 vScreenPosition;

void main(void) {
	vec4 wsPosition = uModelMatrix * vec4(aVertexPosition, 1.0);
    vScreenPosition = uProjectionMatrix * uViewMatrix * wsPosition;
    gl_Position = vScreenPosition;
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    vShadowCoord = uShadowMatrix * wsPosition;
}