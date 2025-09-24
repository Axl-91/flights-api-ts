type Direction = {
  dr: number;
  dc: number;
};

// Take all values in the Chebyshev distance given
// Taking them into the order of:
// 1. Horizontal, 2. Vertical, 3. Diagonal
export function getChebyshevDistanceDirs(distance: number): Direction[] {
  const horizontal: Direction[] = [];
  const vertical: Direction[] = [];
  const diagonal: Direction[] = [];

  for (let dr = -distance; dr <= distance; dr++) {
    for (let dc = -distance; dc <= distance; dc++) {
      if (Math.abs(dr) !== distance && Math.abs(dc) !== distance) continue;

      if (dr === 0) {
        horizontal.push({ dr, dc });
      } else if (dc === 0) {
        vertical.push({ dr, dc });
      } else {
        diagonal.push({ dr, dc });
      }
    }
  }
  return [...horizontal, ...vertical, ...diagonal];
}
