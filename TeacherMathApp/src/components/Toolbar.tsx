import { useState } from "react";
import {
  Pencil,
  Eraser,
  Undo,
  Redo,
  Trash2,
  Download,
  Grid3x3,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ChalkColor, Tool } from "./ChalkboardCanvas";

interface ToolbarProps {
  chalkColor: ChalkColor;
  onChalkColorChange: (color: ChalkColor) => void;
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CHALK_COLORS: { color: ChalkColor; label: string; bg: string }[] = [
  { color: "white", label: "White", bg: "bg-white" },
  { color: "yellow", label: "Yellow", bg: "bg-yellow-200" },
  { color: "pink", label: "Pink", bg: "bg-pink-200" },
  { color: "blue", label: "Blue", bg: "bg-blue-300" },
  { color: "orange", label: "Orange", bg: "bg-orange-400" },
  { color: "green", label: "Green", bg: "bg-green-300" },
  { color: "red", label: "Red", bg: "bg-red-400" },
  { color: "purple", label: "Purple", bg: "bg-purple-300" },
];

export function Toolbar({
  chalkColor,
  onChalkColorChange,
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  showGrid,
  onToggleGrid,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {/* Tap zone when toolbar is hidden */}
      {!isVisible && (
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-10"
          onClick={() => setIsVisible(true)}
        />
      )}

      {/* Toolbar */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 z-20 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm px-4 py-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/90 backdrop-blur rounded-2xl shadow-2xl p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Chalk Color Palette */}
                <div className="flex items-center gap-2 bg-slate-700/50 rounded-xl px-3 py-2">
                  <Pencil className="w-5 h-5 text-slate-300 shrink-0" />
                  <div className="flex gap-2 flex-wrap">
                    {CHALK_COLORS.map(({ color, label, bg }) => (
                      <button
                        key={color}
                        onClick={() => {
                          onChalkColorChange(color);
                          onToolChange("chalk");
                        }}
                        title={label}
                        className={`relative w-10 h-10 rounded-lg transition-all ${
                          chalkColor === color && tool === "chalk"
                            ? "scale-110 ring-4 ring-white/50"
                            : "hover:scale-105"
                        }`}
                      >
                        <div
                          className={`w-full h-full ${bg} rounded-lg shadow-lg`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-white/40 to-transparent rounded-lg" />
                        </div>
                        {chalkColor === color && tool === "chalk" && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eraser */}
                <button
                  onClick={() => onToolChange("eraser")}
                  title="Eraser"
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    tool === "eraser"
                      ? "bg-orange-500 text-white scale-105 shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  <Eraser className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Eraser</span>
                </button>

                {/* Undo / Redo */}
                <div className="flex gap-2 bg-slate-700/50 rounded-xl p-2">
                  <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo"
                    className={`p-3 rounded-lg transition-all ${
                      canUndo
                        ? "hover:bg-slate-600 text-slate-300"
                        : "text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Undo className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo"
                    className={`p-3 rounded-lg transition-all ${
                      canRedo
                        ? "hover:bg-slate-600 text-slate-300"
                        : "text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Redo className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid Toggle */}
                <button
                  onClick={onToggleGrid}
                  title="Toggle Grid"
                  className={`p-3 rounded-xl transition-all ${
                    showGrid
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>

                {/* Page Navigation */}
                <div className="flex items-center gap-2 bg-slate-700/50 rounded-xl px-3 py-2">
                  <Layers className="w-5 h-5 text-slate-300" />
                  <button
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    title="Previous Board"
                    className={`p-2 rounded-lg transition-all ${
                      currentPage > 1
                        ? "hover:bg-slate-600 text-slate-300"
                        : "text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-slate-300 font-medium min-w-[3rem] text-center text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={onNextPage}
                    title="Next Board"
                    className="p-2 rounded-lg hover:bg-slate-600 text-slate-300 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear */}
                <button
                  onClick={() => {
                    if (confirm("Clear the entire board? This cannot be undone.")) {
                      onClear();
                    }
                  }}
                  title="Clear Board"
                  className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Save */}
                <button
                  onClick={onSave}
                  title="Save Board as Image"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Save</span>
                </button>
              </div>
            </div>

            {/* Hide button */}
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setIsVisible(false)}
                className="px-6 py-2 bg-slate-800/70 text-slate-300 rounded-full hover:bg-slate-700/70 transition-all text-sm font-medium"
              >
                Hide Toolbar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
