import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

export type ChalkColor =
  | "white"
  | "yellow"
  | "pink"
  | "blue"
  | "orange"
  | "green"
  | "red"
  | "purple";
export type Tool = "chalk" | "eraser";

interface ChalkboardCanvasProps {
  chalkColor: ChalkColor;
  tool: Tool;
  showGrid: boolean;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export interface ChalkboardCanvasRef {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  save: () => void;
  getImageData: () => string;
  loadImageData: (data: string) => void;
}

const CHALK_COLORS: Record<ChalkColor, string> = {
  white: "rgba(255, 255, 255, 0.9)",
  yellow: "rgba(255, 244, 129, 0.9)",
  pink: "rgba(255, 182, 193, 0.9)",
  blue: "rgba(135, 206, 250, 0.9)",
  orange: "rgba(255, 165, 80, 0.9)",
  green: "rgba(144, 238, 144, 0.9)",
  red: "rgba(255, 99, 99, 0.9)",
  purple: "rgba(200, 162, 200, 0.9)",
};

function fillChalkboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.fillStyle = "#1a3a2e";
  ctx.fillRect(0, 0, width, height);
  // Subtle noise texture
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

export const ChalkboardCanvas = forwardRef<
  ChalkboardCanvasRef,
  ChalkboardCanvasProps
>(({ chalkColor, tool, showGrid, onHistoryChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);
  const stepRef = useRef(-1);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const notifyHistory = () => {
    onHistoryChange?.(stepRef.current > 0, stepRef.current < historyRef.current.length - 1);
  };

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current = historyRef.current.slice(0, stepRef.current + 1);
    historyRef.current.push(imageData);
    stepRef.current = historyRef.current.length - 1;
    notifyHistory();
  };

  // Initialize & resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      fillChalkboard(ctx, rect.width, rect.height);
      saveToHistory(ctx);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Grid overlay
  useEffect(() => {
    if (!showGrid) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const gridSize = 50;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;
    for (let x = gridSize; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = gridSize; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }, [showGrid]);

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    undo() {
      if (stepRef.current <= 0) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      stepRef.current -= 1;
      ctx.putImageData(historyRef.current[stepRef.current], 0, 0);
      notifyHistory();
    },
    redo() {
      if (stepRef.current >= historyRef.current.length - 1) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      stepRef.current += 1;
      ctx.putImageData(historyRef.current[stepRef.current], 0, 0);
      notifyHistory();
    },
    clear() {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      fillChalkboard(ctx, rect.width, rect.height);
      saveToHistory(ctx);
    },
    save() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `blackboard-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    },
    getImageData() {
      return canvasRef.current?.toDataURL() ?? "";
    },
    loadImageData(data: string) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveToHistory(ctx);
      };
      img.src = data;
    },
  }));

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const applyChalkStyle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    const color = CHALK_COLORS[chalkColor];
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      // Subtle chalk dust
      for (let i = 0; i < 2; i++) {
        const ox = (Math.random() - 0.5) * 2;
        const oy = (Math.random() - 0.5) * 2;
        const size = Math.random() * 1 + 0.5;
        ctx.fillStyle = color;
        ctx.fillRect(x + ox, y + oy, size, size);
      }
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPosition(e);
    lastPosRef.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
    applyChalkStyle(ctx, x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPosRef.current) return;
    const { x, y } = getPosition(e);
    applyChalkStyle(ctx, x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";
    lastPosRef.current = null;
    saveToHistory(ctx);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full touch-none cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
});

ChalkboardCanvas.displayName = "ChalkboardCanvas";
