'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { hexToHsl, hslToHex, getAngleFromPosition } from '@/lib/colorUtils';

interface ColorWheelProps {
  size?: number;
  color1: string;
  color2: string;
  onColor1Change: (color: string) => void;
  onColor2Change: (color: string) => void;
  className?: string;
  showSecondPicker?: boolean;
}

export function ColorWheel({
  size = 280,
  color1,
  color2,
  onColor1Change,
  onColor2Change,
  className,
  showSecondPicker = true
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const [positions, setPositions] = useState<{ x1: number; y1: number; x2: number; y2: number }>({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const center = size / 2;
  const radius = (size - 40) / 2;

  // 绘制色轮
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 绘制色轮
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 90) * Math.PI) / 180;
      const endAngle = ((angle - 89) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 绘制中心白色区域
    ctx.beginPath();
    ctx.arc(center, center, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [center, radius, size]);

  // 计算颜色在色轮上的位置
  const getPositionFromColor = useCallback((color: string) => {
    const hsl = hexToHsl(color);
    const angle = (hsl.h - 90) * (Math.PI / 180);
    const distance = (hsl.s / 100) * radius * 0.85; // 稍微内缩一点

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance
    };
  }, [center, radius]);

  // 根据位置计算颜色
  const getColorFromPosition = useCallback((x: number, y: number) => {
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = getAngleFromPosition(dx, dy);
    const saturation = Math.min(100, (distance / radius) * 100);

    return hslToHex({ h: angle, s: saturation, l: 50 });
  }, [center, radius]);

  // 初始化位置 - 只在组件挂载时执行一次
  useEffect(() => {
    const pos1 = getPositionFromColor(color1);
    const pos2 = getPositionFromColor(color2);
    setPositions({ x1: pos1.x, y1: pos1.y, x2: pos2.x, y2: pos2.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当外部颜色变化时更新位置
  useEffect(() => {
    const pos1 = getPositionFromColor(color1);
    setPositions(prev => ({ ...prev, x1: pos1.x, y1: pos1.y }));
  }, [color1, getPositionFromColor]);

  useEffect(() => {
    const pos2 = getPositionFromColor(color2);
    setPositions(prev => ({ ...prev, x2: pos2.x, y2: pos2.y }));
  }, [color2, getPositionFromColor]);

  // 绘制色轮
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // 处理鼠标/触摸事件
  const handleStart = (e: React.MouseEvent | React.TouchEvent, isColor1: boolean) => {
    e.preventDefault();
    if (isColor1) {
      setIsDragging1(true);
    } else {
      setIsDragging2(true);
    }
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging1 && !isDragging2) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // 限制在色轮内
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) {
      const ratio = radius / distance;
      x = center + dx * ratio;
      y = center + dy * ratio;
    }

    const newColor = getColorFromPosition(x, y);

    if (isDragging1) {
      setPositions(prev => ({ ...prev, x1: x, y1: y }));
      onColor1Change(newColor);
    } else if (isDragging2) {
      setPositions(prev => ({ ...prev, x2: x, y2: y }));
      onColor2Change(newColor);
    }
  }, [isDragging1, isDragging2, center, radius, getColorFromPosition, onColor1Change, onColor2Change]);

  const handleEnd = useCallback(() => {
    setIsDragging1(false);
    setIsDragging2(false);
  }, []);

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging1 || isDragging2) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging1, isDragging2, handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full cursor-crosshair"
      />

      {/* 颜色1选择器 */}
      <div
        className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-3 border-white shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
        style={{
          left: positions.x1,
          top: positions.y1,
          backgroundColor: color1,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px ${color1}`,
          zIndex: isDragging1 ? 10 : 1
        }}
        onMouseDown={(e) => handleStart(e, true)}
        onTouchStart={(e) => handleStart(e, true)}
      >
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground bg-background/80 px-1.5 py-0.5 rounded">
          1
        </span>
      </div>

      {/* 颜色2选择器 */}
      {showSecondPicker && (
        <div
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-3 border-white shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
          style={{
            left: positions.x2,
            top: positions.y2,
            backgroundColor: color2,
            boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px ${color2}`,
            zIndex: isDragging2 ? 10 : 1
          }}
          onMouseDown={(e) => handleStart(e, false)}
          onTouchStart={(e) => handleStart(e, false)}
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground bg-background/80 px-1.5 py-0.5 rounded">
            2
          </span>
        </div>
      )}
    </div>
  );
}
