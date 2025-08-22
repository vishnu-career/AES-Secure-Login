// src/utils/dh.js
import CryptoJS from "crypto-js";
import { u8ToWordArray } from "./crypto";
import axios from "axios";

const BASE = "http://localhost:5000";

// small helpers
const b64ToU8 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const u8ToB64 = (u8) => btoa(String.fromCharCode(...u8));

export async function startHandshake() {
  // 1) Ask server for session + its pubkey
  const { data } = await axios.post(`${BASE}/dh/init`);
  const { sessionId, serverPub } = data;

  // 2) Client ECDH keypair (P-256)
  const clientKeys = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  // 3) Export client public key (raw, 65 bytes)
  const clientPubRaw = await window.crypto.subtle.exportKey(
    "raw",
    clientKeys.publicKey
  );
  const clientPubB64 = u8ToB64(new Uint8Array(clientPubRaw));

  // 4) Import server public key (raw)
  const serverPubRaw = b64ToU8(serverPub);
  const serverPubKey = await window.crypto.subtle.importKey(
    "raw",
    serverPubRaw,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // 5) Derive shared secret bits (256 bits)
  const secretBits = await window.crypto.subtle.deriveBits(
    { name: "ECDH", public: serverPubKey },
    clientKeys.privateKey,
    256
  );

  // 6) Hash → 32-byte AES key; convert to CryptoJS WordArray
  const aesKeyBytes = new Uint8Array(
    await window.crypto.subtle.digest("SHA-256", secretBits)
  );
  const keyWA = u8ToWordArray(aesKeyBytes);

  return { sessionId, clientPubB64, keyWA };
}
