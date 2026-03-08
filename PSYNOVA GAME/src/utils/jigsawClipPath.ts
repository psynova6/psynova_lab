/**
 * Jigsaw clip-path generator — produces realistic puzzle-piece outlines
 * with large, rounded knobs (tabs) and matching sockets (blanks).
 *
 * Each internal edge between two adjacent cells is assigned a direction:
 * true  = the piece on the "first" side (top/left) has a TAB (outward bump)
 *         and the piece on the "second" side (bottom/right) has a BLANK (inward notch).
 * false = reversed.
 *
 * Edge pieces have FLAT edges on the border sides.
 */

export type EdgeType = 'flat' | 'tab' | 'blank';

export interface EdgeMap {
    /** horizontal edges: hEdges[row][col]
     *  hEdges[r][c] = true → piece (r-1,c) gets TAB on bottom, piece (r,c) gets BLANK on top.
     *  Row 0 and row=gridSize are borders (flat). */
    hEdges: boolean[][];
    /** vertical edges: vEdges[row][col]
     *  vEdges[r][c] = true → piece (r,c-1) gets TAB on right, piece (r,c) gets BLANK on left.
     *  Col 0 and col=gridSize are borders (flat). */
    vEdges: boolean[][];
}

/**
 * Generate a deterministic edge map.
 */
export function generateEdgeMap(gridSize: number, seed: number = 42): EdgeMap {
    let s = seed;
    function nextBool(): boolean {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return (s >> 16) % 2 === 0;
    }

    const hEdges: boolean[][] = [];
    for (let r = 0; r <= gridSize; r++) {
        hEdges[r] = [];
        for (let c = 0; c < gridSize; c++) {
            hEdges[r][c] = (r === 0 || r === gridSize) ? false : nextBool();
        }
    }

    const vEdges: boolean[][] = [];
    for (let r = 0; r < gridSize; r++) {
        vEdges[r] = [];
        for (let c = 0; c <= gridSize; c++) {
            vEdges[r][c] = (c === 0 || c === gridSize) ? false : nextBool();
        }
    }

    return { hEdges, vEdges };
}

/**
 * Get the edge types for a specific piece.
 */
export function getPieceEdges(
    row: number,
    col: number,
    gridSize: number,
    edgeMap: EdgeMap,
): { top: EdgeType; right: EdgeType; bottom: EdgeType; left: EdgeType } {
    const top: EdgeType = row > 0 ? (edgeMap.hEdges[row][col] ? 'blank' : 'tab') : 'flat';
    const bottom: EdgeType = row < gridSize - 1 ? (edgeMap.hEdges[row + 1][col] ? 'tab' : 'blank') : 'flat';
    const left: EdgeType = col > 0 ? (edgeMap.vEdges[row][col] ? 'blank' : 'tab') : 'flat';
    const right: EdgeType = col < gridSize - 1 ? (edgeMap.vEdges[row][col + 1] ? 'tab' : 'blank') : 'flat';
    return { top, right, bottom, left };
}

/* ─────────────────────────────────────────────────────────────────────
 *  The tab extends outward by TAB_FRAC of the cell size.
 *  We make it BIG (0.20 = 20%) so pieces look like real jigsaws.
 * ───────────────────────────────────────────────────────────────────── */
const TAB_FRAC = 0.20;

/**
 * Total size multiplier: each side has TAB_FRAC padding.
 */
export const PIECE_SCALE = 1 + 2 * TAB_FRAC;

/**
 * Build an SVG clip-path for one jigsaw piece.
 *
 * Coordinate system (normalized):
 *   Cell body sits from (T, T) to (1+T, 1+T) where T = TAB_FRAC.
 *   Total viewBox is (0, 0) → (PIECE_SCALE, PIECE_SCALE).
 *
 * Tabs push into the padding area; blanks push into the cell body.
 */
export function buildJigsawPath(
    top: EdgeType,
    right: EdgeType,
    bottom: EdgeType,
    left: EdgeType,
): string {
    const T = TAB_FRAC;
    const x0 = T;           // left edge of cell
    const y0 = T;           // top edge of cell
    const x1 = 1 + T;       // right edge of cell
    const y1 = 1 + T;       // bottom edge of cell

    let d = `M ${x0} ${y0}`;

    // ── TOP EDGE (left → right) ──
    d += edgeHorizontal(top, x0, x1, y0, -1, T);

    // ── RIGHT EDGE (top → bottom) ──
    d += edgeVertical(right, y0, y1, x1, +1, T);

    // ── BOTTOM EDGE (right → left) ──
    d += edgeHorizontal(bottom, x1, x0, y1, +1, T);

    // ── LEFT EDGE (bottom → top) ──
    d += edgeVertical(left, y1, y0, x0, -1, T);

    return d + ' Z';
}

