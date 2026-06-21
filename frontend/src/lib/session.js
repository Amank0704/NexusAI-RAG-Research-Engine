
// user session for anonymous 
const SESSION_KEY = "nexusai_session_id"

function generateUUID() {
  // Native browser crypto API — no extra dependency needed
  if (crypto?.randomUUID) return crypto.randomUUID()
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = generateUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function resetSessionId() {
  const newId = generateUUID()
  localStorage.setItem(SESSION_KEY, newId)
  return newId
}