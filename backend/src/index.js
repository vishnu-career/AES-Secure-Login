import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.js";
import dhRoutes from "./routes/dh.js";
import User from "./models/User.js";

const app = Fastify();

await app.register(cors, { origin: true, credentials: true });
app.register(dhRoutes);
app.register(authRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // dev-only

    // seed demo user
    await User.create({ username: "vishnu", password: "12345" });

    await app.listen({ port: 5000 });
    console.log("Server running on http://localhost:5000");
  } catch (err) {
    console.error(err);
  }
};

start();
