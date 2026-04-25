import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = process.env.URL || 'http://127.0.0.1:4178/'
const OUT = process.env.OUT || './screenshots/responsive'

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

async function dismissIntro(page) {
  // Skip the matrix-intro overlay if present
  await page.evaluate(() => {
    const skip = document.querySelector('.intro-skip')
    if (skip) skip.click()
    setTimeout(() => {
      const shell = document.querySelector('.intro-shell')
      if (shell) shell.remove()
    }, 200)
  }).catch(() => {})
  // Wait for either the intro to be removed or the abstract to be populated
  await page.waitForFunction(() => {
    const shell = document.querySelector('.intro-shell')
    if (shell) return false
    const wrap = document.getElementById('abstract-wrap')
    return wrap && wrap.querySelectorAll('span.pt-body').length > 0
  }, { timeout: 15000 })
  await page.waitForTimeout(2200)
}

// Scroll through the entire page slowly so IntersectionObserver-based reveals fire,
// then force-settle every animation before screenshot.
async function settleAllAnimations(page) {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight)
  const viewportHeight = await page.evaluate(() => window.innerHeight)
  const step = Math.floor(viewportHeight * 0.7)
  for (let y = 0; y <= totalHeight; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(180)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)

  // Force every reveal/staggered child to its final state, settle stat counters,
  // and clear any abstract green tint. Also hide the fixed scroll-progress bar
  // (it would otherwise streak across the full-page capture).
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
    document.querySelectorAll('#stats-grid > *, #reg-grid > *, #levels-container > *').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
      el.style.transition = ''
    })
    document.querySelectorAll('.stat-n').forEach((el) => {
      const target = el.dataset.target || '0'
      const suffix = el.dataset.suffix || ''
      el.textContent = target + suffix
      el.style.color = ''
    })
    document.querySelectorAll('#abstract-wrap span.pt-body').forEach((el) => {
      el.style.color = ''
      el.style.opacity = '1'
    })
    // Hide the fixed-position scroll progress bar so it doesn't streak the full-page image
    Array.from(document.body.children).forEach((el) => {
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' && cs.zIndex && parseInt(cs.zIndex) >= 100) {
        el.style.display = 'none'
      }
    })
  })
  await page.waitForTimeout(300)
}

async function fullPageScreenshot(page, path) {
  await page.screenshot({ path, fullPage: true })
}

async function captureViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })
  await dismissIntro(page)
  await settleAllAnimations(page)

  // Full-page screenshot (all sections, animations settled)
  await fullPageScreenshot(page, `${OUT}/${vp.name}-full.png`)

  // Targeted slices for easier review
  const sections = [
    { id: 'tag', name: 'top' },
    { id: 'abstract-label', name: 'abstract' },
    { id: 'tax-label', name: 'mid' },
    { id: 'cite-label', name: 'bottom' },
  ]
  for (const s of sections) {
    const el = await page.$(`#${s.id}`)
    if (!el) continue
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(220)
    const slicePath = `${OUT}/${vp.name}-${s.name}.png`
    await page.screenshot({ path: slicePath, fullPage: false })
  }

  // Snapshot key metrics: text overflow, sup positions
  const metrics = await page.evaluate(() => {
    const body = document.body
    const horizontalOverflow = body.scrollWidth > window.innerWidth + 1
    const links = Array.from(document.querySelectorAll('#links-block a')).map(a => {
      const r = a.getBoundingClientRect()
      return { text: a.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height), fs: getComputedStyle(a).fontSize }
    })
    const authorBlock = document.getElementById('authors-block')
    const authorEntries = Array.from(document.querySelectorAll('.author-entry')).slice(0, 4).map(el => ({
      text: el.textContent.trim(),
      fs: getComputedStyle(el).fontSize,
      lh: getComputedStyle(el).lineHeight,
      sup: el.querySelector('sup') ? getComputedStyle(el.querySelector('sup')).fontSize : null,
    }))
    const legend = document.querySelector('.author-legend')
    const affil = document.getElementById('affil-block')
    const cardTitle = document.querySelector('.card-title')
    const cardBody = document.querySelector('.card-body')
    return {
      horizontalOverflow,
      vw: window.innerWidth,
      pageScrollHeight: body.scrollHeight,
      links,
      authorBlock: authorBlock ? { fs: getComputedStyle(authorBlock).fontSize, lh: getComputedStyle(authorBlock).lineHeight } : null,
      authorEntries,
      legend: legend ? { fs: getComputedStyle(legend).fontSize, color: getComputedStyle(legend).color } : null,
      affil: affil ? { fs: getComputedStyle(affil).fontSize, lh: getComputedStyle(affil).lineHeight } : null,
      cardTitle: cardTitle ? { fs: getComputedStyle(cardTitle).fontSize } : null,
      cardBody: cardBody ? { fs: getComputedStyle(cardBody).fontSize, lh: getComputedStyle(cardBody).lineHeight } : null,
    }
  })

  await context.close()
  return metrics
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  const all = {}
  for (const vp of VIEWPORTS) {
    console.log(`Capturing ${vp.name}...`)
    all[vp.name] = await captureViewport(browser, vp)
  }
  await browser.close()
  console.log(JSON.stringify(all, null, 2))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
