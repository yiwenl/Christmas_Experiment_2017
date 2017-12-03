// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureInner;
uniform sampler2D textureMap;
uniform vec2 uDimension;

void main(void) {
	vec2 uv = gl_FragCoord.xy/uDimension;
	vec4 colorMap = texture2D(textureMap, uv);

	vec4 color = texture2D(texture, vTextureCoord);
	vec4 colorInner = texture2D(textureInner, vTextureCoord);

    // gl_FragColor = texture2D(texture, vTextureCoord);
    // gl_FragColor = vec4(gl_FragCoord.xy/uDimension, 0.0, 1.0);

    gl_FragColor = mix(color, colorInner, colorMap.r);
}