// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLeftProj;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main(void) {

	mat4 matModel = uModelMatrix;
	matModel[3][0] = 0.0;
	matModel[3][1] = 0.0;
	matModel[3][2] = 0.0;

    gl_Position = uProjectionMatrix * matModel * vec4(aVertexPosition * 5.0, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vPosition = normalize(aVertexPosition);
}