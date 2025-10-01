"use client";

import { useEffect, useRef } from 'react';

export const NoiseBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create noise pattern
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imageData.data.buffer);

      for (let i = 0; i < buffer.length; i++) {
        if (Math.random() < 0.5) {
          buffer[i] = 0xff0a0a0a;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      // Draw animated wave lines
      ctx.strokeStyle = 'rgba(8, 214, 180, 0.2)';
      ctx.lineWidth = 1.5;

      // Horizontal wave lines
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const y = (canvas.height / 15) * i;
        for (let x = 0; x < canvas.width; x += 5) {
          const waveY = y + Math.sin((x * 0.01) + time + (i * 0.2)) * 20;
          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }

      // Vertical wave lines
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const x = (canvas.width / 10) * i;
        for (let y = 0; y < canvas.height; y += 5) {
          const waveX = x + Math.sin((y * 0.01) + time + (i * 0.3)) * 15;
          if (y === 0) {
            ctx.moveTo(waveX, y);
          } else {
            ctx.lineTo(waveX, y);
          }
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-[0.08]"
      style={{ imageRendering: 'auto' }}
    />
  );
};
