import type { PetMood } from '@/game/customization-types';

function blank(width: number) { return '0'.repeat(width); }

function shiftRow(row: string, amount: number) {
  if (!amount) return row;
  const width = row.length;
  if (amount > 0) return `${'0'.repeat(amount)}${row}`.slice(0, width);
  return `${row}${'0'.repeat(-amount)}`.slice(-amount, width - amount);
}

function shiftGrid(grid: string[], x: number, y: number) {
  if (!grid.length) return grid;
  const width = grid[0].length;
  const horizontally = grid.map((row) => shiftRow(row, x));
  if (y > 0) return [...Array.from({ length:y }, () => blank(width)), ...horizontally].slice(0, grid.length);
  if (y < 0) return [...horizontally.slice(-y), ...Array.from({ length:-y }, () => blank(width))].slice(0, grid.length);
  return horizontally;
}

function breathe(grid: string[], phase: 1 | -1) {
  const middle = Math.floor(grid.length / 2);
  return grid.map((row, index) => {
    if (index < 2 || index > grid.length - 3) return row;
    const distance = Math.abs(index - middle);
    const amount = distance <= 2 ? phase : 0;
    return shiftRow(row, amount);
  });
}

function compact(grid: string[]) {
  if (grid.length < 6) return grid;
  const width = grid[0].length;
  const middle = grid.slice(2, -2);
  const compressed = middle.filter((_, index) => index % 4 !== 1);
  const output = [blank(width), blank(width), ...compressed];
  while (output.length < grid.length) output.push(blank(width));
  return output.slice(0, grid.length);
}

export type LooperFrameSequence = { frames: string[][]; frameMs: number };

/**
 * Lightweight actual pixel-frame animation used in addition to transform motion.
 * It deliberately derives frames from canonical sprite data so every Looper gets
 * consistent animation coverage without needing dozens of duplicated binary sheets.
 */
export function buildLooperFrameSequence(grid: string[], mood: PetMood): LooperFrameSequence {
  switch (mood) {
    case 'happy':
      return { frames:[grid, shiftGrid(grid,0,-1), grid], frameMs:220 };
    case 'excited':
      return { frames:[grid, shiftGrid(grid,-1,0), shiftGrid(grid,1,-1), grid], frameMs:130 };
    case 'worried':
      return { frames:[grid, shiftGrid(grid,-1,0), shiftGrid(grid,1,0), grid], frameMs:115 };
    case 'sleepy':
      return { frames:[grid, compact(grid), compact(grid), grid], frameMs:620 };
    case 'traveling':
      return { frames:[grid, shiftGrid(grid,-1,0), grid, shiftGrid(grid,1,0)], frameMs:190 };
    case 'celebrating':
      return { frames:[grid, shiftGrid(grid,0,-1), shiftGrid(grid,0,-2), shiftGrid(grid,0,-1), grid], frameMs:135 };
    case 'idle':
    default:
      return { frames:[grid, breathe(grid,-1), grid, breathe(grid,1)], frameMs:480 };
  }
}
