import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// "350+" -> ['', 350, '+'];  "5–6" -> ['', 5, '–', 6, ''];  "$0" -> ['$', 0, '']
const split = (text) => String(text).split(/(\d+)/).map((part, i) => (i % 2 ? Number(part) : part))

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Counts every number inside `value` up from 0 the first time it scrolls into view,
 * then lights it up. The final text reserves the space, so nothing jumps around while counting.
 */
export default function CountUp({ value, duration = 1600, delay = 0, className }) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0))
  const started = useRef(progress === 1)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return
    let raf
    let timer
    const run = () => {
      started.current = true
      timer = setTimeout(() => {
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration)
          setProgress(easeOutCubic(t))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }, delay)
    }
    if (!('IntersectionObserver' in window)) {
      run()
      return () => clearTimeout(timer)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect()
          run()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [duration, delay])

  const parts = split(value)
  const shown = parts.map((p) => (typeof p === 'number' ? Math.round(p * progress) : p)).join('')
  const done = progress >= 1

  return (
    <strong ref={ref} className={`count-up ${done ? 'is-done' : ''} ${className || ''}`} aria-label={String(value)}>
      <span className="count-up-final" aria-hidden="true">{value}</span>
      <span className="count-up-live" aria-hidden="true">{done ? value : shown}</span>
    </strong>
  )
}
