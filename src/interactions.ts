// ── Matrix-style number decode (stats cycle through random digits before settling) ──
export function initMatrixCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const el = e.target as HTMLElement
      const target = parseInt(el.dataset.target || '0')
      const suffix = el.dataset.suffix || ''
      const digits = String(target).length

      // Phase 1: rapid random cycling (800ms)
      let frame = 0
      const cycleFrames = 48
      const cycleId = setInterval(() => {
        let s = ''
        for (let d = 0; d < digits; d++) {
          s += Math.floor(Math.random() * 10)
        }
        el.textContent = s + suffix
        el.style.color = 'var(--green)'
        frame++
        if (frame >= cycleFrames) {
          clearInterval(cycleId)
          // Phase 2: settle to real value with easing
          el.style.color = ''
          const start = performance.now()
          function tick(now: number) {
            const t = Math.min((now - start) / 800, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            el.textContent = Math.round(ease * target) + suffix
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      }, 800 / cycleFrames)

      observer.unobserve(el)
    })
  }, { threshold: 0.3 })

  document.querySelectorAll<HTMLElement>('.stat-n').forEach((el) => observer.observe(el))
}

// ── 3D card tilt with glow ──
export function initCardTilt() {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`
      // Glow follows cursor
      card.style.boxShadow = `${x * 20}px ${y * 20}px 40px rgba(0,255,65,0.06)`
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = ''
      card.style.boxShadow = ''
      card.style.transition = 'all 0.4s ease'
      setTimeout(() => { card.style.transition = 'all 0.25s' }, 400)
    })
  })
}

// ── Scroll progress bar ──
export function initScrollProgress() {
  const bar = document.createElement('div')
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;z-index:200;
    background:var(--green);width:0%;pointer-events:none;
    box-shadow:0 0 8px var(--green);
  `
  document.body.appendChild(bar)

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100
    bar.style.width = `${pct}%`
  }, { passive: true })
}

// ── Magnetic buttons ──
export function initMagneticButtons() {
  document.querySelectorAll<HTMLElement>('#links-block a').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      btn.style.transform = `translateY(-2px) translate(${x * 0.2}px, ${y * 0.2}px)`
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = ''
      btn.style.transition = 'all 0.3s ease'
      setTimeout(() => { btn.style.transition = 'all 0.2s' }, 300)
    })
  })
}

// ── Chip click: Matrix-green flash + character scatter ──
export function initChipInteraction() {
  document.querySelectorAll<HTMLElement>('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      // Flash green
      chip.style.borderColor = 'var(--green)'
      chip.style.color = 'var(--green)'
      chip.style.boxShadow = '0 0 12px rgba(0,255,65,0.3)'

      // Spawn flying characters
      const rect = chip.getBoundingClientRect()
      const text = chip.textContent || ''
      for (let i = 0; i < Math.min(text.length, 8); i++) {
        const particle = document.createElement('span')
        particle.textContent = text[i]
        particle.style.cssText = `
          position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;
          font-family:var(--mono);font-size:12px;color:var(--green);
          pointer-events:none;z-index:999;
          transition:all 0.8s cubic-bezier(0.22,1,0.36,1);
          opacity:1;
        `
        document.body.appendChild(particle)
        requestAnimationFrame(() => {
          particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 120}px`
          particle.style.top = `${rect.top - 40 - Math.random() * 60}px`
          particle.style.opacity = '0'
        })
        setTimeout(() => particle.remove(), 900)
      }

      setTimeout(() => {
        chip.style.borderColor = ''
        chip.style.color = ''
        chip.style.boxShadow = ''
      }, 400)
    })
  })
}

// ── Staggered reveal for grids ──
export function initStaggeredReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const children = entry.target.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement
        child.style.opacity = '0'
        child.style.transform = 'translateY(16px)'
        child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            child.style.opacity = '1'
            child.style.transform = 'translateY(0)'
          })
        })
      }
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15 })

  document.querySelectorAll<HTMLElement>('#stats-grid, #reg-grid, #levels-container').forEach((el) => {
    observer.observe(el)
  })
}

// ── Line-staggered tint-and-settle (no scramble, no hide — guarantees clean final text) ──
export function typewriterReveal(pool: HTMLSpanElement[], onComplete?: () => void) {
  if (pool.length === 0) {
    onComplete?.()
    return
  }

  const stepMs = 35
  pool.forEach((span, i) => {
    span.style.transition = 'color 0.35s ease'
    setTimeout(() => {
      span.style.color = 'var(--green)'
      // Settle back to default body color shortly after
      setTimeout(() => {
        span.style.color = ''
      }, 200)
    }, 100 + i * stepMs)
  })

  const total = 100 + pool.length * stepMs + 250
  setTimeout(() => onComplete?.(), total)
}

