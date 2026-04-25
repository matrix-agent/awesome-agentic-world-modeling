import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = process.env.URL || 'http://127.0.0.1:4178/'
const OUT = process.env.OUT || './screenshots/intro'

const VIEWPORTS = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-600', width: 600, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

// Capture timeline: seconds after intro mount
const FRAMES_MS = [400, 1200, 2500, 4000, 6000]

async function captureIntro(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })

  // Clear the intro-seen session flag and reload so intro definitely plays
  await page.evaluate(() => sessionStorage.removeItem('intro-seen'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForSelector('.intro-shell', { timeout: 10000 })

  // Sample horizontal overflow + layout metrics across multiple frames
  const samples = []
  const startedAt = Date.now()
  for (const tMs of FRAMES_MS) {
    const delay = Math.max(0, tMs - (Date.now() - startedAt))
    if (delay > 0) await page.waitForTimeout(delay)
    const metrics = await page.evaluate(() => {
      const shell = document.querySelector('.intro-shell')
      const stage = document.querySelector('.intro-stage')
      const panel = document.querySelector('.intro-terminal-panel')
      const skip = document.querySelector('.intro-skip')
      const body = document.body
      const overflow = body.scrollWidth > window.innerWidth + 1
      const r = (el) => el ? (() => { const b = el.getBoundingClientRect(); return { l: Math.round(b.left), r: Math.round(b.right), t: Math.round(b.top), b: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) } })() : null
      const lines = Array.from(document.querySelectorAll('.intro-line')).length
      return {
        vw: innerWidth, vh: innerHeight,
        overflow,
        shellVisible: !!shell,
        stage: r(stage),
        panel: r(panel),
        skip: r(skip),
        skipFS: skip ? getComputedStyle(skip).fontSize : null,
        panelFS: panel ? getComputedStyle(panel).fontSize : null,
        introLineCount: lines,
      }
    })
    samples.push({ tMs, ...metrics })
    if (!metrics.shellVisible) break
    await page.screenshot({ path: `${OUT}/${vp.name}-intro-${String(tMs).padStart(5, '0')}ms.png`, fullPage: false })
  }

  await context.close()
  return samples
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  const report = {}
  for (const vp of VIEWPORTS) {
    console.log(`Capturing intro at ${vp.name}...`)
    report[vp.name] = await captureIntro(browser, vp)
  }
  await browser.close()
  // Compact summary
  const summary = Object.entries(report).map(([name, samples]) => ({
    viewport: name,
    anyOverflow: samples.some(s => s.overflow),
    shellEndedBy: (() => { const i = samples.findIndex(s => !s.shellVisible); return i === -1 ? 'still-running' : samples[i].tMs })(),
    skipFS: samples[0]?.skipFS,
    panelFS: samples[0]?.panelFS,
    maxLines: Math.max(...samples.map(s => s.introLineCount || 0)),
  }))
  console.log('\n=== SUMMARY ===')
  console.log(JSON.stringify(summary, null, 2))
}

main().catch(err => { console.error(err); process.exit(1) })
