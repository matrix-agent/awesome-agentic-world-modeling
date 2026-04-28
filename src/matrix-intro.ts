import { layoutText } from './pretext-render'

type ThemeName = 'dark' | 'light'
type RGB = [number, number, number]
type DeviceType = 'phone' | 'tablet' | 'desktop'

type ThemeSpec = {
  bg: string
  fg: string
  fgMuted: string
  fgDim: string
  green: string
  red: string
  prompt: string
  sha: string
  branch: string
  rainHead: RGB
  rainBody: RGB
  frameDim: number
  quoteDim: number
  textShadow: string
}

type StageLayout = {
  portrait: boolean
  width: number
  height: number
  shortSide: number
  longSide: number
  deviceType: DeviceType
  coarsePointer: boolean
}

type TerminalLine =
  | { kind: 'typed'; show: number; text: string; dur: number; prompt?: string }
  | { kind: 'line'; show: number; text: string; color?: keyof ThemeSpec; html?: boolean }
  | { kind: 'commit'; show: number; sha: string; scope: string; msg: string }

type TextSegment = {
  text: string
  color: string
}

type TerminalMetrics = {
  font: string
  fontSize: number
  lineHeight: number
  padX: number
  padY: number
  maxWidth: number
}

const TRAILER_DURATION = 40.0
// Internal scene/intensity constants are authored against a ~42s logical
// timeline (after redundant beats were trimmed). TIME_SCALE compresses real
// time so the trailer fits inside TRAILER_DURATION without rewriting every
// individual `show:` value below.
const LOGICAL_DURATION = 42.0
const TIME_SCALE = LOGICAL_DURATION / TRAILER_DURATION
const CARET = '\u2588'

declare global {
  interface Window {
    __INTRO_TIME_OVERRIDE?: number
  }
}

const THEMES: Record<ThemeName, ThemeSpec> = {
  dark: {
    bg: '#000000',
    fg: '#e8e6df',
    fgMuted: '#9a978c',
    fgDim: '#6a685f',
    green: '#5fd07a',
    red: '#d66a5c',
    prompt: '#8a8878',
    sha: '#d9a94a',
    branch: '#5fa8d6',
    rainHead: [230, 255, 230],
    rainBody: [95, 208, 122],
    frameDim: 0.72,
    quoteDim: 0.55,
    textShadow: '0 0 10px rgba(0,0,0,0.9)',
  },
  light: {
    bg: '#f4f1ea',
    fg: '#1a1814',
    fgMuted: '#56524a',
    fgDim: '#8a8478',
    green: '#2d7a3e',
    red: '#b04736',
    prompt: '#8a8478',
    sha: '#9a7a28',
    branch: '#2e6ea6',
    rainHead: [40, 30, 20],
    rainBody: [90, 130, 100],
    frameDim: 0.78,
    quoteDim: 0.6,
    textShadow: '0 0 10px rgba(255,255,255,0.7)',
  },
}

const ACT_1: TerminalLine[] = [
  { kind: 'typed', show: 0.0, text: 'opencode run "spin up a gym env and act for 1000 steps"', dur: 1.6 },
  { kind: 'line', show: 1.85, color: 'fgMuted', text: 'opencode v0.4.2  •  model: claude-sonnet-4  •  cwd: ~/research' },
  { kind: 'line', show: 2.15, color: 'green', text: '[opencode] launching python REPL…' },
  { kind: 'line', show: 2.55, color: 'fgMuted', text: 'Python 3.11.9 (main) [GCC 11.4.0] on linux' },
  { kind: 'typed', show: 2.85, prompt: '>>> ', text: 'import gym', dur: 0.5 },
  { kind: 'typed', show: 3.65, prompt: '>>> ', text: 'env = gym.make("Reality-v0")', dur: 1.15 },
  { kind: 'typed', show: 5.1, prompt: '>>> ', text: 'obs, info = env.reset(seed=42)', dur: 0.95 },
  { kind: 'typed', show: 6.3, prompt: '>>> ', text: 'for _ in range(1000):', dur: 0.75 },
  { kind: 'typed', show: 7.25, prompt: '... ', text: '    action = agent.act(obs)', dur: 0.85 },
  { kind: 'typed', show: 8.3, prompt: '... ', text: '    obs, r, term, trunc, info = env.step(action)', dur: 1.1 },
  { kind: 'line', show: 9.65, color: 'prompt', text: '... ' },
  { kind: 'line', show: 9.9, color: 'fgMuted', text: 'Traceback (most recent call last):' },
  { kind: 'line', show: 10.05, color: 'fgMuted', text: '  File "<stdin>", line 3, in <module>' },
  { kind: 'line', show: 10.2, color: 'fgMuted', text: '  File "agent/planner.py", line 47, in act' },
  { kind: 'line', show: 10.35, color: 'fgMuted', text: '    rollout = self.world_model.simulate(obs, action)' },
  { kind: 'line', show: 10.6, color: 'red', text: 'IndexError: no model of the world' },
  { kind: 'line', show: 11.1, color: 'prompt', text: '>>> ' },
]

