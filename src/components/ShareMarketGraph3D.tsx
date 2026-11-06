import React, { useEffect, useRef } from 'react';

export const ShareMarketGraph3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    resize();
    window.addEventListener('resize', resize);

    // Candlestick data points (42 bars across the chart)
    const barCount = 38;

    const render = () => {
      t += 0.012; // slow motion
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Perspective Horizontal Grid Lines
      ctx.lineWidth = 1;
      const gridRows = 6;
      for (let r = 1; r < gridRows; r++) {
        const y = (h / gridRows) * r;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        // Coordinate price tag on right
        ctx.fillStyle = 'rgba(226, 168, 80, 0.25)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`$${(3200 - r * 380).toLocaleString()}`, w - 24, y - 4);
      }

      // Vertical time markers
      const cols = 8;
      for (let c = 1; c < cols; c++) {
        const x = (w / cols) * c;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // 2. Generate Slow-Motion Candlesticks & Share Market Curve
      const startX = 40;
      const endX = w - 40;
      const chartW = endX - startX;
      const stepX = chartW / barCount;
      const baselineY = h * 0.58;

      const points: { x: number; y: number; open: number; close: number; high: number; low: number; isUp: boolean }[] = [];

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * stepX;
        
        // Complex harmonic wave: slow up-and-down market fluctuation with general bullish trend
        const wave1 = Math.sin(t * 0.4 + i * 0.22) * 55;
        const wave2 = Math.cos(t * 0.25 + i * 0.12) * 40;
        const trend = (i / barCount) * -50; // upward market trajectory
        const noise = Math.sin(i * 1.7 + t * 0.15) * 18;

        const closeY = baselineY + wave1 + wave2 + trend + noise;
        const openY = closeY + Math.sin(i * 2.3 + t * 0.3) * 18;
        const highY = Math.min(openY, closeY) - Math.abs(Math.sin(i * 3.1) * 22) - 8;
        const lowY = Math.max(openY, closeY) + Math.abs(Math.cos(i * 2.8) * 20) + 6;

        const isUp = closeY < openY; // in canvas, smaller Y is higher price
        points.push({ x, y: closeY, open: openY, close: closeY, high: highY, low: lowY, isUp });
      }

      // Draw Candlesticks in 3D Perspective
      points.forEach(p => {
        const candleW = Math.max(4, stepX * 0.48);
        const candleColor = p.isUp ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.35)';
        const wickColor = p.isUp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.25)';

        // Wick line (High to Low)
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.high);
        ctx.lineTo(p.x, p.low);
        ctx.stroke();

        // Candle Body (Open to Close)
        ctx.fillStyle = candleColor;
        const topY = Math.min(p.open, p.close);
        const bodyH = Math.max(3, Math.abs(p.close - p.open));
        ctx.fillRect(p.x - candleW / 2, topY, candleW, bodyH);

        // Volume Bar at the bottom
        const volH = Math.abs(p.close - p.open) * 1.8 + 8;
        ctx.fillStyle = p.isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)';
        ctx.fillRect(p.x - candleW / 2, h - volH - 15, candleW, volH);
      });

      // 3. Smooth Golden Bezier Spline Trend Line
      if (points.length > 2) {
        // Gradient area under the line
        const areaGrad = ctx.createLinearGradient(0, baselineY - 120, 0, h);
        areaGrad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
        areaGrad.addColorStop(0.5, 'rgba(226, 168, 80, 0.05)');
        areaGrad.addColorStop(1, 'rgba(25, 22, 20, 0)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineTo(points[points.length - 1].x, h);
        ctx.lineTo(points[0].x, h);
        ctx.closePath();
        ctx.fillStyle = areaGrad;
        ctx.fill();

        // Main Golden Trend Line Stroke
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // 4. Pulsing Market Head Point (Current Real-time Price Tracker)
        const lastPt = points[points.length - 1];
        const pulse = 1.0 + Math.sin(t * 3.5) * 0.4;

        // Outer ripple
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 14 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Center solid bead
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Floating Real-Time Share Market Ticker Badge
        const badgeText = '▲ +24.8% $2.4M SALES INDEX';
        ctx.font = 'bold 11px monospace';
        const textMetrics = ctx.measureText(badgeText);
        const badgeW = textMetrics.width + 16;
        const badgeH = 22;
        const badgeX = Math.min(w - badgeW - 15, lastPt.x - badgeW / 2);
        const badgeY = lastPt.y - 32;

        ctx.fillStyle = 'rgba(20, 17, 15, 0.9)';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.fillText('▲ +24.8%', badgeX + 8, badgeY + 15);
        ctx.fillStyle = '#fef08a';
        ctx.fillText('$2.4M INDEX', badgeX + 66, badgeY + 15);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{
        perspective: '1000px',
        opacity: 0.85,
      }}
    >
      {/* 3D Isometric Pitch & Tilt for Financial Trading Floor Depth */}
      <div
        className="w-full h-full"
        style={{
          transform: 'rotateX(18deg) rotateY(-4deg) scale(1.08)',
          transformOrigin: '50% 65%',
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};

