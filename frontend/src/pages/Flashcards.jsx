import React, { useEffect, useState } from 'react'
import phonicsAPI from '../services/phonicsAPI'
import { getProgress, updateProgress } from '../services/progressAPI'
import { useAuth } from '../context/AuthContext'
import LottiePlayer from '../components/LottiePlayer'
import '../styles/flashcards.css'

const anchors = {
  A: '🍎', B: '🐝', C: '🐱', D: '🐶', E: '🐘', F: '🐸', G: '🦒', H: '🏠', I: '🍦', J: '🦘', K: '🪁', L: '🦁', M: '🐵', N: '🐧', O: '🦉', P: '🥞', Q: '👑', R: '🤖', S: '🐍', T: '🐯', U: '☂️', V: '🎻', W: '🚶', X: '❌', Y: '🪀', Z: '⚡'
}

export default function Flashcards() {
  const [letters, setLetters] = useState([])
  const [active, setActive] = useState(null)
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState({ mastery: {} })
  const [modal, setModal] = useState({ visible: false, letter: null, lottie: null, stars: 0 })
  const [announce, setAnnounce] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        const data = await phonicsAPI.listCards()
        setLetters(data)
      } catch (e) {
        console.error('Failed to load letters', e)
        // fallback: construct A-Z
        const alpha = Array.from({ length: 26 }).map((_, i) => ({ letter: String.fromCharCode(65 + i) }))
        setLetters(alpha)
      }
    }
    load()
  }, [])

  useEffect(() => {
    async function loadProgress(){
      if (!user) return
      try {
        const p = await getProgress(user.email)
        setProgress(p)
      } catch(e){ console.warn('No progress yet', e) }
    }
    loadProgress()
  }, [user])

  function lottieForLetter(letter){
    // simple deterministic mapping to sample lotties
    const idx = (letter.charCodeAt(0) - 65) % 2 + 1
    return `/static/lottie/sample_monster_${idx}.json`
  }

  async function playLetter(letter){
    try{
      setActive(letter)

      // Show an immersive modal with Lottie animation
      const lottie = lottieForLetter(letter)
      setModal({ visible: true, letter, lottie, stars: 0 })
      setAnnounce(`Playing ${letter}`)

      // fetch audio blob and play
      const blob = await phonicsAPI.getLetterAudio(letter.toLowerCase())
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.play().catch(e=>console.error('Audio play failed', e))

      // optimistic UI: update mastery locally and persist if logged in
      const cur = progress.mastery?.[letter] || 0
      const delta = 0.06
      const next = Math.min(1, cur + delta)
      setProgress(prev => ({ ...prev, mastery: { ...prev.mastery, [letter]: next } }))

      // animate stars in the modal based on next mastery
      const stars = Math.round(next * 3)
      setModal(m => ({ ...m, stars }))

      if (user){
        try{
          await updateProgress(user.email, { game: 'flashcard', score: 1, mastery_delta: { [letter]: delta } })
        }catch(e){ console.warn('Failed to save progress', e) }
      }

      // End interaction after short delay
      setTimeout(()=>{
        setActive(null)
        // keep modal visible briefly to show completion animation
        setTimeout(()=> setModal({ visible: false, letter: null, lottie: null, stars: 0 }), 900)
      }, 1000)
    }catch(e){
      console.error('Audio fetch error', e)
      alert('Audio not available — generate assets or start backend')
      setModal({ visible: false, letter: null, lottie: null, stars: 0 })
    }
  }

  function closeModal(){
    setModal({ visible: false, letter: null, lottie: null, stars: 0 })
  }

  function masteryStars(letter){
    const val = progress.mastery?.[letter] || 0
    const filled = Math.round(val * 3)
    return Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className={`star ${i < filled ? 'filled' : ''}`}>★</span>
    ))
  }

  return (
    <div className="flash-root">
      <div style={{width:'100%', maxWidth:900, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{margin:0}}>Remember — Phonics Flashcards</h2>
          <div className="flash-doc">Tap a card to hear the phoneme and see a visual anchor</div>
        </div>

        <div className="flash-preview" aria-live="polite">
          {preview ? (
            <>
              <div style={{height:120, width:120}}>
                <LottiePlayer src={preview} loop={true} style={{height:120, width:120}} />
              </div>
              <div style={{marginTop:8}} className="letter">{active || 'A'}</div>
            </>
          ) : (
            <div style={{height:120, width:120, display:'flex', alignItems:'center', justifyContent:'center'}}>Select a letter</div>
          )}
        </div>
      </div>

      <section className="flash-grid" role="grid">
        {letters.map(({ letter }) => (
          <div key={letter} role="gridcell" tabIndex={0} className={`card ${active === letter ? 'active' : ''}`} onClick={() => playLetter(letter)} onKeyDown={(e)=>{ if(e.key === 'Enter') playLetter(letter) }}>
            <div className="letter">{letter}</div>
            <div className="anchor">{anchors[letter] || '✨'}</div>
            <div className="stars">{masteryStars(letter)}</div>
          </div>
        ))}
      </section>

      {modal.visible && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Practice letter" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            <div className="modal-lottie">
              <LottiePlayer src={modal.lottie} loop={false} style={{height:240, width:240}} />
            </div>
            <div className="modal-letter">{modal.letter}</div>
            <div className="modal-anchor">{anchors[modal.letter]}</div>
            <div className="modal-stars">{Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`star ${i < modal.stars ? 'filled animate' : ''}`}>★</span>
            ))}</div>
            <div className="sr-only" aria-live="polite">{announce}</div>
          </div>
        </div>
      )}
    </div>
  )
}