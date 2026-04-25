import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments } from '@chenglou/pretext'

type WhiteSpaceMode = 'normal' | 'pre-wrap'

export interface RenderedLine {
  text: string
  x: number
  y: number
  width: number
}

// Cache prepared text by font+text key
const cache = new Map<string, PreparedTextWithSegments>()

function getPrepared(text: string, font: string, whiteSpace?: WhiteSpaceMode): PreparedTextWithSegments {
  const key = `${whiteSpace ?? 'normal'}::${font}::${text}`
  let prepared = cache.get(key)
  if (!prepared) {
    prepared = prepareWithSegments(text, font, whiteSpace ? { whiteSpace } : undefined)
    cache.set(key, prepared)
  }
  return prepared
}

/**
 * Lay out text using Pretext and render as absolutely-positioned spans.
 * This is the Pretext-native rendering approach: no CSS text flow, no canvas.
 * Pretext computes line breaks, we just position DOM elements.
 *
 * When `options.balance` is true, the function performs a binary search for the
 * smallest maxWidth that still produces the same line count as a greedy layout
 * at the full maxWidth. This avoids "orphan" last lines (a couple of words on
 * their own row) by tightening every line uniformly — analogous to the browser
 * `text-wrap: pretty` heuristic.
 */
export function layoutText(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  offsetX: number = 0,
  offsetY: number = 0,
  options: { whiteSpace?: WhiteSpaceMode; balance?: boolean; minLastLineRatio?: number } = {},
): RenderedLine[] {
  const prepared = getPrepared(text, font, options.whiteSpace)
  let lines = layoutWithLines(prepared, maxWidth, lineHeight).lines

  if (options.balance && lines.length > 1) {
    const minRatio = options.minLastLineRatio ?? 0.5
    const lastWidth = lines[lines.length - 1].width
    if (lastWidth < maxWidth * minRatio) {
      const target = lines.length
      let lo = Math.max(1, maxWidth * 0.5)
      let hi = maxWidth
      // Binary search: find the smallest width that still yields `target` lines
      for (let i = 0; i < 16 && hi - lo > 1; i++) {
        const mid = (lo + hi) / 2
        const trial = layoutWithLines(prepared, mid, lineHeight).lines
        if (trial.length <= target) {
          hi = mid
          lines = trial
        } else {
          lo = mid
        }
      }
    }
  }

  return lines.map((line, i) => ({
    text: line.text,
    x: offsetX,
    y: offsetY + i * lineHeight,
    width: line.width,
  }))
}

/**
 * Sync a pool of span elements with computed lines.
 * Reuses existing spans, creates/removes as needed.
 */
export function syncSpans(
  container: HTMLElement,
  lines: RenderedLine[],
  pool: HTMLSpanElement[],
  className: string,
  font: string,
  color: string,
): HTMLSpanElement[] {
  // Grow pool
  while (pool.length < lines.length) {
    const span = document.createElement('span')
    span.className = className
    span.style.position = 'absolute'
    span.style.whiteSpace = 'nowrap'
    span.style.font = font
    span.style.color = color
    span.style.margin = '0'
    span.style.padding = '0'
    container.appendChild(span)
    pool.push(span)
  }

  // Shrink pool
  while (pool.length > lines.length) {
    pool.pop()!.remove()
  }

  // Update positions, text, and font (font may change on viewport resize when
  // the caller uses a fluid font size — re-applying it keeps reused spans in
  // sync, otherwise they'd render at the prior viewport's size and overflow).
  for (let i = 0; i < lines.length; i++) {
    const span = pool[i]
    const line = lines[i]
    if (span.textContent !== line.text) span.textContent = line.text
    if (span.style.font !== font) span.style.font = font
    span.style.left = `${line.x}px`
    span.style.top = `${line.y}px`
    span.style.color = color
  }

  return pool
}

/**
 * Compute total height of rendered lines.
 */
export function totalHeight(lines: RenderedLine[], lineHeight: number): number {
  if (lines.length === 0) return 0
  return lines[lines.length - 1].y + lineHeight
}
