// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vScreenPosition;

uniform sampler2D texture;
uniform sampler2D textureInner;
uniform sampler2D textureMap;



void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    vec4 colorInner = texture2D(textureInner, vTextureCoord);

    vec4 screenCoord = vScreenPosition / vScreenPosition.w;
    vec2 uvScreen = screenCoord.xy * .5 + .5;
    float colorMap = texture2D(textureMap, uvScreen).r;

    float a = smoothstep(0.0, 0.2, vTextureCoord.y);


    gl_FragColor = mix(color, colorInner, colorMap);
    gl_FragColor.a *= a;
}