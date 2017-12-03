// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vExtra;
varying vec3 vMap;

void main(void) {
	float d = distance(gl_PointCoord, vec2(.5));
	if( d > .5) discard;

	d = smoothstep(.5, 0.0, d) * .25;
	float threshold = vMap.x * 0.9;
	vec3 color = vec3(1.0, 0.0, 0.0);
	if(vExtra.z < threshold) {
		// discard;
		color = vec3(0.0, 1.0, 0.0);
		discard;
	}

    // gl_FragColor = vec4(1.0, 0.0, 0.0, 0.25);
    gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);
    gl_FragColor = vec4(vec3(1.0), 0.25);
    // gl_FragColor = vec4(color, 1.0);
}