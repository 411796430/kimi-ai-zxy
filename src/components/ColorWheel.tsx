import { useState, useRef, useEffect } from 'react';

interface ColorWheelProps {
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  mode: 'free' | 'recommended';
  onModeChange: (mode: 'free' | 'recommended') => void;
}

type ColorFamily = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink';

const colorFamilies: { [key in ColorFamily]: { name: string; hue: number } } = {
  red: { name: '红色', hue: 0 },
  orange: { name: '橙色', hue: 0.08 },
  yellow: { name: '黄色', hue: 0.17 },
  green: { name: '绿色', hue: 0.33 },
  cyan: { name: '青色', hue: 0.5 },
  blue: { name: '蓝色', hue: 0.67 },
  purple: { name: '紫色', hue: 0.83 },
  pink: { name: '粉色', hue: 0.92 }
};

// HSL到RGB的转换函数
const hslToRgb = (h: number, s: number, l: number): string => {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // 灰色
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
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// RGB到HSL的转换函数
const rgbToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h, s, l];
};

// 色彩推荐算法
const generateRecommendedColors = (baseColor: string): string[] => {
  const [h, s, l] = rgbToHsl(baseColor);
  const colors: string[] = [baseColor];
  
  // 互补色
  const complementaryHue = (h + 0.5) % 1;
  colors.push(hslToRgb(complementaryHue, s, l));
  
  // 分裂互补色
  const splitComplementary1 = (h + 0.42) % 1;
  const splitComplementary2 = (h + 0.58) % 1;
  colors.push(hslToRgb(splitComplementary1, s, l));
  colors.push(hslToRgb(splitComplementary2, s, l));
  
  // 三角色
  const triadic1 = (h + 1/3) % 1;
  const triadic2 = (h + 2/3) % 1;
  colors.push(hslToRgb(triadic1, s, l));
  colors.push(hslToRgb(triadic2, s, l));
  
  // 类似色
  const analogous1 = (h + 0.08) % 1;
  const analogous2 = (h - 0.08 + 1) % 1;
  colors.push(hslToRgb(analogous1, s, l));
  colors.push(hslToRgb(analogous2, s, l));
  
  return colors.slice(0, 8); // 最多8个颜色
};

const ColorWheel = ({ selectedColors, onColorChange, mode, onModeChange }: ColorWheelProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<ColorFamily>('blue');
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const handleWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // 计算角度，调整为顺时针方向，0度从顶部开始
    let angle = Math.atan2(y, x);
    angle = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    
    // 基于选中的色系的色相值，结合点击位置的角度计算最终色相
    // 限制在±15%的色相范围内，与轮盘的渐变范围一致
    const baseHue = colorFamilies[selectedFamily].hue;
    const angleRatio = angle / (2 * Math.PI);
    const hue = (baseHue - 0.1 + angleRatio * 0.3) % 1;
    
    // 计算饱和度，基于距离中心的距离
    const distance = Math.sqrt(x * x + y * y);
    const saturation = Math.min(distance / (centerX * 0.9), 1);
    
    // 计算亮度，基于距离中心的距离（中心更亮，边缘更暗）
    const lightness = 0.5 + (1 - saturation) * 0.2;
    
    const color = hslToRgb(hue, saturation, lightness);
    
    if (mode === 'free') {
      // 自由模式：添加颜色
      if (selectedColors.length < 8) {
        onColorChange([...selectedColors, color]);
      }
    } else {
      // 推荐模式：生成推荐颜色
      const recommendedColors = generateRecommendedColors(color);
      onColorChange(recommendedColors);
    }
  };
  
  const removeColor = (index: number) => {
    if (selectedColors.length > 1) {
      onColorChange(selectedColors.filter((_, i) => i !== index));
    }
  };
  
  return (
    <div className="space-y-4">
      {/* 模式选择 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-md font-medium ${mode === 'free' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => onModeChange('free')}
          >
            自由选择
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${mode === 'recommended' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => onModeChange('recommended')}
          >
            推荐选择
          </button>
        </div>
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
          {selectedColors.length}/8
        </span>
      </div>
      
      {/* 色系选择 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">选择色系</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(colorFamilies).map(([key, { name, hue }]) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${selectedFamily === key ? 'ring-2 ring-primary shadow-md scale-105' : 'shadow-sm hover:shadow-md hover:scale-105'}`}
              style={{ 
                backgroundColor: hslToRgb(hue, 0.7, 0.6),
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onClick={() => setSelectedFamily(key as ColorFamily)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 色轮 */}
      <div className="flex justify-center">
        <div
          ref={wheelRef}
          className="relative w-64 h-64 rounded-full cursor-pointer shadow-md"
          style={{
            background: `linear-gradient(
              90deg,
              ${hslToRgb((colorFamilies[selectedFamily].hue - 0.1) % 1, 1, 0.5)},
              ${hslToRgb(colorFamilies[selectedFamily].hue, 1, 0.5)},
              ${hslToRgb((colorFamilies[selectedFamily].hue + 0.1) % 1, 1, 0.5)},
              ${hslToRgb((colorFamilies[selectedFamily].hue + 0.15) % 1, 1, 0.5)},
              ${hslToRgb(colorFamilies[selectedFamily].hue + 0.2, 1, 0.5)},
              ${hslToRgb((colorFamilies[selectedFamily].hue - 0.1) % 1, 1, 0.5)}
            )`
          }}
          onClick={handleWheelClick}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/0 via-white/10 to-black/30"></div>
          <div className="absolute inset-4 rounded-full bg-background border border-border"></div>
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* 已选择的颜色 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">已选择的颜色</h3>
        <div className="flex flex-wrap gap-2">
          {selectedColors.map((color, index) => (
            <div key={index} className="relative flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md border border-border" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs font-mono">{color.toUpperCase()}</span>
              <button
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeColor(index)}
                disabled={selectedColors.length <= 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorWheel;