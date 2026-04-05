# TeacherMathApp — Digital Blackboard

A browser-based digital blackboard built with React and TypeScript. Designed for teachers to write, draw, and present math content on a realistic chalkboard surface.

<img width="1448" height="668" alt="blackboard-1775425710904" src="https://github.com/user-attachments/assets/077c4ab5-26d5-4546-a151-b392fb35b281" />

## Features

- **Chalk drawing** — freehand drawing with a subtle chalk texture and dust effect
- **8 chalk colors** — white, yellow, pink, blue, orange, green, red, purple
- **Eraser tool** — erase specific areas without clearing the whole board
- **Undo / Redo** — full history navigation per board page
- **Grid overlay** — toggleable grid for aligned writing
- **Multi-page boards** — navigate between multiple board pages; each page preserves its content
- **Save to image** — exports the current board as a PNG file
- **Hide toolbar** — collapses the toolbar for a distraction-free full-screen view
- **Touch support** — works on tablets and touch screens

## Project Structure

```
src/
  App.tsx                        # Root component; manages board pages and canvas ref
  components/
    ChalkboardCanvas.tsx         # Canvas drawing logic, chalk/eraser rendering, history
    Toolbar.tsx                  # Floating bottom toolbar with all controls
```

## Tech Stack

- React 18 + TypeScript
- HTML5 Canvas API (direct 2D rendering)
- Tailwind CSS
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

## Usage

| Action | How |
|---|---|
| Draw | Click/touch and drag on the board |
| Change color | Tap a color swatch in the toolbar |
| Erase | Select the Eraser tool, then draw over the area |
| Undo / Redo | Use the arrow buttons in the toolbar |
| Toggle grid | Click the grid icon |
| New page | Click the right chevron (>) in the page navigator |
| Navigate pages | Use the left/right chevrons |
| Save board | Click the Download button — saves as PNG |
| Clear board | Click the trash icon (prompts for confirmation) |
| Hide toolbar | Click "Hide Toolbar"; tap the bottom edge to bring it back |