const ACT_2: TerminalLine[] = [
  { kind: 'typed', show: 0.0, text: 'git clone git@github.com:research/world-modeling.git', dur: 1.15 },
  { kind: 'line', show: 1.35, color: 'fgMuted', text: "Cloning into 'world-modeling'..." },
  { kind: 'line', show: 1.55, color: 'fgMuted', text: 'remote: Enumerating objects: 4812, done.' },
  { kind: 'line', show: 1.72, color: 'fgMuted', text: 'Receiving objects: 100% (4812/4812), 184.3 MiB | 42.1 MiB/s' },
  { kind: 'line', show: 1.9, color: 'fgMuted', text: 'Resolving deltas: 100% (3104/3104), done.' },
  { kind: 'line', show: 2.15, text: ' ' },
  { kind: 'typed', show: 2.35, text: 'cd world-modeling && git log --oneline --grep="world model"', dur: 1.3 },
  { kind: 'line', show: 3.85, text: ' ' },
  { kind: 'commit', show: 4.15, sha: 'a1b2c3f', scope: 'JEPA', msg: 'embeddings predict masked futures' },
  { kind: 'commit', show: 4.5, sha: 'b2c3d4a', scope: 'LLM', msg: 'simulates entire environments' },
  { kind: 'commit', show: 4.85, sha: 'c3d4e5b', scope: 'Video-Gen', msg: 'hallucinates coherent physics' },
  { kind: 'commit', show: 5.2, sha: 'd4e5f6c', scope: 'SLAM', msg: 'geometry grounds perception' },
  { kind: 'commit', show: 5.55, sha: 'e5f6a7d', scope: '3DGS', msg: 'scene from observation' },
  { kind: 'commit', show: 5.9, sha: 'f6a7b8e', scope: 'Robotics', msg: 'learned dynamics for control' },
  { kind: 'line', show: 6.55, text: ' ' },
  { kind: 'typed', show: 6.75, text: 'git merge a1b2c3f b2c3d4a c3d4e5b d4e5f6c e5f6a7d f6a7b8e', dur: 1.8 },
  { kind: 'line', show: 8.75, color: 'fgMuted', text: 'Auto-merging src/world_model.py' },
  { kind: 'line', show: 9.0, color: 'red', text: 'CONFLICT (content): Merge conflict in src/world_model.py' },
  { kind: 'line', show: 9.25, color: 'red', text: 'CONFLICT (semantic): six models, one reality' },
  { kind: 'line', show: 9.55, color: 'prompt', text: '$ ' },
]

const ACT_3: TerminalLine[] = [
  { kind: 'typed', show: 0.0, prompt: '>>> ', text: 'env.add_world(Physical)', dur: 0.75 },
  { kind: 'line', show: 0.95, color: 'fgMuted', text: '✓ registered axis 0: bodies, forces, geometry' },
  { kind: 'typed', show: 1.55, prompt: '>>> ', text: 'env.add_world(Digital)', dur: 0.7 },
  { kind: 'line', show: 2.45, color: 'fgMuted', text: '✓ registered axis 1: code, protocols, interfaces' },
  { kind: 'typed', show: 3.05, prompt: '>>> ', text: 'env.add_world(Social)', dur: 0.7 },
  { kind: 'line', show: 3.95, color: 'fgMuted', text: '✓ registered axis 2: agents, norms, intent' },
  { kind: 'typed', show: 4.55, prompt: '>>> ', text: 'env.add_world(Scientific)', dur: 0.8 },
  { kind: 'line', show: 5.55, color: 'fgMuted', text: '✓ registered axis 3: laws, hypotheses, causal graphs' },
  { kind: 'line', show: 6.25, text: ' ' },
  { kind: 'typed', show: 6.45, prompt: '>>> ', text: 'env.step(action)', dur: 0.9 },
  { kind: 'line', show: 7.55, color: 'green', text: '# OK  — reward = +1' },
  { kind: 'line', show: 8.0, color: 'prompt', text: '>>> ' },
]

