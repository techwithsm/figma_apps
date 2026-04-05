import { useState, useRef } from "react";
import {
  ChalkboardCanvas,
  ChalkColor,
  Tool,
  ChalkboardCanvasRef,
} from "./components/ChalkboardCanvas";
import { Toolbar } from "./components/Toolbar";

interface Board {
  id: number;
  imageData: string | null;
}

export default function App() {
  const [chalkColor, setChalkColor] = useState<ChalkColor>("white");
  const [tool, setTool] = useState<Tool>("chalk");
  const [showGrid, setShowGrid] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [boards, setBoards] = useState<Board[]>([{ id: 1, imageData: null }]);
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const canvasRef = useRef<ChalkboardCanvasRef>(null);

  const handleHistoryChange = (undo: boolean, redo: boolean) => {
    setCanUndo(undo);
    setCanRedo(redo);
  };

  const handleNextPage = () => {
    const imageData = canvasRef.current?.getImageData();
    setBoards((prev) => {
      const updated = [...prev];
      if (imageData) updated[currentBoardIndex] = { ...updated[currentBoardIndex], imageData };
      return updated;
    });

    const nextIndex = currentBoardIndex + 1;

    if (nextIndex < boards.length) {
      setCurrentBoardIndex(nextIndex);
      setTimeout(() => {
        const nextData = boards[nextIndex].imageData;
        if (nextData) {
          canvasRef.current?.loadImageData(nextData);
        } else {
          canvasRef.current?.clear();
        }
      }, 50);
    } else {
      setBoards((prev) => [...prev, { id: prev.length + 1, imageData: null }]);
      setCurrentBoardIndex(nextIndex);
      setTimeout(() => canvasRef.current?.clear(), 50);
    }
  };

  const handlePrevPage = () => {
    if (currentBoardIndex === 0) return;

    const imageData = canvasRef.current?.getImageData();
    setBoards((prev) => {
      const updated = [...prev];
      if (imageData) updated[currentBoardIndex] = { ...updated[currentBoardIndex], imageData };
      return updated;
    });

    const prevIndex = currentBoardIndex - 1;
    setCurrentBoardIndex(prevIndex);
    setTimeout(() => {
      const prevData = boards[prevIndex].imageData;
      if (prevData) {
        canvasRef.current?.loadImageData(prevData);
      } else {
        canvasRef.current?.clear();
      }
    }, 50);
  };

  return (
    <div className="w-screen h-screen bg-[#1a3a2e] overflow-hidden relative">
      {/* Chalkboard Canvas */}
      <div className="w-full h-full">
        <ChalkboardCanvas
          ref={canvasRef}
          chalkColor={chalkColor}
          tool={tool}
          showGrid={showGrid}
          onHistoryChange={handleHistoryChange}
        />
      </div>

      {/* Floating Toolbar */}
      <Toolbar
        chalkColor={chalkColor}
        onChalkColorChange={setChalkColor}
        tool={tool}
        onToolChange={setTool}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onClear={() => canvasRef.current?.clear()}
        onSave={() => canvasRef.current?.save()}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((g) => !g)}
        currentPage={currentBoardIndex + 1}
        totalPages={boards.length}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Subtle corner label */}
      <div className="absolute top-4 left-4 opacity-30 pointer-events-none">
        <span className="text-emerald-200/20 font-serif text-sm select-none">
          Digital Blackboard
        </span>
      </div>
    </div>
  );
}
