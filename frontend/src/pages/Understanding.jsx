import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import phonicsAPI from '../services/phonicsAPI'
import { getProgress, updateProgress } from '../services/progressAPI'
import { useAuth } from '../context/AuthContext'
import LottiePlayer from '../components/LottiePlayer'
import '../styles/understanding.css'

function randomLetter(){
  return String.fromCharCode(65 + Math.floor(Math.random() * 26))
}

function makeChoices(correct){
  const choices = new Set([correct])
  while(choices.size < 3){
    choices.add(randomLetter())
  }
  return Array.from(choices).sort()
}

export default function Understanding(){
  const navigate = useNavigate()
  const { user } = useAuth()
  const [question, setQuestion] = useState(null)
  const [status, setStatus] = useState(null) // 'correct' | 'incorrect' | null
  const [progress, setProgress] = useState({mastery:{}})
  const [lottieSrc, setLottieSrc] = useState(null)

  useEffect(()=> generate(), [])

  useEffect(()=>{
    async function loadProgress(){
      if(!user) return
      try{ const p = await getProgress(user.email); setProgress(p) }catch(e){}
    }
    loadProgress()
  }, [user])

  function lottieForLetter(letter){
    const idx = (letter.charCodeAt(0) - 65) % 2 + 1
    return `/static/lottie/sample_monster_${idx}.json`
  }

  async function generate(){
    const letter = randomLetter()
    const choices = makeChoices(letter)
    setQuestion({ letter, choices })
    setStatus(null)
    setLottieSrc(lottieForLetter(letter))

    // auto-play audio if available
    try{
      const blob = await phonicsAPI.getLetterAudio(letter.toLowerCase())
      const url = URL.createObjectURL(blob)
      const a = new Audio(url)
      await a.play().catch(()=>{})
    }catch(e){ /* silent */ }
  }

  async function submitChoice(chosen){
    if(!question) return
    const correct = chosen === question.letter
    setStatus(correct ? 'correct' : 'incorrect')

    // update progress optimistically
    const delta = correct ? 0.06 : -0.02
    const payload = { game: 'understanding', score: correct ? 1 : 0, mastery_delta: { [question.letter]: delta } }
    if(user){
      try{ await updateProgress(user.email, payload); const p = await getProgress(user.email); setProgress(p) }catch(e){ console.warn('progress save failed', e) }
    }else{
      // local update
      setProgress(prev => ({ mastery: { ...(prev.mastery||{}), [question.letter]: Math.max(0, (prev.mastery?.[question.letter]||0) + delta) } }))
    }
  }

  return (
    <div className="under-root">
      <header className="under-header">
        <button onClick={() => navigate('/dashboard')} className="link-back">← Back</button>
        <h2>Understanding — Listening Quiz</h2>
      </header>

      <div className="under-body">
        <div className="under-left">
          <div className="lottie-box">
            {lottieSrc ? <LottiePlayer src={lottieSrc} loop={true} style={{height:220,width:220}} /> : <div className="placeholder">Select to load</div>}
          </div>
          <div className="prompt">Which letter did you hear?</div>
          <div className="choices">
            {question?.choices?.map(c => (
              <button key={c} className={`choice ${status ? (c === question.letter ? 'correct' : (c === question.letter ? 'correct' : '')) : ''}`} onClick={() => submitChoice(c)}>{c}</button>
            ))}
          </div>

          {status && (
            <div className={`feedback ${status}`}>{status === 'correct' ? 'Nice! ✅' : 'Oops — keep practicing 🐣'}</div>
          )}

          <div className="under-controls">
            <button onClick={generate} className="secondary">Next</button>
            <button onClick={() => { if(question){ phonicsAPI.getLetterAudio(question.letter.toLowerCase()).then(b => { const u = URL.createObjectURL(b); new Audio(u).play().catch(()=>{}); }).catch(()=>{}) } }} className="secondary">Play again</button>
          </div>
        </div>

        <aside className="under-right">
          <div className="progress-box">
            <h4>Your mastery (sample)</h4>
            <div className="mini-grid">
              {Object.keys(progress.mastery || {}).slice(0,12).map(l => (
                <div key={l} className="mini-cell">
                  <div className="mini-letter">{l}</div>
                  <div className="mini-val">{Math.round((progress.mastery[l]||0)*100)}%</div>
                </div>
              ))}
              {Object.keys(progress.mastery||{}).length === 0 && <div className="muted">No progress yet — answer questions to build mastery.</div>}
            </div>
          </div>

          <div className="tip">Tip: Try saying the sound aloud before answering — it helps build phonemic awareness.</div>
        </aside>
      </div>
    </div>
  )
}