const PUSH_SCENE: TerminalLine[] = [
  {
    kind: 'typed',
    show: 0.0,
    text: "git commit -am 'Agentic World Modeling:\n   Foundations, Capabilities, Laws, and Beyond'",
    dur: 2.2,
  },
  { kind: 'line', show: 2.55, text: ' ' },
  { kind: 'typed', show: 2.75, text: 'git push origin main', dur: 0.75 },
  { kind: 'line', show: 3.75, text: ' ' },
  { kind: 'typed', show: 3.95, text: 'opencode run "audit the paper before submission"', dur: 1.6 },
  { kind: 'line', show: 5.7, color: 'fgMuted', text: '[opencode] reading paper.pdf  •  30 pages, 423 refs' },
  { kind: 'line', show: 6.05, color: 'green', text: '[opencode] ✓ no broken citations, README in sync, ready to submit' },
  { kind: 'line', show: 6.45, color: 'prompt', text: '$ ' },
]

function makeEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (className) el.className = className
  return el
}

function currentTheme(): ThemeName {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function getStageLayout(): StageLayout {
  const width = Math.max(1, window.innerWidth)
  const height = Math.max(1, window.innerHeight)
  const shortSide = Math.min(width, height)
  const longSide = Math.max(width, height)
  const portrait = height > width
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const deviceType = classifyDevice(shortSide, longSide, coarsePointer)
  return {
    portrait,
    width,
    height,
    shortSide,
    longSide,
    deviceType,
    coarsePointer,
  }
}

function applyStageLayout(stage: HTMLElement, layout: StageLayout) {
  stage.classList.toggle('intro-portrait', layout.portrait)
  stage.style.width = `${layout.width}px`
  stage.style.height = `${layout.height}px`
  stage.style.transform = 'none'
}

function classifyDevice(shortSide: number, longSide: number, coarsePointer: boolean): DeviceType {
  if (shortSide < 600 || (coarsePointer && shortSide < 700)) return 'phone'
  if (!coarsePointer && longSide >= 1024 && shortSide >= 700) return 'desktop'
  if (shortSide < 980 || (coarsePointer && longSide <= 1366)) return 'tablet'
  return 'desktop'
}

function viewportScale(layout: StageLayout): number {
  const designWidth = layout.portrait ? 1080 : 1920
  const designHeight = layout.portrait ? 1920 : 1080
  return Math.min(layout.width / designWidth, layout.height / designHeight)
}

function applySkipLayout(hint: HTMLElement, layout: StageLayout) {
  const size = getSkipMetrics(layout)
  hint.style.left = `calc(${size.inset}px + env(safe-area-inset-left))`
  hint.style.bottom = `calc(${size.inset}px + env(safe-area-inset-bottom))`
  hint.style.maxWidth = `calc(100vw - ${size.inset * 2}px - env(safe-area-inset-left) - env(safe-area-inset-right))`
  hint.style.setProperty('--intro-skip-font-size', `${size.fontSize}px`)
  hint.style.setProperty('--intro-skip-icon-size', `${size.iconSize}px`)
  hint.style.setProperty('--intro-skip-gap', `${size.gap}px`)
  hint.style.setProperty('--intro-skip-pad-y', `${size.padY}px`)
  hint.style.setProperty('--intro-skip-pad-x', `${size.padX}px`)
  hint.style.setProperty('--intro-skip-min-size', `${size.minSize}px`)
  hint.style.setProperty('--intro-skip-radius', `${size.radius}px`)
}

function getSkipMetrics(layout: StageLayout) {
  const diagonal = Math.hypot(layout.width, layout.height)
  // Single smooth diagonal-based scaling — guarantees the skip size is monotonic
  // in viewport area so growing height (or width) never makes the skip smaller.
  const minDiagonal = 600   // small phone
  const maxDiagonal = 1700  // ~1440x900 desktop
  const minFont = 10
  const maxFont = 18
  const t = clamp((diagonal - minDiagonal) / (maxDiagonal - minDiagonal), 0, 1)
  const fontSize = minFont + t * (maxFont - minFont)
  // Hit-area floor: monotonically grows with viewport diagonal.
  const minSize = clamp(36 + t * 12, 36, 48)
  const padY = clamp(fontSize * 0.54, 6, 10)
  const padX = clamp(fontSize * (layout.deviceType === 'phone' ? 1.08 : 1.18), 11, 20)
  return {
    fontSize,
    iconSize: clamp(fontSize * 1.16, 13, 20),
    gap: clamp(fontSize * 0.42, 5, 8),
    padY,
    padX,
    minSize,
    radius: minSize / 2,
    inset: layout.deviceType === 'phone'
      ? clamp(layout.shortSide * 0.04, 12, 18)
      : layout.deviceType === 'tablet'
        ? clamp(layout.shortSide * 0.035, 18, 28)
        : clamp(layout.shortSide * 0.028, 22, 34),
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3)
}

function easeInCubic(value: number): number {
  return value * value * value
}

function easeInOutCubic(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function interpolate(xs: readonly number[], ys: readonly number[], x: number): number {
  if (x <= xs[0]) return ys[0]
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]) {
      const span = xs[i] - xs[i - 1]
      const k = span === 0 ? 1 : clamp((x - xs[i - 1]) / span, 0, 1)
      const eased = easeInOutCubic(k)
      return ys[i - 1] + (ys[i] - ys[i - 1]) * eased
    }
  }
  return ys[ys.length - 1]
}

