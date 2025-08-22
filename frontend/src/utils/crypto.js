import CryptoJS from "crypto-js";

// Convert Uint8Array -> hex -> WordArray (CryptoJS key)
export function u8ToWordArray(u8) {
  const hex = Array.from(u8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return CryptoJS.enc.Hex.parse(hex);
}

export function encryptWithKey(text, keyWA) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, keyWA, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return {
    iv: CryptoJS.enc.Base64.stringify(iv),
    content: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
  };
}

export function decryptWithKey(encrypted, keyWA) {
  const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encrypted.content) },
    keyWA,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
