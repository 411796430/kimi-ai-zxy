function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createRadialGradient(id: number, color: string) {
  const fx = random(0, 0.5).toFixed(18);
  const fy = 0.5;
  return `
    <radialGradient id="rg${id}" fx="${fx}" fy="${fy}">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
  `;
}

function createRect(gradientId: number) {
  const scaleX = random(0.7, 1.5).toFixed(3);
  const scaleY = random(0.7, 1.5).toFixed(3);
  const skewX = random(-10, 10).toFixed(2);
  const rotate = random(0, 360).toFixed(2);
  const tx = random(-200, 200).toFixed(2);
  const ty = random(-200, 200).toFixed(2);
  return `
    <rect x="0" y="0" width="100%" height="100%" class="rect rect${gradientId}"
      transform="translate(300 300) scale(${scaleX} ${scaleY}) skewX(${skewX}) rotate(${rotate}) translate(${tx} ${ty}) translate(-300 -300)"/>
  `;
}

export interface GradientOptions {
  colors: string[];
  width?: number;
  height?: number;
}

export function generateRandomSVG({ colors, width = 600, height = 400 }: GradientOptions): string {
  const gradients: string[] = [];
  const rects: string[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < colors.length; j++) {
      const color = colors[j];
      gradients.push(createRadialGradient(j, color));
      rects.push(createRect(j));
    }
  }
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet">
    <defs>
      <clipPath id="clip">
        <rect width="${width}" height="${height}" />
      </clipPath>
      <style>
        #bg {fill:${colors[0]}}
        ${colors.map((_, index) => `.rect${index} {fill:url(#rg${index})}`).join('')}
      </style>
      ${gradients.join("\n")}
    </defs>
    <g clip-path="url(#clip)">
      <rect id="bg" x="0" y="0" width="100%" height="100%"/>
      ${rects.join("\n")}
    </g>
  </svg>
  `;

}