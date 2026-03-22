"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";

export const SignaturePad = ({ onSave }: { onSave: (img: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  };

  const startDrawing = (e: any) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border">
      <canvas 
        ref={canvasRef} width={400} height={180} 
        className="bg-white rounded-lg border shadow-inner cursor-pen w-full touch-none"
        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)}
        onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
      />
      <div className="flex justify-between">
        <Button variant="outline" onClick={clear} size="sm" className="text-red-500">
          <Trash2 size={16} className="mr-2"/> Effacer
        </Button>
        <Button onClick={() => onSave(canvasRef.current?.toDataURL() || '')} size="sm" className="bg-emerald-600">
          <Check size={16} className="mr-2"/> Confirmer Signature
        </Button>
      </div>
    </div>
  );
};