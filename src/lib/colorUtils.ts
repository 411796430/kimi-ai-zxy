/**
 * 色彩工具库 - 包含色彩转换和配色算法
 */

export interface HSL {
  h: number; // 色相 0-360
  s: number; // 饱和度 0-100
  l: number; // 亮度 0-100
}

export interface ColorHarmony {
  name: string;
  colors: string[];
}

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'splitComplementary' | 'tetradic' | 'monochromatic';

/**
 * 将 HEX 颜色转换为 HSL
 */
export function hexToHsl(hex: string): HSL {
  let r = 0, g = 0, b = 0;

  if (hex.length === 4) {
    r = parseInt('0x' + hex[1] + hex[1]);
    g = parseInt('0x' + hex[2] + hex[2]);
    b = parseInt('0x' + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt('0x' + hex[1] + hex[2]);
    g = parseInt('0x' + hex[3] + hex[4]);
    b = parseInt('0x' + hex[5] + hex[6]);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将 HSL 颜色转换为 HEX
 */
export function hslToHex(hsl: HSL): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * 计算色轮上的角度差
 */
function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

/**
 * 生成互补色配色方案 (Complementary)
 * 色轮上相对的颜色 (相差180度)
 */
export function generateComplementary(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  const complementary = {
    ...hsl,
    h: normalizeHue(hsl.h + 180)
  };
  return [baseColor, hslToHex(complementary)];
}

/**
 * 生成类似色配色方案 (Analogous)
 * 色轮上相邻的颜色 (相差±30度)
 */
export function generateAnalogous(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  return [
    hslToHex({ ...hsl, h: normalizeHue(hsl.h - 30) }),
    baseColor,
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 30) })
  ];
}

/**
 * 生成三角色配色方案 (Triadic)
 * 色轮上等距的三种颜色 (相差120度)
 */
export function generateTriadic(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  return [
    baseColor,
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 120) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 240) })
  ];
}

/**
 * 生成分裂互补配色方案 (Split Complementary)
 * 互补色两侧的颜色 (相差150度和210度)
 */
export function generateSplitComplementary(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  return [
    baseColor,
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 150) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 210) })
  ];
}

/**
 * 生成矩形配色方案 (Tetradic/Rectangle)
 * 四种颜色，两组互补色 (相差60度、180度、240度)
 */
export function generateTetradic(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  return [
    baseColor,
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 60) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 180) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 240) })
  ];
}

/**
 * 生成单色配色方案 (Monochromatic)
 * 同一色相的不同明度和饱和度
 */
export function generateMonochromatic(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  return [
    hslToHex({ ...hsl, l: Math.max(20, hsl.l - 30) }),
    hslToHex({ ...hsl, l: Math.max(40, hsl.l - 15) }),
    baseColor,
    hslToHex({ ...hsl, l: Math.min(80, hsl.l + 15) }),
    hslToHex({ ...hsl, l: Math.min(95, hsl.l + 30) })
  ];
}

/**
 * 根据类型生成配色方案
 */
export function generateHarmony(baseColor: string, type: HarmonyType): string[] {
  switch (type) {
    case 'complementary':
      return generateComplementary(baseColor);
    case 'analogous':
      return generateAnalogous(baseColor);
    case 'triadic':
      return generateTriadic(baseColor);
    case 'splitComplementary':
      return generateSplitComplementary(baseColor);
    case 'tetradic':
      return generateTetradic(baseColor);
    case 'monochromatic':
      return generateMonochromatic(baseColor);
    default:
      return [baseColor];
  }
}

/**
 * 获取所有配色方案
 */
export function getAllHarmonies(baseColor: string): ColorHarmony[] {
  return [
    { name: '互补色 (Complementary)', colors: generateComplementary(baseColor) },
    { name: '类似色 (Analogous)', colors: generateAnalogous(baseColor) },
    { name: '三角色 (Triadic)', colors: generateTriadic(baseColor) },
    { name: '分裂互补 (Split)', colors: generateSplitComplementary(baseColor) },
    { name: '矩形 (Tetradic)', colors: generateTetradic(baseColor) },
    { name: '单色 (Monochromatic)', colors: generateMonochromatic(baseColor) }
  ];
}

/**
 * 根据色轮位置计算颜色
 * angle: 0-360度
 * saturation: 0-100
 * lightness: 0-100
 */
export function getColorFromWheel(angle: number, saturation: number = 100, lightness: number = 50): string {
  return hslToHex({
    h: normalizeHue(angle),
    s: saturation,
    l: lightness
  });
}

/**
 * 计算色轮上的位置（从中心到边缘）
 */
export function getPositionFromColor(hex: string, radius: number): { x: number; y: number } {
  const hsl = hexToHsl(hex);
  const angle = (hsl.h - 90) * (Math.PI / 180); // 从12点钟方向开始
  const distance = (hsl.s / 100) * radius;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  };
}

/**
 * 计算两点之间的角度
 */
export function getAngleFromPosition(x: number, y: number): number {
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return normalizeHue(angle + 90); // 转换为从12点钟方向开始
}

/**
 * 计算两点之间的距离
 */
export function getDistanceFromCenter(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}
