'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ColorWheel } from './ColorWheel';
import { HarmonyPresets } from './HarmonyPresets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Shuffle, Check } from 'lucide-react';
import { HarmonyType } from '@/lib/colorUtils';

type SelectionMode = 'free' | 'recommend';

interface ColorSelectorProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  className?: string;
}

export function ColorSelector({ colors, onColorsChange, className }: ColorSelectorProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [color1, setColor1] = useState(colors[0] || '#5135FF');
  const [color2, setColor2] = useState(colors[1] || '#FF5828');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType | undefined>();

  // 处理颜色1变化
  const handleColor1Change = (newColor: string) => {
    setColor1(newColor);
  };

  // 处理颜色2变化
  const handleColor2Change = (newColor: string) => {
    setColor2(newColor);
  };

  // 处理选择配色方案
  const handleSelectHarmony = (harmonyColors: string[]) => {
    onColorsChange(harmonyColors);
    // 更新色轮上的颜色为方案的前两个颜色
    if (harmonyColors.length >= 2) {
      setColor1(harmonyColors[0]);
      setColor2(harmonyColors[1]);
    }
  };

  // 随机颜色
  const handleRandomColors = () => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const c1 = randomColor();
    const c2 = randomColor();
    setColor1(c1);
    setColor2(c2);
    onColorsChange([c1, c2]);
    setSelectedHarmony(undefined);
  };

  // 应用当前两种颜色
  const handleApplyTwoColors = () => {
    onColorsChange([color1, color2]);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 模式切换 */}
      <div className="flex p-1 bg-muted rounded-xl">
        <button
          onClick={() => setMode('free')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            mode === 'free'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Palette className="w-4 h-4" />
          自由选择
        </button>
        <button
          onClick={() => setMode('recommend')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            mode === 'recommend'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="w-4 h-4" />
          推荐配色
        </button>
      </div>

      {/* 色轮区域 - 推荐模式下只显示主色选择 */}
      <div className="flex flex-col items-center gap-6">
        {mode === 'free' ? (
          <>
            <ColorWheel
              color1={color1}
              color2={color2}
              onColor1Change={handleColor1Change}
              onColor2Change={handleColor2Change}
              size={260}
            />

            {/* 颜色输入 */}
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">1</span>
                  主色
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color1}
                    onChange={(e) => handleColor1Change(e.target.value)}
                    className="w-12 h-10 p-1 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color1.toUpperCase()}
                    onChange={(e) => handleColor1Change(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">2</span>
                  辅色
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color2}
                    onChange={(e) => handleColor2Change(e.target.value)}
                    className="w-12 h-10 p-1 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color2.toUpperCase()}
                    onChange={(e) => handleColor2Change(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleRandomColors}
                className="flex-1"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                随机
              </Button>
              <Button
                onClick={handleApplyTwoColors}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                应用
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* 推荐模式：简化的主色选择 */}
            <div className="w-full flex flex-col items-center gap-4">
              <div className="text-sm text-muted-foreground mb-2">
                选择主色，系统将自动推荐配色方案
              </div>
              
              {/* 简化的色轮 - 只选择主色 */}
              <ColorWheel
                color1={color1}
                color2={color1}
                onColor1Change={handleColor1Change}
                onColor2Change={() => {}}
                size={200}
                showSecondPicker={false}
              />

              {/* 主色输入 */}
              <div className="w-full space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">1</span>
                  主色
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color1}
                    onChange={(e) => handleColor1Change(e.target.value)}
                    className="w-12 h-10 p-1 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color1.toUpperCase()}
                    onChange={(e) => handleColor1Change(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                </div>
              </div>

              {/* 随机主色按钮 */}
              <Button
                variant="outline"
                onClick={() => {
                  const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                  const c1 = randomColor();
                  setColor1(c1);
                }}
                className="w-full"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                随机主色
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 推荐模式下的配色方案 */}
      {mode === 'recommend' && (
        <HarmonyPresets
          baseColor={color1}
          onSelectHarmony={handleSelectHarmony}
          selectedType={selectedHarmony}
        />
      )}

      {/* 当前使用的颜色预览 */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">当前配色</span>
          <span className="text-xs text-muted-foreground">{colors.length} 种颜色</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
