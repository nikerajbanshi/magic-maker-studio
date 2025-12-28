import React, { useRef, useState } from 'react'
import phonicsAPI from '../services/phonicsAPI'

const demoWords = [
  { word: 'fit', phonemes: ['f', 'i', 't'] },
  { word: 'cat', phonemes: ['c', 'a', 't'] },
  { word: 'dog', phonemes: ['d', 'o', 'g'] },
  { word: 'hop', phonemes: ['h', 'o', 'p'] },
]

export default function Blending() {
  const [selected, setSelected] = useState(demoWords[0])
  const [slider, setSlider] = useState(0)
  const [activeIndex, setActiveIndex] = useState(null)
  const [playing, setPlaying] = useState(false)
  const lastRef = useRef({ time: 0, val: 0 })
  const cancelRef = useRef(false)
  const audioCache = useRef({})
  const currentAudioRef = useRef(null)

  const fetchLetterBlob = async (letter) => {
    if (!audioCache.current[letter]) {
      const b = await phonicsAPI.getLetterAudio(letter)
      audioCache.current[letter] = URL.createObjectURL(b)
    }
    return audioCache.current[letter]
  }

  const fetchWordBlob = async (word) => {
    if (!audioCache.current[word]) {
      const b = await phonicsAPI.getWordAudio(word)
      audioCache.current[word] = URL.createObjectURL(b)
    }
    return audioCache.current[word]
  }

  const _pauseCurrentAudio = () => {
    try {
      const a = currentAudioRef.current
      if (a) {
        a.pause()
        try { a.currentTime = 0 } catch (_) {}
        currentAudioRef.current = null
      }
    } catch (e) {
      console.warn('pause error', e)
    }
  }

  const stopPlayback = () => {
    cancelRef.current = true
    _pauseCurrentAudio()
    setPlaying(false)
    setActiveIndex(null)
  }

  const playSegments = async (phonemes, gapMs) => {
    cancelRef.current = false
    _pauseCurrentAudio()
    setPlaying(true)
    for (let i = 0; i < phonemes.length; i++) {
      if (cancelRef.current) break
      const p = phonemes[i]
      setActiveIndex(i)
      try {
        const src = await fetchLetterBlob(p)
        const a = new Audio(src)
        currentAudioRef.current = a
        await a.play()
        // wait for audio to end or gap
        await new Promise((res) => {
          const t = setTimeout(() => res(), gapMs)
          const onEnd = () => {
            clearTimeout(t)
            a.removeEventListener('ended', onEnd)
            res()
          }
          a.addEventListener('ended', onEnd)
        })
        // clear currentAudioRef after finished
        if (currentAudioRef.current === a) currentAudioRef.current = null
      } catch (e) {
        console.error('segment play error', e)
      }
    }
    setActiveIndex(null)
    setPlaying(false)
  }

  const playFull = async (word) => {
    cancelRef.current = false
    _pauseCurrentAudio()
    setPlaying(true)
    setActiveIndex(null)
    try {
      const src = await fetchWordBlob(word)
      const a = new Audio(src)
      currentAudioRef.current = a
      await a.play()
      await new Promise((res) => {
        const onEnd = () => {
          a.removeEventListener('ended', onEnd)
          res()
        }
        a.addEventListener('ended', onEnd)
      })
    } catch (e) {
      console.error('word play error', e)
    }
    currentAudioRef.current = null
    setPlaying(false)
  }

  const handleSliderInput = (e) => {
    const val = Number(e.target.value)
    const now = performance.now()
    const last = lastRef.current
    const deltaVal = Math.abs(val - last.val)
    const deltaTime = Math.max(1, now - last.time)
    const velocity = deltaVal / deltaTime // units per ms
    lastRef.current = { time: now, val }
    setSlider(val)

    // decide: fast swipe -> play blended; slow -> play segments with gap inversely proportional
    const velocityThreshold = 0.3 // empirically chosen
    if (velocity > velocityThreshold) {
      // fast swipe -> play blended immediately
      stopPlayback()
      playFull(selected.word)
      return
    }

    // schedule segmented playback (cancel previous)
    stopPlayback()
    // gap: from 700ms (slow) to 120ms (fast) depending on slider value (0-100)
    const gap = Math.round(700 - (val / 100) * 580)
    playSegments(selected.phonemes, gap)
  }

  const handlePlayPause = () => {
    if (playing) {
      stopPlayback()
      return
    }
    // if slider high (>60) play full, else segments
    if (slider > 60) playFull(selected.word)
    else playSegments(selected.phonemes, Math.round(700 - (slider / 100) * 580))
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Understand — Phonetic Blending Slider</h2>
      <p>Drag the slider slowly to hear separated sounds, swipe fast to hear the blended word.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <label htmlFor="wordSelect">Word:</label>
        <select id="wordSelect" value={selected.word} onChange={(e) => setSelected(demoWords.find(d => d.word === e.target.value))}>
          {demoWords.map(d => <option key={d.word} value={d.word}>{d.word}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {selected.phonemes.map((p, i) => (
          <div key={p} aria-hidden style={{ padding: 12, borderRadius: 8, minWidth: 56, textAlign: 'center', background: activeIndex === i ? '#ffd54f' : '#f5f5f5', transition: 'transform 140ms ease', transform: activeIndex === i ? 'scale(1.08)' : 'scale(1)' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{p.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={handlePlayPause} aria-label={playing ? 'Pause' : 'Play'}>{playing ? 'Pause' : 'Play'}</button>
        <div style={{ flex: 1 }}>
          <input aria-label="Blending slider" type="range" min="0" max="100" value={slider} onInput={handleSliderInput} />
        </div>
        <div style={{ minWidth: 40, textAlign: 'right' }}>{slider}%</div>
      </div>

      <div style={{ color: '#666' }}>
        <small>Tip: Try dragging slowly for separated sounds, then swipe fast for the blended word.</small>
      </div>
    </div>
  )
}