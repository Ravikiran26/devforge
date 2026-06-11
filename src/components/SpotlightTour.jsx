import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { X } from 'lucide-react'

const PAD = 12

const STEPS = [
  {
    page: '/dashboard',
    selector: '[data-tour="welcome"]',
    title: 'Your weekly mission',
    body: "Every week has a focus — a specific project or skill. This banner tells you what to build this week. Read it first every morning.",
    placement: 'bottom',
  },
  {
    page: '/lessons',
    selector: '[data-tour="week-map"]',
    title: 'Start with lessons',
    body: "Each week has 5 lessons. Click Week 1 to open them. Read each one top to bottom — every lesson unlocks the next.",
    placement: 'bottom',
  },
  {
    page: '/tasks',
    selector: '[data-tour="kanban"]',
    title: 'Then build assignments',
    body: "Once you've finished a week's lessons, come here. Each card is one real feature to build. Click a card to read the full requirements.",
    placement: 'top',
  },
  {
    page: '/tasks',
    selector: '[data-tour="submit-hint"]',
    title: 'Submit your PR here',
    body: "Create a branch named after the ticket (e.g. rf-1-menu-schema), push your code, open a Pull Request on GitHub, then paste the PR URL inside the ticket. AI reviews your code in 60 seconds. Your mentor grades it within 24 hours.",
    placement: 'bottom',
  },
]

function getRect(selector) {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right }
}

const TOOLTIP_HEIGHT = 230

function Tooltip({ rect, step, stepIndex, total, onNext, onSkip, isLast, isPending }) {
  const { placement: preferredPlacement, title, body } = step
  const pad = PAD
  const holeTop    = rect.top - pad
  const holeLeft   = rect.left - pad
  const holeWidth  = rect.width + pad * 2
  const holeHeight = rect.height + pad * 2

  // Auto-flip to 'top' if tooltip would overflow the bottom of the viewport
  const wouldOverflowBottom = preferredPlacement === 'bottom' &&
    (holeTop + holeHeight + 14 + TOOLTIP_HEIGHT > window.innerHeight)
  const placement = wouldOverflowBottom ? 'top' : preferredPlacement

  const tooltipWidth = 320
  let tooltipStyle = { position: 'fixed', width: tooltipWidth, zIndex: 10001 }

  const centerLeft = Math.min(
    Math.max(holeLeft + holeWidth / 2 - tooltipWidth / 2, 12),
    window.innerWidth - tooltipWidth - 12,
  )

  if (placement === 'bottom') {
    tooltipStyle.top  = holeTop + holeHeight + 14
    tooltipStyle.left = centerLeft
  } else {
    tooltipStyle.top  = Math.max(holeTop - TOOLTIP_HEIGHT - 14, 12)
    tooltipStyle.left = centerLeft
  }

  const arrowBase = { position: 'absolute', width: 0, height: 0, left: '50%', transform: 'translateX(-50%)' }
  const arrowDown = { ...arrowBase, top: -8, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid #1e1b4b' }
  const arrowUp   = { ...arrowBase, bottom: -8, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #1e1b4b' }

  return (
    <>
      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', background: 'rgba(0,0,0,0.72)' }} />

      {/* Spotlight hole */}
      <div style={{
        position: 'fixed',
        top: holeTop,
        left: holeLeft,
        width: holeWidth,
        height: holeHeight,
        zIndex: 9999,
        borderRadius: 8,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
        border: '2px solid rgba(79,70,229,0.6)',
        pointerEvents: 'none',
      }} />

      {/* Skip button (top-right) */}
      <button
        onClick={onSkip}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 10002,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'Inter', sans-serif",
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <X size={12} /> Skip tour
      </button>

      {/* Tooltip card */}
      <div style={{ ...tooltipStyle }}>
        {placement === 'bottom' && <div style={arrowDown} />}

        <div style={{
          background: '#1e1b4b',
          borderRadius: 14,
          padding: '20px 22px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(79,70,229,0.4)',
        }}>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                height: 4, borderRadius: 2,
                width: i === stepIndex ? 20 : 6,
                background: i <= stepIndex ? '#818cf8' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>

          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>
            {title}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: '0 0 20px', fontFamily: "'Inter', sans-serif" }}>
            {body}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
              {stepIndex + 1} / {total}
            </span>
            <button
              onClick={onNext}
              disabled={isPending}
              style={{
                background: '#4f46e5', border: 'none', borderRadius: 8,
                padding: '9px 20px', cursor: 'pointer',
                color: '#fff', fontSize: 13, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 12px rgba(79,70,229,0.5)',
                transition: 'background 0.15s',
                opacity: isPending ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!isPending) e.currentTarget.style.background = '#4338ca' }}
              onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
            >
              {isPending ? 'Saving…' : isLast ? "Let's go! 🚀" : 'Next →'}
            </button>
          </div>
        </div>

        {placement === 'top' && <div style={arrowUp} />}
      </div>
    </>
  )
}

const STEP_KEY = 'devforge-tour-step'

export default function SpotlightTour({ onComplete }) {
  const [step, setStep]   = useState(() => {
    const saved = sessionStorage.getItem(STEP_KEY)
    return saved !== null ? parseInt(saved, 10) : 0
  })
  const [rect, setRect]   = useState(null)
  const navigate          = useNavigate()
  const { user, accessToken, setAuth } = useAuthStore()

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  const finishTour = () => {
    sessionStorage.removeItem(STEP_KEY)
    onComplete?.()
  }

  const completeMutation = useMutation({
    mutationFn: () => api.post('/student/profile/onboarding/complete'),
    onSuccess: () => {
      if (user) {
        setAuth(
          { ...user, student: { ...(user.student || {}), onboardingCompleted: true } },
          accessToken,
        )
      }
      finishTour()
    },
    onError: () => finishTour(),
  })

  // Persist step so remounts after navigation resume at the right step
  useEffect(() => {
    sessionStorage.setItem(STEP_KEY, step)
  }, [step])

  const cancelRef = useRef(false)

  // Navigate + find element whenever step changes
  useEffect(() => {
    cancelRef.current = true   // cancel any in-flight poll from previous step
    navigate(current.page)

    const newCancel = { cancelled: false }
    cancelRef.current = newCancel

    const poll = () => {
      if (newCancel.cancelled) return
      const r = getRect(current.selector)
      if (r) {
        setRect(r)
      } else {
        setTimeout(poll, 150)
      }
    }

    // Give the page time to render after navigation
    const t = setTimeout(poll, 400)
    return () => {
      newCancel.cancelled = true
      clearTimeout(t)
      setRect(null)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep rect in sync with scroll / resize
  useEffect(() => {
    if (!rect) return
    const sync = () => {
      const r = getRect(current.selector)
      if (r) setRect(r)
    }
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [rect, current.selector])

  const handleNext = () => {
    if (isLast) {
      completeMutation.mutate()
    } else {
      setStep(s => s + 1)
    }
  }

  const handleSkip = () => {
    sessionStorage.removeItem(STEP_KEY)
    completeMutation.mutate()
  }

  if (!rect) return null

  return (
    <Tooltip
      rect={rect}
      step={current}
      stepIndex={step}
      total={STEPS.length}
      onNext={handleNext}
      onSkip={handleSkip}
      isLast={isLast}
      isPending={completeMutation.isPending}
    />
  )
}
