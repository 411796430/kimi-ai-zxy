/**
 * 色彩工具库测试
 * 运行测试: npm test
 */

import {
  hexToHsl,
  hslToHex,
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateSplitComplementary,
  generateTetradic,
  generateMonochromatic,
  generateHarmony,
  getAllHarmonies,
  getColorFromWheel,
  type HarmonyType
} from '../colorUtils';

describe('Color Utils', () => {
  describe('hexToHsl', () => {
    it('should convert red hex to HSL correctly', () => {
      const result = hexToHsl('#FF0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should convert green hex to HSL correctly', () => {
      const result = hexToHsl('#00FF00');
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should convert blue hex to HSL correctly', () => {
      const result = hexToHsl('#0000FF');
      expect(result.h).toBe(240);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should convert white hex to HSL correctly', () => {
      const result = hexToHsl('#FFFFFF');
      expect(result.s).toBe(0);
      expect(result.l).toBe(100);
    });

    it('should convert black hex to HSL correctly', () => {
      const result = hexToHsl('#000000');
      expect(result.s).toBe(0);
      expect(result.l).toBe(0);
    });
  });

  describe('hslToHex', () => {
    it('should convert red HSL to hex correctly', () => {
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      expect(result.toLowerCase()).toBe('#ff0000');
    });

    it('should convert green HSL to hex correctly', () => {
      const result = hslToHex({ h: 120, s: 100, l: 50 });
      expect(result.toLowerCase()).toBe('#00ff00');
    });

    it('should convert blue HSL to hex correctly', () => {
      const result = hslToHex({ h: 240, s: 100, l: 50 });
      expect(result.toLowerCase()).toBe('#0000ff');
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain color after hex -> hsl -> hex conversion', () => {
      const originalColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33'];
      originalColors.forEach(color => {
        const hsl = hexToHsl(color);
        const backToHex = hslToHex(hsl);
        // Allow small rounding differences
        expect(backToHex.toLowerCase()).toBe(color.toLowerCase());
      });
    });
  });

  describe('generateComplementary', () => {
    it('should generate complementary colors', () => {
      const result = generateComplementary('#FF0000');
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('#FF0000');
      // Red's complementary should be cyan
      expect(result[1].toLowerCase()).toBe('#00ffff');
    });

    it('should handle blue correctly', () => {
      const result = generateComplementary('#0000FF');
      // Blue's complementary should be yellow
      expect(result[1].toLowerCase()).toBe('#ffff00');
    });
  });

  describe('generateAnalogous', () => {
    it('should generate analogous colors', () => {
      const result = generateAnalogous('#FF0000');
      expect(result).toHaveLength(3);
      expect(result[1]).toBe('#FF0000'); // Middle color should be the base
    });
  });

  describe('generateTriadic', () => {
    it('should generate triadic colors', () => {
      const result = generateTriadic('#FF0000');
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('#FF0000');
    });

    it('should have 120 degree separation', () => {
      const result = generateTriadic('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      const hsl3 = hexToHsl(result[2]);

      // Check approximate 120 degree separation
      const diff1 = (hsl2.h - hsl1.h + 360) % 360;
      const diff2 = (hsl3.h - hsl2.h + 360) % 360;

      expect(Math.abs(diff1 - 120)).toBeLessThan(5);
      expect(Math.abs(diff2 - 120)).toBeLessThan(5);
    });
  });

  describe('generateSplitComplementary', () => {
    it('should generate split complementary colors', () => {
      const result = generateSplitComplementary('#FF0000');
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('#FF0000');
    });
  });

  describe('generateTetradic', () => {
    it('should generate tetradic colors', () => {
      const result = generateTetradic('#FF0000');
      expect(result).toHaveLength(4);
      expect(result[0]).toBe('#FF0000');
    });
  });

  describe('generateMonochromatic', () => {
    it('should generate monochromatic colors', () => {
      const result = generateMonochromatic('#FF0000');
      expect(result).toHaveLength(5);
      expect(result[2]).toBe('#FF0000'); // Middle should be base color
    });

    it('should have same hue for all colors', () => {
      const result = generateMonochromatic('#5135FF');
      const baseHsl = hexToHsl('#5135FF');

      result.forEach(color => {
        const hsl = hexToHsl(color);
        expect(hsl.h).toBe(baseHsl.h);
      });
    });
  });

  describe('generateHarmony', () => {
    const harmonyTypes: HarmonyType[] = [
      'complementary',
      'analogous',
      'triadic',
      'splitComplementary',
      'tetradic',
      'monochromatic'
    ];

    harmonyTypes.forEach(type => {
      it(`should generate ${type} harmony`, () => {
        const result = generateHarmony('#5135FF', type);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('#5135FF');
      });
    });
  });

  describe('getAllHarmonies', () => {
    it('should return all harmony types', () => {
      const result = getAllHarmonies('#5135FF');
      expect(result).toHaveLength(6);

      const names = result.map(h => h.name);
      expect(names).toContain('互补色 (Complementary)');
      expect(names).toContain('类似色 (Analogous)');
      expect(names).toContain('三角色 (Triadic)');
      expect(names).toContain('分裂互补 (Split)');
      expect(names).toContain('矩形 (Tetradic)');
      expect(names).toContain('单色 (Monochromatic)');
    });
  });

  describe('getColorFromWheel', () => {
    it('should generate color from wheel angle', () => {
      const red = getColorFromWheel(0);
      expect(red.toLowerCase()).toBe('#ff0000');

      const green = getColorFromWheel(120);
      expect(green.toLowerCase()).toBe('#00ff00');

      const blue = getColorFromWheel(240);
      expect(blue.toLowerCase()).toBe('#0000ff');
    });

    it('should handle angle normalization', () => {
      const color1 = getColorFromWheel(360);
      const color2 = getColorFromWheel(0);
      expect(color1).toBe(color2);
    });
  });
});

// 运行测试的辅助函数
export function runTests() {
  console.log('Running color utility tests...\n');

  // 测试颜色转换
  console.log('1. Testing color conversion:');
  const testColors = ['#FF0000', '#00FF00', '#0000FF', '#5135FF', '#FF5828'];
  testColors.forEach(color => {
    const hsl = hexToHsl(color);
    const backToHex = hslToHex(hsl);
    console.log(`  ${color} -> HSL(${hsl.h}, ${hsl.s}%, ${hsl.l}%) -> ${backToHex}`);
  });

  // 测试配色方案
  console.log('\n2. Testing harmony generation for #5135FF:');
  const harmonies = getAllHarmonies('#5135FF');
  harmonies.forEach(harmony => {
    console.log(`  ${harmony.name}:`);
    console.log(`    Colors: ${harmony.colors.join(', ')}`);
  });

  // 测试色轮颜色生成
  console.log('\n3. Testing wheel color generation:');
  const angles = [0, 60, 120, 180, 240, 300];
  angles.forEach(angle => {
    const color = getColorFromWheel(angle);
    console.log(`  Angle ${angle}° -> ${color}`);
  });

  console.log('\n✅ All tests completed!');
}

// 如果直接运行此文件
if (typeof window !== 'undefined') {
  runTests();
}
