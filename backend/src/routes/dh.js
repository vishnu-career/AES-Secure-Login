// src/routes/dh.js
import crypto from "crypto";
import { saveECDH } from "../utils/dhStore.js";

async function dhRoutes(fastify) {
  // Client calls this first to start a session
  fastify.post("/dh/init", async (req, reply) => {
    const ecdh = crypto.createECDH("prime256v1"); // P-256
    ecdh.generateKeys(); // server ephemeral keys

    const sessionId = crypto.randomUUID();
    saveECDH(sessionId, ecdh);

    // Uncompressed public key as base64 (65 bytes)
    const serverPub = ecdh.getPublicKey("base64");

    return { sessionId, serverPub };
  });
}

export default dhRoutes;
