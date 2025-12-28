// Lightweight fetch-based phonics API wrapper (no axios dependency)
// Exposes: listLetters(), getLetterAudio(letter) -> returns Blob

const BASE = 'http://localhost:8000'

async function requestJSON(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText} ${txt}`)
  }
  return res.json()
}

export async function listLetters() {
  return requestJSON('/api/flashcards/letters')
}

export async function listCards() {
  return requestJSON('/api/flashcards/cards')
}

export async function getLetterAudio(letter) {
  const res = await fetch(`${BASE}/api/flashcards/letters/${encodeURIComponent(letter)}/audio`)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Audio fetch failed: ${res.status} ${res.statusText} ${txt}`)
  }
  return res.blob()
}

export async function getWordAudio(word) {
  const res = await fetch(`${BASE}/static/audio/words/${encodeURIComponent(word)}.mp3`)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Word audio fetch failed: ${res.status} ${res.statusText} ${txt}`)
  }
  return res.blob()
}

export default { listLetters, listCards, getLetterAudio, getWordAudio }
