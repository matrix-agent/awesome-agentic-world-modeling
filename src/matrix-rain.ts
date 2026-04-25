import { MATRIX_WORDS } from './data'

interface Column {
  x: number
  y: number
  speed: number
  chars: string[]
  opacity: number
}

let mouseX = -1
let mouseY = -1
const MOUSE_RADIUS = 200

function isDark(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    || (!document.documentElement.getAttribute('data-theme')
      && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

export function initMatrixRain(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  const FONT_SIZE = 14
  const COL_GAP = 26

  let columns: Column[] = []
  let animId: number
  let w = 0
  let h = 0

  function pickWord(): string {
    return MATRIX_WORDS[Math.floor(Math.random() * MATRIX_WORDS.length)]
  }

  function makeColumn(x: number, randomStart: boolean): Column {
    const word = pickWord()
    return {
      x,
      y: randomStart ? -Math.random() * h * 2 : -FONT_SIZE * word.length,
      speed: 0.25 + Math.random() * 0.8,
      chars: word.split(''),
      opacity: 0.03 + Math.random() * 0.06,
    }
  }

  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const numCols = Math.floor(w / COL_GAP)
    columns = []
    for (let i = 0; i < numCols; i++) {
      columns.push(makeColumn(i * COL_GAP + COL_GAP / 2, true))
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)
    ctx.font = `${FONT_SIZE}px "IBM Plex Mono", monospace`
    ctx.textAlign = 'center'

    const dark = isDark()
    // Dark: green matrix | Light: subtle cool grey/blue
    const r = dark ? 0 : 100
    const g = dark ? 255 : 140
    const b = dark ? 65 : 200
    const baseMultiplier = dark ? 1 : 0.6

    for (const col of columns) {
      for (let j = 0; j < col.chars.length; j++) {
        const cy = col.y + j * FONT_SIZE * 1.4
        if (cy < -FONT_SIZE || cy > h + FONT_SIZE) continue

        const isHead = j === col.chars.length - 1

        // Mouse proximity glow
        let mouseFactor = 1
        if (mouseX >= 0) {
          const dx = col.x - mouseX
          const dy = cy - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const proximity = 1 - dist / MOUSE_RADIUS
            mouseFactor = 1 + proximity * (dark ? 5 : 8)
          }
        }

        const baseOpacity = isHead
          ? col.opacity * 2.5
          : col.opacity * (1 - j / (col.chars.length * 1.5))

        const finalOpacity = Math.min(baseOpacity * mouseFactor * baseMultiplier, dark ? 0.6 : 0.4)

        if (finalOpacity < 0.01) continue

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`
        ctx.fillText(col.chars[j], col.x, cy)
      }

      col.y += col.speed

      if (col.y > h + col.chars.length * FONT_SIZE * 1.4) {
        Object.assign(col, makeColumn(col.x, false))
      }
    }

    animId = requestAnimationFrame(draw)
  }

  function handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(animId)
    } else {
      animId = requestAnimationFrame(draw)
    }
  }

  resize()
  draw()

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId)
    resize()
    draw()
  })

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  window.addEventListener('mouseleave', () => {
    mouseX = -1
    mouseY = -1
  })

  // Touch support for mobile
  window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0]
    if (touch) {
      mouseX = touch.clientX
      mouseY = touch.clientY
    }
  }, { passive: true })

  window.addEventListener('touchend', () => {
    mouseX = -1
    mouseY = -1
  })

  document.addEventListener('visibilitychange', handleVisibility)
}
