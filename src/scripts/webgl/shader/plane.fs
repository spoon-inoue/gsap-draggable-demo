#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D imgUnit;
uniform float imgAspect;

in vec2 vUv;
out vec4 outColor;

#define coveredScale(screenAspect, imageAspect) (screenAspect < imageAspect ? vec2(screenAspect / imageAspect, 1) : vec2(1, imageAspect / screenAspect))

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  float aspect = resolution.x / resolution.y;
  uv = (uv - 0.5) * coveredScale(aspect, imgAspect) + 0.5;

  vec4 img = texture(imgUnit, uv);

  outColor = img;
}