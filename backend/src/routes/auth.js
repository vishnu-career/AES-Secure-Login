// src/routes/auth.js
import crypto from "crypto";
import User from "../models/User.js";
import { decryptWithKey, encryptWithKey } from "../utils/crypto.js";
import { takeECDH } from "../utils/dhStore.js";

async function authRoutes(fastify) {
  fastify.post("/login", async (req, reply) => {
    try {
      const { sessionId, clientPub, data } = req.body;

      // Fetch the server's ephemeral ECDH for this session
      const ecdh = takeECDH(sessionId);
      if (!ecdh) {
        return reply.code(400).send({ error: "Invalid or expired sessionId" });
      }

      // Derive the shared secret (Buffer)
      const sharedSecret = ecdh.computeSecret(Buffer.from(clientPub, "base64"));
      // Hash to 32 bytes for AES-256 key
      const aesKey = crypto.createHash("sha256").update(sharedSecret).digest();

      // Decrypt login payload
      const decryptedJson = decryptWithKey(data, aesKey);
      const { username, password } = JSON.parse(decryptedJson);

      // Validate user (demo: plain text check)
      const user = await User.findOne({ where: { username } });
      if (!user || user.password !== password) {
        return reply
          .code(401)
          .send({ data: encryptWithKey("Invalid credentials", aesKey) });
      }

      // Success response (encrypt again with same per-session AES key)
      const response = JSON.stringify({ message: "Login success", user });
      return { data: encryptWithKey(response, aesKey) };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Server error" });
    }
  });
}

export default authRoutes;
