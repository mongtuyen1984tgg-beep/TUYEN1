import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  color?: {
    dark?: string;
    light?: string;
  };
}

export const QRCodeComponent: React.FC<QRCodeProps> = ({
  value,
  size = 180,
  className = '',
  color = { dark: '#005596', light: '#FFFFFF' }
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: color.dark || '#005596',
          light: color.light || '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }, (error) => {
        if (error) {
          console.error('Error rendering QR code:', error);
        }
      });
    }
  }, [value, size, color]);

  return (
    <div className={`inline-flex p-2 bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg max-w-full h-auto" />
    </div>
  );
};
