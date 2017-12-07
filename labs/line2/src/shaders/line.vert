// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

attribute vec3 aPrevious;
attribute vec3 aNext;
attribute float aSide;
attribute float aWidth;
attribute float aCounter;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uAspectRatio;
uniform vec2 uDimension;

varying vec2 vTextureCoord;
varying vec3 vNormal;


varying vec3 vPrevious;
varying vec3 vNext;
varying float vSide;
varying float vWidth;
varying float vCounter;


vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main(void) {
	// float aspect = uDimension.x / uDimension.y;
	// float pixelWidthRatio = 1.0 / (uDimension.x * uProjectionMatrix[0][0]);

	// mat4 m = uProjectionMatrix * uViewMatrix * uModelMatrix;
	// vec4 finalPosition = m * vec4( aVertexPosition, 1.0 );
	// vec4 prevPos = m * vec4( aPrevious, 1.0 );
	// vec4 nextPos = m * vec4( aNext, 1.0 );

	// vec2 currentP = fix( finalPosition, aspect );
	// vec2 prevP = fix( prevPos, aspect );
	// vec2 nextP = fix( nextPos, aspect );

	// float lineWidth = 0.1;

	// float pixelWidth = finalPosition.w * pixelWidthRatio;
	// float w = 1.8 * pixelWidth * lineWidth * aWidth;

	// float sizeAttenuation = 1.0;
	// if( sizeAttenuation == 1.0 ) {
	// 	w = 1.8 * lineWidth * aWidth;
	// }


	// vec2 dir;
	// if( nextP == currentP ) dir = normalize( currentP - prevP );
	// else if( prevP == currentP ) dir = normalize( nextP - currentP );
	// else {
	// 	vec2 dir1 = normalize( currentP - prevP );
	// 	vec2 dir2 = normalize( nextP - currentP );
	// 	dir = normalize( dir1 + dir2 );

	// 	vec2 perp = vec2( -dir1.y, dir1.x );
	// 	vec2 miter = vec2( -dir.y, dir.x );
	// }

	// vec2 normal = vec2( -dir.y, dir.x );
	// normal.x /= aspect;
	// normal *= .5 * w;

	// vec4 offset = vec4( normal * aSide, 0.0, 1.0 );
	// finalPosition.xy += offset.xy;

	// gl_Position = finalPosition;

	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.);

	vTextureCoord = aTextureCoord;
	vNormal = aNormal;
	vCounter = aCounter;

	vPrevious = aPrevious;
	vNext = aNext;
	vSide = aSide;
	vWidth = aWidth;
}