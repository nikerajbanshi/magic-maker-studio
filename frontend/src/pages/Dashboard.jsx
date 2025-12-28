import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/dashboard.css'

export default function Dashboard(){
  const navigate = useNavigate()
  const modules = [
    { id: 'flashcards', name: 'Flashcards', desc: 'Learn phonemes A–Z', route: '/flashcards', badge: 'Remember' },
    { id: 'understanding', name: 'Understanding', desc: 'Practice phoneme recognition', route: '/understanding', badge: 'Understand' },
    { id: 'game', name: 'Hungry Monster', desc: 'Apply with listening games', route: '/game', badge: 'Apply' },
    { id: 'pairs', name: 'Minimal Pairs', desc: 'Analyze subtle contrasts', route: '/pairs', badge: 'Analyze' },
    { id: 'story', name: 'Story Mode', desc: 'Find sounds in context', route: '/story', badge: 'Create' },
    { id: 'dashboard', name: 'Progress', desc: 'View your competence dashboard', route: '/profile', badge: 'Track' }
  ]

  return (
    <main className="dashboard-root">
      <header className="header">
        <div className="avatar" aria-hidden>CI</div>
        <div>
          <div className="title">Magic Maker Studio</div>
          <div className="subtitle">Learn phonics with playful, mobile-first interactions</div>
        </div>
      </header>

      <section className="module-grid" role="list">
        {modules.map(mod => (
          <article key={mod.id} role="listitem" tabIndex={0} className="module-card" onClick={() => navigate(mod.route)} onKeyDown={(e)=>{ if(e.key === 'Enter') navigate(mod.route) }}>
            <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
              <div style={{display:'flex',flexDirection:'column'}}>
                <div className="m-title">{mod.name}</div>
                <div className="m-desc">{mod.desc}</div>
              </div>
              <div className="m-badge">{mod.badge}</div>
            </div>
          </article>
        ))}
      </section>

      <div className="footer-note">Tip: The UI is mobile-first — try it on your phone for the best experience.</div>
    </main>
  )
}