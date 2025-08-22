// src/utils/crypto.js
import crypto from "crypto";

const ALGO = "aes-256-cbc";

export function encryptWithKey(text, keyBuffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return { iv: iv.toString("base64"), content: encrypted };
}

export function decryptWithKey(encrypted, keyBuffer) {
  const iv = Buffer.from(encrypted.iv, "base64");
  const decipher = crypto.createDecipheriv(ALGO, keyBuffer, iv);
  let decrypted = decipher.update(encrypted.content, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
