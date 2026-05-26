import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'

const STEPS = [
  {
    emoji: '👋',
    title: 'Welcome to DevForge!',
    body: "You're about to spend the next 12 weeks becoming a full-stack developer. This platform is your command center — lessons, assignments, grades, everything in one place.",
    cta: 'Show me around →',
  },
  {
    emoji: '📚',
    title: 'Start with Lessons',
    body: 'Each week has 5 lessons. Watch them in order — every lesson unlocks the next. Click "Mark as Complete" when you finish reading. Your first lesson is waiting!',
    cta: 'Got it →',
  },
  {
    emoji: '🎯',
    title: 'Submit PRs on Assignments',
    body: 'After watching lessons, you\'ll build real features. Create a GitHub branch, push your code, open a Pull Request, and submit the PR URL here. AI will review it within 60 seconds.',
    cta: 'Understood →',
  },
  {
    emoji: '📈',
    title: 'Track your Progress',
    body: 'The Progress page shows your grade trend, activity streak, and the projects you\'ve built. Mentors check in every week — you\'re not doing this alone.',
    cta: "Let's go! 🚀",
  },
]

export default function OnboardingTour({ onComplete }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { accessToken, refreshToken, setAuth } = useAuthStore()

  const completeMutation = useMutation({
    mutationFn: () => api.post('/student/profile/onboarding/complete'),
    onSuccess: () => {
      if (user) {
        const updatedUser = {
          ...user,
          student: { ...(user.student || {}), onboardingCompleted: true },
        }
        setAuth(updatedUser, accessToken, refreshToken)
      }
      onComplete?.()
    },
  })

  const isLast = step === STEPS.length - 1
  const s = STEPS[step]

  const handleNext = () => {
    if (isLast) {
      completeMutation.mutate()
      navigate('/lessons')
    } else {
      setStep(prev => prev + 1)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 44px',
        maxWidth: 460, width: '100%', textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        animation: 'tourIn 0.25s ease',
      }}>
        <style>{`@keyframes tourIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 7, height: 7, borderRadius: 4,
              background: i <= step ? '#4f46e5' : '#e2e8f0',
              transition: 'all 0.2s',
            }}/>
          ))}
        </div>

        <div style={{ fontSize: 48, marginBottom: 16 }}>{s.emoji}</div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif" }}>
          {s.title}
        </h2>

        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: '0 0 32px', fontFamily: "'Inter', sans-serif" }}>
          {s.body}
        </p>

        <button
          onClick={handleNext}
          disabled={completeMutation.isPending}
          style={{
            width: '100%', padding: '14px', background: '#4f46e5', color: '#fff',
            fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
            transition: 'background 0.15s, transform 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {completeMutation.isPending ? 'Starting…' : s.cta}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(p => p - 1)}
            style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
