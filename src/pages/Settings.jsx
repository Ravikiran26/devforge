import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import { User, Lock, Bell, Trash2, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../lib/api'

const TABS = [
  { id: 'profile',  icon: User,   label: 'Profile'        },
  { id: 'password', icon: Lock,   label: 'Password'       },
  { id: 'notifs',   icon: Bell,   label: 'Notifications'  },
  { id: 'danger',   icon: Trash2, label: 'Danger Zone'    },
]

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, desc, children, danger }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${danger ? '#fecaca' : '#e2e8f0'}`,
      borderRadius: 18,
      padding: '28px 32px',
      marginBottom: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${danger ? '#fef2f2' : '#f1f5f9'}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: danger ? '#dc2626' : '#0f172a', marginBottom: 4 }}>{title}</div>
        {desc && <div style={{ fontSize: 13, color: '#64748b' }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, type = 'text', value, onChange, placeholder, hint, disabled }) {
  const [show, setShow] = useState(false)
  const inputType = type === 'password' ? (show ? 'text' : 'password') : type
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '11px 14px',
            paddingRight: type === 'password' ? 44 : 14,
            border: '1.5px solid #e2e8f0',
            borderRadius: 11,
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
            color: disabled ? '#94a3b8' : '#0f172a',
            background: disabled ? '#f8fafc' : '#fff',
            fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={e => {
            if (!disabled) {
              e.target.style.borderColor = '#a5b4fc'
              e.target.style.boxShadow = '0 0 0 3px rgba(165,180,252,0.15)'
            }
          }}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 2 }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>{hint}</div>}
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid #f8fafc' }}>
      <div style={{ flex: 1, paddingRight: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 46,
          height: 26,
          borderRadius: 13,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
          background: checked ? '#4f46e5' : '#e2e8f0',
          transition: 'background 0.2s',
          boxShadow: checked ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 4,
          left: checked ? 24 : 4,
          width: 18,
          height: 18,
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Save Button ──────────────────────────────────────────────────────────────

function SaveButton({ onClick, loading, label = 'Save Changes', disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: (disabled || loading) ? '#e2e8f0' : '#4f46e5',
        color: (disabled || loading) ? '#94a3b8' : '#fff',
        fontWeight: 700,
        fontSize: 13,
        padding: '10px 22px',
        borderRadius: 11,
        border: 'none',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        marginTop: 4,
        transition: 'all 0.15s',
        fontFamily: "'Inter', sans-serif",
        boxShadow: (disabled || loading) ? 'none' : '0 2px 8px rgba(79,70,229,0.25)',
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.background = '#4338ca' }}
      onMouseLeave={e => { if (!disabled && !loading) e.currentTarget.style.background = '#4f46e5' }}
    >
      <Save size={14} /> {loading ? 'Saving…' : label}
    </button>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export default function Settings() {
  const qc = useQueryClient()
  const [tab,   setTab]   = useState('profile')
  const [toast, setToast] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/student/profile').then(r => r.data),
  })

  const [name,     setName]     = useState('')
  const [college,  setCollege]  = useState('')
  const [github,   setGithub]   = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.name || '')
      setCollege(data.student?.college || '')
      setGithub(data.student?.githubUrl || '')
      setLocation(data.student?.location || '')
    }
  }, [data])

  const [curPwd,     setCurPwd]     = useState('')
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const [notifs, setNotifs] = useState({
    sprintAlerts: true, sessionReminder: true, prReviewed: true,
    weeklyDigest: false, cohortUpdates: true, emailNotifs: false,
  })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const profileMutation = useMutation({
    mutationFn: (body) => api.put('/student/profile', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); showToast('Profile saved!') },
    onError: (e) => showToast(e.response?.data?.error || 'Save failed', 'error'),
  })

  const passwordMutation = useMutation({
    mutationFn: (body) => api.put('/student/profile/password', body),
    onSuccess: () => { setCurPwd(''); setNewPwd(''); setConfirmPwd(''); showToast('Password updated!') },
    onError: (e) => showToast(e.response?.data?.error || 'Update failed', 'error'),
  })

  if (isLoading) return <DashboardLayout title="Settings"><Spinner /></DashboardLayout>

  const pwdStrength = newPwd.length < 6 ? 1 : newPwd.length < 10 ? 2 : /[^a-zA-Z0-9]/.test(newPwd) ? 4 : 3
  const pwdColors   = ['', '#dc2626', '#f59e0b', '#4f46e5', '#059669']
  const pwdLabels   = ['', 'Too short', 'Fair', 'Good', 'Strong']

  return (
    <DashboardLayout title="Settings">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Sidebar tabs */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {TABS.map(({ id, icon: Icon, label }) => {
            const isActive = tab === id
            const isDanger = id === 'danger'
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 18px',
                  background: isActive ? (isDanger ? '#fef2f2' : '#eef2ff') : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? (isDanger ? '#ef4444' : '#4f46e5') : 'transparent'}`,
                  cursor: 'pointer',
                  color: isActive ? (isDanger ? '#dc2626' : '#4f46e5') : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={15} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div>
          {/* Toast */}
          {toast && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: toast.type === 'error' ? '#fef2f2' : '#ecfdf5',
              border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#a7f3d0'}`,
              borderRadius: 12,
              padding: '11px 18px',
              marginBottom: 18,
              color: toast.type === 'error' ? '#dc2626' : '#065f46',
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {toast.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
              {toast.msg}
            </div>
          )}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <SectionCard title="Profile Information" desc="Update your personal details and public profile.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="Full Name"         value={name}           onChange={setName}     placeholder="Your name" />
                <Field label="Email Address"     value={data?.email || ''} onChange={() => {}} placeholder="you@example.com" hint="Email cannot be changed." disabled />
                <Field label="College / University" value={college}     onChange={setCollege}  placeholder="Your college name" />
                <Field label="Location"          value={location}       onChange={setLocation} placeholder="City, Country" />
              </div>
              <Field label="GitHub Profile URL" value={github} onChange={setGithub} placeholder="github.com/username" hint="Your PR submissions are linked from here." />
              <SaveButton
                onClick={() => profileMutation.mutate({ name, college, location, githubUrl: github })}
                loading={profileMutation.isPending}
              />
            </SectionCard>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <SectionCard title="Change Password" desc="Make sure your new password is at least 8 characters.">
              <Field label="Current Password"    type="password" value={curPwd}     onChange={setCurPwd}     placeholder="Enter current password" />
              <Field label="New Password"         type="password" value={newPwd}     onChange={setNewPwd}     placeholder="Min. 8 characters" />
              <Field label="Confirm New Password" type="password" value={confirmPwd} onChange={setConfirmPwd} placeholder="Repeat new password" />

              {newPwd.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 7 }}>Password strength</div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[1, 2, 3, 4].map(l => (
                      <div key={l} style={{ flex: 1, height: 4, borderRadius: 99, background: l <= pwdStrength ? pwdColors[pwdStrength] : '#e2e8f0', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: pwdColors[pwdStrength], fontWeight: 600 }}>{pwdLabels[pwdStrength]}</div>
                </div>
              )}

              {newPwd && confirmPwd && newPwd !== confirmPwd && (
                <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <AlertCircle size={13} /> Passwords do not match.
                </div>
              )}

              <SaveButton
                onClick={() => passwordMutation.mutate({ currentPassword: curPwd, newPassword: newPwd })}
                loading={passwordMutation.isPending}
                label="Update Password"
                disabled={!curPwd || !newPwd || newPwd !== confirmPwd}
              />
            </SectionCard>
          )}

          {/* Notifications Tab */}
          {tab === 'notifs' && (
            <SectionCard title="Notification Preferences" desc="Choose what you want to be notified about.">
              <Toggle label="Sprint Alerts"     desc="Get notified when new sprint tickets go live."           checked={notifs.sprintAlerts}    onChange={v => setNotifs({ ...notifs, sprintAlerts: v })} />
              <Toggle label="Session Reminders" desc="Reminder 1 hour before live coding sessions."           checked={notifs.sessionReminder} onChange={v => setNotifs({ ...notifs, sessionReminder: v })} />
              <Toggle label="PR Reviewed"        desc="Alert when mentor reviews your pull request."           checked={notifs.prReviewed}      onChange={v => setNotifs({ ...notifs, prReviewed: v })} />
              <Toggle label="Weekly Digest"      desc="Summary of your progress every Monday morning."        checked={notifs.weeklyDigest}    onChange={v => setNotifs({ ...notifs, weeklyDigest: v })} />
              <Toggle label="Batch Updates"      desc="Announcements and updates from your batch."            checked={notifs.cohortUpdates}   onChange={v => setNotifs({ ...notifs, cohortUpdates: v })} />
              <Toggle label="Email Notifications" desc="Also send notifications to your email inbox."         checked={notifs.emailNotifs}     onChange={v => setNotifs({ ...notifs, emailNotifs: v })} />
              <SaveButton onClick={() => profileMutation.mutate({ notificationPrefs: JSON.stringify(notifs) })} label="Save Preferences" />
            </SectionCard>
          )}

          {/* Danger Zone Tab */}
          {tab === 'danger' && (
            <>
              <SectionCard title="Export My Data" desc="Download a copy of all your submissions, grades, and activity.">
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#f8fafc',
                  color: '#374151',
                  fontWeight: 700,
                  fontSize: 13,
                  padding: '10px 20px',
                  borderRadius: 11,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Export Data (.zip)
                </button>
              </SectionCard>

              <SectionCard title="Danger Zone" desc="These actions cannot be undone. Please be certain." danger>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #fef2f2' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Reset Progress</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Clear all your PR submissions and grades. Enrollment stays active.</div>
                  </div>
                  <button style={{
                    padding: '8px 18px',
                    background: '#fff7ed',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                    borderRadius: 9,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    Reset
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Delete Account</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Permanently remove your account, data, and access. Cannot be reversed.</div>
                  </div>
                  <button style={{
                    padding: '8px 18px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: 9,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    Delete
                  </button>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