/* ──────────────────────────────────────────────────────────────────────
 *  Classic jigsaw knob shape using cubic Bézier curves.
 *
 *  The knob is drawn as a mushroom/bell shape:
 *   ─── neck ─── then a circular bulge ─── then neck back ───
 *
 *  `outDir` is +1 or -1, controlling which direction the tab sticks out.
 * ────────────────────────────────────────────────────────────────────── */

function edgeHorizontal(
    type: EdgeType,
    fromX: number,
    toX: number,
    y: number,
    outwardSign: number,   // -1 for top edge (tab goes up), +1 for bottom edge (tab goes down)
    T: number,
): string {
    if (type === 'flat') return ` L ${toX} ${y}`;

    const dir = type === 'tab' ? outwardSign : -outwardSign;
    const len = Math.abs(toX - fromX);         // always 1.0
    const sign = toX > fromX ? 1 : -1;         // direction of travel along X

    const mid = (fromX + toX) / 2;
    const neckW = len * 0.10;                   // half-width of the neck
    const knobW = len * 0.16;                   // half-width of the knob bulge
    const neckH = T * 0.35;                     // how far the neck extends
    const knobH = T * 0.95;                     // how far the full knob extends

    // Travel to neck start
    const nx0 = mid - sign * neckW;
    // Neck end (where bulge begins)
    const nx1 = mid + sign * neckW;

    return ` L ${mid - sign * knobW * 1.1} ${y}`
        // Neck: slight indent before knob
        + ` C ${nx0} ${y}, ${nx0} ${y + dir * neckH * 0.6}, ${nx0} ${y + dir * neckH}`
        // Knob left side: curve outward
        + ` C ${nx0 - sign * knobW * 0.1} ${y + dir * knobH * 0.9}, ${mid - sign * knobW} ${y + dir * knobH}, ${mid} ${y + dir * knobH}`
        // Knob right side: curve back
        + ` C ${mid + sign * knobW} ${y + dir * knobH}, ${nx1 + sign * knobW * 0.1} ${y + dir * knobH * 0.9}, ${nx1} ${y + dir * neckH}`
        // Neck: come back to edge
        + ` C ${nx1} ${y + dir * neckH * 0.6}, ${nx1} ${y}, ${mid + sign * knobW * 1.1} ${y}`
        + ` L ${toX} ${y}`;
}

function edgeVertical(
    type: EdgeType,
    fromY: number,
    toY: number,
    x: number,
    outwardSign: number,   // +1 for right edge (tab goes right), -1 for left edge (tab goes left)
    T: number,
): string {
    if (type === 'flat') return ` L ${x} ${toY}`;

    const dir = type === 'tab' ? outwardSign : -outwardSign;
    const len = Math.abs(toY - fromY);
    const sign = toY > fromY ? 1 : -1;

    const mid = (fromY + toY) / 2;
    const neckW = len * 0.10;
    const knobW = len * 0.16;
    const neckH = T * 0.35;
    const knobH = T * 0.95;

    const ny0 = mid - sign * neckW;
    const ny1 = mid + sign * neckW;

    return ` L ${x} ${mid - sign * knobW * 1.1}`
        + ` C ${x} ${ny0}, ${x + dir * neckH * 0.6} ${ny0}, ${x + dir * neckH} ${ny0}`
        + ` C ${x + dir * knobH * 0.9} ${ny0 - sign * knobW * 0.1}, ${x + dir * knobH} ${mid - sign * knobW}, ${x + dir * knobH} ${mid}`
        + ` C ${x + dir * knobH} ${mid + sign * knobW}, ${x + dir * knobH * 0.9} ${ny1 + sign * knobW * 0.1}, ${x + dir * neckH} ${ny1}`
        + ` C ${x + dir * neckH * 0.6} ${ny1}, ${x} ${ny1}, ${x} ${mid + sign * knobW * 1.1}`
        + ` L ${x} ${toY}`;
}

export const VIEWBOX = `0 0 ${PIECE_SCALE} ${PIECE_SCALE}`;
