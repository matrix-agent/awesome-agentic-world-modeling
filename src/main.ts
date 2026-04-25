import './fonts'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { layoutText, syncSpans } from './pretext-render'
import {
  ABSTRACT,
  AFFILIATIONS,
  AUTHORS,
  BIBTEX,
  LEVELS,
  PAPER_TITLE,
  REGIMES,
  STATS,
} from './data'
import { typewriterReveal, initCardTilt, initScrollProgress, initMagneticButtons, initChipInteraction, initStaggeredReveal, initMatrixCounters } from './interactions'
import { initMatrixIntro } from './matrix-intro'

let abstractPool: HTMLSpanElement[] = []

const matrixCanvas = document.getElementById('matrix-canvas') as HTMLCanvasElement

// ── Init Matrix Rain Background ──
import { initMatrixRain } from './matrix-rain'
initMatrixRain(matrixCanvas)

// ── Theme (follows system color-scheme) ──
function initTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const applySystemTheme = () => {
    document.documentElement.setAttribute('data-theme', media.matches ? 'dark' : 'light')
    if (document.getElementById('title-wrap')?.childElementCount) {
      scheduleRender()
    }
  }

  applySystemTheme()
  if (!document.documentElement.dataset.systemThemeBound) {
    document.documentElement.dataset.systemThemeBound = '1'
    media.addEventListener('change', applySystemTheme)
  }
}

// ── Read CSS variable ──
function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function projectLeadIcon(className = ''): string {
  return `<svg class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>`
}

function renderStaticSections() {
  renderTitle()
  renderAuthors()
  renderAffiliations()
  renderStats()
  renderLevels()
  renderRegimes()
  const bibtex = document.getElementById('bibtex-content')
  if (bibtex) bibtex.textContent = BIBTEX
}

function renderTitle() {
  const container = document.getElementById('title-wrap')
  if (!container) return
  const [titleLead, titleRest = ''] = PAPER_TITLE.split(': ')
  const [titleMiddle, titleEnd = ''] = titleRest.split('Laws, ')
  container.innerHTML = `
    <span class="paper-title-main">${escapeHtml(titleLead)}:</span>
    <span class="paper-title-break paper-title-break-main" aria-hidden="true"></span>
    <span class="paper-title-middle">${escapeHtml(titleMiddle.trim())}</span>
    <span class="paper-title-break paper-title-break-mobile" aria-hidden="true"></span>
    <span class="paper-title-end">Laws, ${escapeHtml(titleEnd)}</span>
  `
}

function renderAuthors() {
  const container = document.getElementById('authors-block')
  if (!container) return
  const entries = AUTHORS.map((author) => {
    const markers = [
      author.aff.map(String).join(','),
      author.core ? '&dagger;' : '',
      author.senior ? '&sect;' : '',
      author.lead ? projectLeadIcon('author-project-lead-icon') : '',
    ].join('')
    return `<span class="author-entry"><span class="author-name">${escapeHtml(author.name)}</span><sup>${markers}</sup></span>`
  })
  // Keep the final two authors together so the last entry never wraps alone.
  const head = entries.slice(0, -2).join(' ')
  const tail = entries.slice(-2).join(' ')
  const authorHtml = `${head}${head ? ' ' : ''}<span class="author-pair">${tail}</span>`
  container.innerHTML = `
    ${authorHtml}
    <div class="author-legend mt-4">
      <span><span class="legend-symbol">&dagger;</span> Core Contributor</span>
      <span>${projectLeadIcon('legend-project-lead-icon')} Project Lead</span>
      <span><span class="legend-symbol">&sect;</span> Senior Author</span>
    </div>
  `
}

// Pretext-style row balance for inline-block authors. We simulate the natural
// wrap at a slightly smaller container width until the last row has at least
// `minLast` authors — the same binary-search-shrink idea pretext uses for text.
function balanceAuthorRows(minLast = 3) {
  const container = document.getElementById('authors-block')
  if (!container) return
  container.style.maxWidth = ''  // reset any prior override

  const entries = Array.from(container.querySelectorAll<HTMLElement>('.author-entry'))
  if (entries.length < 3) return

  const W = container.clientWidth
  const gap = parseFloat(getComputedStyle(entries[0]).marginRight) || 0
  const widths = entries.map((e) => e.getBoundingClientRect().width)

  const simulate = (maxW: number): number => {
    let rowN = 0, curW = 0, curN = 0
    for (const w of widths) {
      const next = curN === 0 ? w : curW + gap + w
      if (next > maxW) { rowN++; curW = w; curN = 1 }
      else { curW = next; curN++ }
    }
    if (curN > 0) { return curN } // last row's count
    return 0
  }

  if (simulate(W) >= minLast) return

  // Scan downward for a smaller W that leaves the last row with >= minLast entries
  for (let tryW = W - 4; tryW >= W * 0.7; tryW -= 4) {
    if (simulate(tryW) >= minLast) {
      container.style.maxWidth = `${tryW}px`
      return
    }
  }
}

function renderAffiliations() {
  const container = document.getElementById('affil-block')
  if (!container) return
  container.innerHTML = Object.entries(AFFILIATIONS)
    .map(([id, name]) => `<span class="affiliation-entry"><sup>${id}</sup>${escapeHtml(name)}</span>`)
    .join(' ')
}

function renderStats() {
  const container = document.getElementById('stats-grid')
  if (!container) return
  container.innerHTML = STATS.map((stat) => `
    <div class="card reveal stat-card" style="text-align:center;padding:32px 16px;cursor:default;">
      <div class="stat-n" data-target="${stat.value}" data-suffix="${escapeHtml(stat.suffix)}">0</div>
      <div class="stat-label">${escapeHtml(stat.label)}</div>
    </div>
  `).join('')
}

