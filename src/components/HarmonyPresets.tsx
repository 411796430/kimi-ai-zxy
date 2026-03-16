'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { HarmonyType, getAllHarmonies } from '@/lib/colorUtils';
import { Sparkles, Palette, Contrast, Triangle, Square, Circle, Layers } from 'lucide-react';

interface HarmonyPresetsProps {
  baseColor: string;
  onSelectHarmony: (colors: string[]) => void;
  selectedType?: HarmonyType;
  className?: string;
}

const harmonyIcons: Record<HarmonyType, React.ReactNode> = {
  complementary: <Contrast className="w-4 h-4" />,
  analogous: <Palette className="w-4 h-4" />,
  triadic: <Triangle className="w-4 h-4" />,
  splitComplementary: <Layers className="w-4 h-4" />,
  tetradic: <Square className="w-4 h-4" />,
  monochromatic: <Circle className="w-4 h-4" />
};

const harmonyDescriptions: Record<HarmonyType, string> = {
  complementary: '色轮上相对的颜色，对比强烈',
  analogous: '色轮上相邻的颜色，和谐自然',
  triadic: '色轮上等距的三种颜色，平衡活泼',
  splitComplementary: '互补色两侧的颜色，对比柔和',
  tetradic: '两组互补色，丰富多样',
  monochromatic: '同一色相的不同明度，简洁统一'
};

export function HarmonyPresets({
  baseColor,
  onSelectHarmony,
  selectedType,
  className
}: HarmonyPresetsProps) {
  const harmonies = getAllHarmonies(baseColor);

  const typeMap: Record<string, HarmonyType> = {
    '互补色 (Complementary)': 'complementary',
    '类似色 (Analogous)': 'analogous',
    '三角色 (Triadic)': 'triadic',
    '分裂互补 (Split)': 'splitComplementary',
    '矩形 (Tetradic)': 'tetradic',
    '单色 (Monochromatic)': 'monochromatic'
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>基于主色推荐配色方案</span>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
        {harmonies.map((harmony) => {
          const type = typeMap[harmony.name];
          const isSelected = selectedType === type;

          return (
            <button
              key={harmony.name}
              onClick={() => onSelectHarmony(harmony.colors)}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              {/* 颜色预览 */}
              <div className="flex -space-x-1.5">
                {harmony.colors.slice(0, 4).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {harmony.colors.length > 4 && (
                  <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    +{harmony.colors.length - 4}
                  </div>
                )}
              </div>

              {/* 文字信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-primary",
                    isSelected && "text-primary"
                  )}>
                    {harmonyIcons[type]}
                  </span>
                  <span className="font-medium text-sm truncate">
                    {harmony.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {harmonyDescriptions[type]}
                </p>
              </div>

              {/* 选中标记 */}
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