const monoAdvanceCache = new Map<string, number>()

function monoAdvance(font: string, lineHeight: number): number {
  const cached = monoAdvanceCache.get(font)
  if (cached) return cached
  const probe = layoutText('0000000000', font, 100000, lineHeight, 0, 0, { whiteSpace: 'pre-wrap' })
  const width = (probe[0]?.width ?? 100) / 10
  monoAdvanceCache.set(font, width)
  return width
}

function terminalText(line: TerminalLine): string {
  if (line.kind === 'commit') return `${line.sha} (${line.scope}) ${line.msg}`
  if (line.kind === 'typed') return `${line.prompt ?? '$ '}${line.text}`
  return line.text
}

function layoutPhysicalLines(
  source: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  x: number,
  y: number,
) {
  const rows: { text: string; x: number; y: number; width: number }[] = []
  const spaceWidth = monoAdvance(font, lineHeight)
  let cursorY = y

  for (const rawPart of (source || ' ').split('\n')) {
    const leading = rawPart.match(/^ */)?.[0].length ?? 0
    const content = rawPart.slice(leading) || ' '
    const indent = leading * spaceWidth
    const laidOut = layoutText(
      content,
      font,
      Math.max(1, maxWidth - indent),
      lineHeight,
      x + indent,
      cursorY,
      { whiteSpace: 'pre-wrap' },
    )
    rows.push(...laidOut)
    cursorY += Math.max(1, laidOut.length) * lineHeight
  }

  return {
    rows,
    height: Math.max(lineHeight, cursorY - y),
  }
}

function measureTerminalLayout(lines: readonly TerminalLine[], metrics: TerminalMetrics): { rows: number; maxRowWidth: number } {
  return lines.reduce((total, line) => {
    const measured = layoutPhysicalLines(terminalText(line), metrics.font, metrics.maxWidth, metrics.lineHeight, 0, 0)
    return {
      rows: total.rows + Math.max(1, measured.height / metrics.lineHeight),
      maxRowWidth: Math.max(total.maxRowWidth, ...measured.rows.map((row) => row.width)),
    }
  }, { rows: 0, maxRowWidth: 0 })
}

