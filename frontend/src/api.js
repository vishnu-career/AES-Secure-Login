import axios from "axios";
import { startHandshake } from "./utils/dh";
import { encryptWithKey, decryptWithKey } from "./utils/crypto";

const BASE = "http://localhost:5000";

export async function login(username, password) {
  // 1) DH handshake → per-session AES key
  const { sessionId, clientPubB64, keyWA } = await startHandshake();

  // 2) Encrypt login payload with that AES key
  const payload = JSON.stringify({ username, password });
  const data = encryptWithKey(payload, keyWA);

  // 3) Send to backend along with session + client pub
  const res = await axios.post(`${BASE}/login`, {
    sessionId,
    clientPub: clientPubB64,
    data,
  });

  // 4) Decrypt response (if present)
  if (res.data?.data) {
    const txt = decryptWithKey(res.data.data, keyWA);
    try {
      return JSON.parse(txt);
    } catch {
      return txt;
    }
  }

  if (res.data?.error) throw new Error(res.data.error);
  return res.data;
}
