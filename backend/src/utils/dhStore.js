// src/utils/dhStore.js
const SESSIONS = new Map();

export function saveECDH(sessionId, ecdh) {
  SESSIONS.set(sessionId, ecdh);
}

// take + delete (one-time use for security)
export function takeECDH(sessionId) {
  const ecdh = SESSIONS.get(sessionId);
  SESSIONS.delete(sessionId);
  return ecdh;
}