function renderLevels() {
  const container = document.getElementById('levels-container')
  if (!container) return
  container.innerHTML = LEVELS.map((level, index) => {
    const transition = index < LEVELS.length - 1
      ? renderLevelTransition(index === 0 ? 'compose' : 'revise', index === 0 ? 'var(--l2)' : 'var(--l3)')
      : ''
    return `
      <button type="button" class="card reveal level-card" style="border-left:3px solid var(--${escapeHtml(level.id)});">
        <div class="flex items-center flex-wrap gap-3 mb-3">
          <span class="level-tag" style="background:var(--${escapeHtml(level.id)}-bg);color:var(--${escapeHtml(level.id)});">${escapeHtml(level.tag)}</span>
          <span class="card-title">${escapeHtml(level.name)}</span>
        </div>
        <div class="card-body mb-4">${escapeHtml(level.desc)}</div>
        <div class="flex flex-wrap gap-2">
          ${level.systems.map((system) => `<span class="chip">${escapeHtml(system)}</span>`).join('')}
        </div>
      </button>
      ${transition}
    `
  }).join('')
  container.querySelectorAll<HTMLButtonElement>('.level-card').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('active'))
  })
}

function renderLevelTransition(label: string, color: string): string {
  return `
    <div class="level-transition" style="--level-transition-color:${color};" aria-label="${escapeHtml(label)} capability transition">
      <div class="level-transition-line"></div>
      <div class="level-transition-mark">
        <svg class="level-transition-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v12"></path>
          <path d="M7 12l5 5 5-5"></path>
        </svg>
        <span class="level-transition-label">${escapeHtml(label)}</span>
      </div>
      <div class="level-transition-line"></div>
    </div>
  `
}

function renderRegimes() {
  const container = document.getElementById('reg-grid')
  if (!container) return
  container.innerHTML = REGIMES.map((regime) => `
    <div class="card reveal regime-card" style="cursor:default;">
      <div class="regime-icon"><i class="${escapeHtml(regime.icon)}" aria-hidden="true"></i></div>
      <div class="card-title" style="margin-bottom:10px;">${escapeHtml(regime.title)}</div>
      <div class="card-body">${escapeHtml(regime.desc)}</div>
    </div>
  `).join('')
}

// ── Render everything ──
let rafId: number | null = null

function scheduleRender() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    render()
  })
}

function render() {
  // Use wrapper width (inside stage padding), not stage.clientWidth which includes padding
  const W = document.getElementById('title-wrap')!.clientWidth

  const textSec = cssVar('--text-sec')

  balanceAuthorRows()

  // ── Abstract (Pretext-laid-out within #abstract-wrap) ──
  // Fluid font size from 14px (narrow mobile) → 19px (desktop), interpolated
  // smoothly by container width — matches the rest of the page's clamp() scale.
  // Fluid scale by container width — mobile floor 16, desktop ceiling 19.
  const minW = 320, maxW = 896
  const minFs = 16, maxFs = 19
  const t = Math.max(0, Math.min(1, (W - minW) / (maxW - minW)))
  const fontSize = Math.round((minFs + t * (maxFs - minFs)) * 100) / 100
  const bodyLH = Math.round(fontSize * 2.05)

  // Reserve a small right margin so the last char of each line never sits flush
  // against the container edge (browsers can clip antialiasing pixels).
  const abstractWrap = document.getElementById('abstract-wrap')!
  const bodyFont = `400 ${fontSize}px "IBM Plex Mono"`
  const safeWidth = Math.max(0, W - 6)
  const abstractLines = layoutText(ABSTRACT, bodyFont, safeWidth, bodyLH, 0, 0, { balance: true })
  abstractWrap.style.height = `${abstractLines.length * bodyLH}px`
  abstractPool = syncSpans(abstractWrap, abstractLines, abstractPool, 'pt-body', bodyFont, textSec)

  // ── Cursor blink (positioned relative to abstract-wrap) ──
  const cursorEl = document.getElementById('cursor')!
  if (abstractLines.length > 0) {
    const lastLine = abstractLines[abstractLines.length - 1]
    cursorEl.style.position = 'absolute'
    cursorEl.style.left = `${lastLine.x + lastLine.width + 4}px`
    cursorEl.style.top = `${lastLine.y + 2}px`
  }
}

// ── Copy bibtex ──
function initCopy() {
  document.querySelector('.copy-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement
    navigator.clipboard.writeText(BIBTEX).then(() => {
      btn.textContent = 'Copied!'
      setTimeout(() => (btn.textContent = 'Copy'), 1500)
    })
  })
}

// ── Scroll reveal ──
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
    })
  }, { threshold: 0.08 })
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
}

// Init theme immediately (before intro, so toggle works during overlay)
initTheme()

// ── Init ──
function startPage() {
  // Reveal the stage (was hidden in HTML to prevent flash of paper info before intro)
  const stage = document.getElementById('stage')
  if (stage) stage.style.visibility = ''

  initTheme() // re-init for render scheduling
  renderStaticSections()
  render()
  initCopy()
  initReveal()

  // Interactive elements
  initScrollProgress()
  initCardTilt()
  initMagneticButtons()
  initChipInteraction()
  initStaggeredReveal()
  initMatrixCounters()

  // Re-render after layout is settled, THEN start typewriter
  // (must be in this order so typewriterReveal gets the final span references)
  requestAnimationFrame(() => {
    render()
    typewriterReveal(abstractPool, () => {
      const cursor = document.getElementById('cursor')
      if (cursor) cursor.style.display = 'inline-block'
    })
  })
}

document.fonts.ready.then(() => {
  initMatrixIntro(startPage)
})

window.addEventListener('resize', scheduleRender)