function getTerminalMetrics(layout: StageLayout, lines: readonly TerminalLine[], fontSize: number): TerminalMetrics {
  const baseFontSize = getTerminalBaseFontSize(layout, fontSize)
  const basePadX = getTerminalPadX(layout)
  const basePadY = getTerminalPadY(layout)
  let scale = 1
  let metrics!: TerminalMetrics

  for (let i = 0; i < 4; i++) {
    const minFontSize = getTerminalMinFontSize(layout)
    const minPadX = layout.deviceType === 'phone' ? 10 : layout.deviceType === 'tablet' ? 18 : 28
    const currentFontSize = Math.max(minFontSize, baseFontSize * scale)
    const lineHeight = currentFontSize * 1.55
    const padX = Math.max(minPadX, basePadX * scale)
    const padY = Math.max(layout.deviceType === 'phone' ? 14 : 18, basePadY * scale)
    const font = `${currentFontSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
    metrics = {
      font,
      fontSize: currentFontSize,
      lineHeight,
      padX,
      padY,
      maxWidth: Math.max(1, layout.width - padX * 2),
    }
    const measured = measureTerminalLayout(lines, metrics)
    const neededHeight = padY * 2 + measured.rows * lineHeight
    const availableHeight = Math.max(1, layout.height - 24)
    const availableWidth = Math.max(1, layout.width - padX * 2)
    const heightScale = neededHeight <= availableHeight ? 1 : (availableHeight / neededHeight) * 0.98
    const widthScale = measured.maxRowWidth <= availableWidth ? 1 : (availableWidth / measured.maxRowWidth) * 0.98
    const nextScale = Math.min(heightScale, widthScale)
    if (nextScale >= 0.999) break
    scale = Math.max(layout.deviceType === 'phone' ? 0.58 : layout.deviceType === 'tablet' ? 0.66 : 0.72, scale * nextScale)
  }

  return metrics
}

function getTerminalBaseFontSize(layout: StageLayout, sceneFontSize: number): number {
  const sceneScale = sceneFontSize / 28
  if (layout.deviceType === 'phone') {
    const progress = clamp((layout.shortSide - 320) / 180, 0, 1)
    const landscapeScale = layout.portrait ? 1 : 0.92
    return (12.5 + progress * 4.5) * sceneScale * landscapeScale
  }
  if (layout.deviceType === 'tablet') {
    const progress = clamp((layout.shortSide - 600) / 300, 0, 1)
    const portraitBoost = layout.portrait ? 1.06 : 0.96
    return (18 + progress * 6) * sceneScale * portraitBoost
  }
  const progress = clamp((Math.min(layout.width, 1920) - 1024) / 896, 0, 1)
  return (20 + progress * 8) * sceneScale
}

function getTerminalMinFontSize(layout: StageLayout): number {
  if (layout.deviceType === 'phone') return layout.portrait ? 10.5 : 9
  if (layout.deviceType === 'tablet') return 13
  return 15
}

function getTerminalPadX(layout: StageLayout): number {
  if (layout.deviceType === 'phone') return clamp(layout.width * 0.048, 14, 28)
  if (layout.deviceType === 'tablet') return clamp(layout.width * 0.06, 34, 72)
  return clamp(layout.width * 0.058, 68, 118)
}

function getTerminalPadY(layout: StageLayout): number {
  if (layout.deviceType === 'phone') return clamp(layout.height * 0.044, 18, 42)
  if (layout.deviceType === 'tablet') return clamp(layout.height * 0.058, 42, 74)
  return clamp(layout.height * 0.08, 64, 96)
}

function intensityAt(t: number): number {
  return interpolate(
    [0, 1.0, 9.7, 10.5, 14.4, 14.7, 23.5, 24.1, 27.3, 27.5, 35.4, 36.0, 41.0],
    [0.0, 0.12, 0.28, 0.85, 0.85, 0.25, 0.32, 0.88, 0.88, 0.3, 0.32, 0.55, 0.55],
    t,
  )
}

function buildIntroShell() {
  const overlay = makeEl('div', 'intro-shell')
  overlay.id = 'matrix-intro'

  const rain = makeEl('canvas', 'intro-rain-canvas') as HTMLCanvasElement
  const stage = makeEl('main', 'intro-stage')
  const sceneHost = makeEl('div', 'intro-scene-host')
  const hint = makeEl('button', 'intro-skip')
  hint.type = 'button'
  hint.setAttribute('aria-label', 'Skip intro')
  hint.innerHTML = `
    <svg class="intro-skip-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 4l10 8-10 8V4z"></path>
      <path d="M19 5v14"></path>
    </svg>
    <span class="intro-skip-label">skip</span>
  `

  stage.append(rain, sceneHost)
  overlay.append(stage, hint)
  document.body.classList.add('intro-active')
  document.body.style.overflow = 'hidden'

  return { overlay, rain, stage, sceneHost, hint }
}

export function initMatrixIntro(onComplete: () => void) {
  if (sessionStorage.getItem('intro-seen')) {
    onComplete()
    return
  }

  const shell = buildIntroShell()
  document.body.appendChild(shell.overlay)
  startWatchMode(shell, onComplete)
}

function startWatchMode(
  shell: ReturnType<typeof buildIntroShell>,
  onComplete: () => void,
) {
  const { overlay, rain, stage, sceneHost, hint } = shell
  const matrix = initStandaloneRain(rain)
  const startedAt = performance.now()
  let dismissed = false
  let raf = 0
  let lastRendered = ''
  let lastLayoutKey = ''

  function dismiss() {
    if (dismissed) return
    dismissed = true
    cancelAnimationFrame(raf)
    matrix.destroy()
    window.removeEventListener('keydown', keyHandler)
    hint.removeEventListener('click', dismiss)
    hint.removeEventListener('pointerdown', dismiss)
    sessionStorage.setItem('intro-seen', '1')
    overlay.classList.add('intro-exit')
    setTimeout(() => {
      document.body.style.overflow = ''
      document.body.classList.remove('intro-active')
      overlay.remove()
      onComplete()
    }, 520)
  }

  function keyHandler(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.code === 'Escape') {
      e.preventDefault()
      dismiss()
    }
  }

  function tick(now: number) {
    if (dismissed) return
    const t = typeof window.__INTRO_TIME_OVERRIDE === 'number'
      ? window.__INTRO_TIME_OVERRIDE
      : (now - startedAt) / 1000
    const theme = THEMES[currentTheme()]
    const layout = getStageLayout()
    const layoutKey = `${layout.width}x${layout.height}:${layout.deviceType}`
    if (layoutKey !== lastLayoutKey) {
      applyStageLayout(stage, layout)
      applySkipLayout(hint, layout)
      lastLayoutKey = layoutKey
    }
    overlay.style.background = theme.bg
    const logicalT = t * TIME_SCALE
    matrix.draw(logicalT, theme, layout)

    const rendered = renderScene(logicalT, theme, layout)
    if (rendered !== lastRendered) {
      sceneHost.innerHTML = rendered
      lastRendered = rendered
    }

    if (t >= TRAILER_DURATION) {
      dismiss()
      return
    }
    raf = requestAnimationFrame(tick)
  }

  window.addEventListener('keydown', keyHandler)
  hint.addEventListener('click', dismiss)
  hint.addEventListener('pointerdown', dismiss)
  hint.style.opacity = '1'
  raf = requestAnimationFrame(tick)
}

function renderScene(t: number, theme: ThemeSpec, layout: StageLayout): string {
  // Logical timeline ≈ 42s (compressed to TRAILER_DURATION wall-clock seconds
  // by the TIME_SCALE factor in tick()). Windows touch/overlap so no gap falls
  // through to the ACT_1 default (which would re-show the IndexError line).
  if (t >= 35.4) return renderTerminal(PUSH_SCENE, t - 35.4, theme, layout, 28)
  if (t >= 27.4 && t < 35.6) return renderTerminal(ACT_3, t - 27.4, theme, layout, 30)
  if (t >= 24.1 && t < 27.6) return renderQuote(['Something', 'must unite', 'these worlds.'], t - 24.1, 3.5, theme, layout)
  if (t >= 14.5 && t < 24.3) return renderTerminal(ACT_2, t - 14.5, theme, layout, 26)
  if (t >= 11.2 && t < 14.7) return renderQuote(['Something', 'is missing', 'from the agent.'], t - 11.2, 3.5, theme, layout)
  if (t < 11.4) return renderTerminal(ACT_1, t, theme, layout, 28)
  return ''
}

function renderTerminal(
  lines: readonly TerminalLine[],
  localTime: number,
  theme: ThemeSpec,
  layout: StageLayout,
  fontSize: number,
): string {
  const [r, g, b] = hexToRgb(theme.bg)
  const metrics = getTerminalMetrics(layout, lines, fontSize)
  const caretLineIndex = lines.reduce((latest, line, index) => {
    return line.kind === 'typed' && localTime >= line.show ? index : latest
  }, -1)
  let y = metrics.padY
  const rows = lines.map((line, index) => {
    const rendered = renderTerminalLine(line, localTime, theme, index === caretLineIndex, metrics, metrics.padX, y)
    y += rendered.height
    return rendered.html
  }).join('')
  return `
    <section class="intro-scene intro-terminal" style="background:rgba(${r},${g},${b},${theme.frameDim});">
      <div class="intro-terminal-panel" style="font-size:${metrics.fontSize}px;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:${theme.fg};text-shadow:${theme.textShadow};">
        ${rows}
      </div>
    </section>
  `
}

function renderPretextLines(
  text: string,
  metrics: TerminalMetrics,
  x: number,
  y: number,
  color: string,
  opacity: number,
  extraClass = '',
  caretColor = '',
  segments?: readonly TextSegment[],
  reserveText = text,
): { html: string; height: number } {
  const source = text || ' '
  const visible = layoutPhysicalLines(source, metrics.font, metrics.maxWidth, metrics.lineHeight, x, y)
  const reserved = layoutPhysicalLines(reserveText || ' ', metrics.font, metrics.maxWidth, metrics.lineHeight, x, y)
  const html = visible.rows.map((line) => {
    const hasCaret = line.text.endsWith(CARET)
    const textContent = hasCaret ? line.text.slice(0, -1) : line.text
    const caret = hasCaret
      ? `<span class="intro-caret" style="background:${caretColor};"></span>`
      : ''
    const content = segments && visible.rows.length === 1
      ? segments.map((segment) => `<span style="color:${segment.color};">${escapeHtml(segment.text)}</span>`).join('')
      : escapeHtml(textContent)
    return `<span class="intro-line intro-pretext-line ${extraClass}" style="left:${line.x}px;top:${line.y}px;color:${color};opacity:${opacity};">${content}${caret}</span>`
  }).join('')
  return {
    html,
    height: reserved.height,
  }
}

function renderTerminalLine(
  line: TerminalLine,
  localTime: number,
  theme: ThemeSpec,
  showCaret: boolean,
  metrics: TerminalMetrics,
  x: number,
  y: number,
): { html: string; height: number } {
  const reserveText = terminalText(line)
  if (localTime < line.show) {
    return renderPretextLines(' ', metrics, x, y, theme.fg, 0, 'intro-hidden', '', undefined, reserveText)
  }
  const opacity = clamp((localTime - line.show) / 0.08, 0, 1)

  if (line.kind === 'commit') {
    const text = `${line.sha} (${line.scope}) ${line.msg}`
    return renderPretextLines(text, metrics, x, y, theme.fg, opacity, '', '', [
      { text: line.sha, color: theme.sha },
      { text: ' (', color: theme.fgMuted },
      { text: line.scope, color: theme.branch },
      { text: ') ', color: theme.fgMuted },
      { text: line.msg, color: theme.fg },
    ])
  }

  if (line.kind === 'typed') {
    const textTime = Math.max(0, localTime - line.show)
    const progress = clamp(textTime / line.dur, 0, 1)
    const typed = line.text.slice(0, Math.floor(progress * line.text.length))
    const caretOn = Math.floor(localTime * 2) % 2 === 0
    const prompt = line.prompt ?? '$ '
    const text = `${prompt}${typed}${showCaret ? CARET : ''}`
    return renderPretextLines(text, metrics, x, y, theme.fg, opacity, '', caretOn ? theme.fg : 'transparent', [
      { text: prompt, color: theme.prompt },
      { text: typed, color: theme.fg },
    ], `${prompt}${line.text}`)
  }

  const color = line.color ? String(theme[line.color]) : theme.fg
  return renderPretextLines(line.text, metrics, x, y, color, opacity, '', '', undefined, reserveText)
}

function renderQuote(
  lines: readonly string[],
  localTime: number,
  duration: number,
  theme: ThemeSpec,
  layout: StageLayout,
): string {
  const cardIn = easeOutCubic(clamp(localTime / 1.1, 0, 1))
  const cardOut = easeInCubic(clamp((duration - localTime) / 0.9, 0, 1))
  const opacity = Math.min(cardIn, cardOut)
  const ruleW = 220 * easeOutCubic(clamp(localTime / 1.4, 0, 1))
  const [r, g, b] = hexToRgb(theme.bg)
  const scale = viewportScale(layout)
  const fontSize = Math.max(28, (layout.portrait ? 86 : 56) * scale)
  const ruleMargin = Math.max(24, (layout.portrait ? 56 : 36) * scale)
  const lineHeight = fontSize * 1.15
  const font = `500 ${fontSize}px "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif`
  const maxWidth = Math.min(layout.width - 48, (layout.portrait ? 820 : 1100) * scale)
  const laidOut = lines.map((line) => {
    const lineLayout = layoutText(line, font, maxWidth, lineHeight)
    return lineLayout[0] ?? { text: line, x: 0, y: 0, width: 0 }
  })
  const totalHeight = lines.length * lineHeight + ruleMargin + 1
  const startY = (layout.height - totalHeight) / 2
  const rows = laidOut.map((line, i) => {
    const lineOp = easeOutCubic(clamp((localTime - (0.5 + i * 0.55)) / 0.7, 0, 1))
    const x = (layout.width - line.width) / 2
    const y = startY + i * lineHeight + (1 - lineOp) * 8
    return `<span class="intro-quote-line intro-pretext-line" style="left:${x}px;top:${y}px;font-size:${fontSize}px;font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:500;opacity:${lineOp};color:${theme.fg};text-shadow:${theme.textShadow};">${escapeHtml(line.text)}</span>`
  }).join('')
  const ruleY = startY + lines.length * lineHeight + ruleMargin

  return `
    <section class="intro-scene intro-quote" style="background:rgba(${r},${g},${b},${theme.quoteDim});opacity:${opacity};">
      ${rows}
      <div class="intro-quote-rule" style="left:${(layout.width - ruleW) / 2}px;top:${ruleY}px;width:${ruleW}px;background:${theme.fgDim};"></div>
    </section>
  `
}

function hexToRgb(hex: string): RGB {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

function initStandaloneRain(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { draw: () => undefined, destroy: () => undefined }
  const context = ctx

  const glyphs = makeGlyphs()
  const speedMul = 0.42
  let destroyed = false
  let w = 0
  let h = 0
  let fontSize = 22
  let layoutKey = ''
  let lastT = 0
  let frame = 0
  let drops: { y: number; speed: number; len: number; chars: string[] }[] = []

  function resize(layout: StageLayout) {
    w = layout.width
    h = layout.height
    canvas.width = w
    canvas.height = h
    context.setTransform(1, 0, 0, 1, 0, 0)
    fontSize = 22
    const cols = Math.ceil(w / fontSize)
    drops = Array.from({ length: cols }, () => {
      const len = 8 + Math.floor(Math.random() * 22)
      return {
        y: Math.random() * h,
        speed: 2.2 + Math.random() * 6.2,
        len,
        chars: Array.from({ length: len }, () => randGlyph(glyphs)),
      }
    })
    lastT = 0
  }

  function draw(t: number, theme: ThemeSpec, layout: StageLayout) {
    if (destroyed) return
    const nextLayoutKey = `${layout.width}x${layout.height}`
    if (!w || !h || nextLayoutKey !== layoutKey) {
      layoutKey = nextLayoutKey
      resize(layout)
    }
    const dt = Math.min(0.05, t - lastT >= 0 ? t - lastT : 1 / 60)
    lastT = t
    frame++

    const intensity = intensityAt(t)
    const [br, bg, bb] = hexToRgb(theme.bg)
    const trailFade = 0.06 + (1 - intensity) * 0.18
    context.fillStyle = `rgba(${br},${bg},${bb},${trailFade})`
    context.fillRect(0, 0, w, h)
    context.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`
    context.textBaseline = 'top'

    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i]
      drop.y += drop.speed * dt * 60 * speedMul
      if (frame % 3 === 0 && Math.random() < 0.12) {
        drop.chars[drop.chars.length - 1 - Math.floor(Math.random() * drop.chars.length)] = randGlyph(glyphs)
      }
      const x = i * fontSize
      for (let j = 0; j < drop.len; j++) {
        const y = drop.y - j * fontSize
        if (y < -fontSize || y > h) continue
        if (j === 0) {
          context.fillStyle = `rgba(${theme.rainHead[0]},${theme.rainHead[1]},${theme.rainHead[2]},${0.95 * intensity})`
        } else {
          const k = j / drop.len
          context.fillStyle = `rgba(${theme.rainBody[0]},${theme.rainBody[1]},${theme.rainBody[2]},${(1 - k) * 0.75 * intensity})`
        }
        context.fillText(drop.chars[j % drop.chars.length], x, y)
      }
      if (drop.y - drop.len * fontSize > h) {
        drop.y = -Math.random() * 300
        drop.speed = 2.2 + Math.random() * 6.2
        drop.len = 8 + Math.floor(Math.random() * 22)
        drop.chars = Array.from({ length: drop.len }, () => randGlyph(glyphs))
      }
    }
  }

  function destroy() {
    destroyed = true
  }

  return { draw, destroy }
}

function makeGlyphs(): string[] {
  const katakana: string[] = []
  for (let c = 0xff66; c <= 0xff9d; c++) katakana.push(String.fromCharCode(c))
  return [
    ...katakana,
    ...katakana,
    ...'0123456789'.split(''),
    ...'{}[]()<>/*+=;:.$#&|'.split(''),
  ]
}

function randGlyph(glyphs: readonly string[]): string {
  return glyphs[Math.floor(Math.random() * glyphs.length)]
}
