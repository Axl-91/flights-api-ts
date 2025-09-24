type Direction = {
  dr: number;
  dc: number;
};

export function getDirections(offset: number): Direction[] {
  const horizontal: Direction[] = [];
  const vertical: Direction[] = [];
  const diagonal: Direction[] = [];

  for (let dr = -offset; dr <= offset; dr++) {
    for (let dc = -offset; dc <= offset; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (Math.max(Math.abs(dr), Math.abs(dc)) === offset) {
        if (dr === 0) {
          horizontal.push({ dr, dc });
        } else if (dc === 0) {
          vertical.push({ dr, dc });
        } else {
          diagonal.push({ dr, dc });
        }
      }
    }
  }
  return [...horizontal, ...vertical, ...diagonal];
}
