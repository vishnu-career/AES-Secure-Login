import { Sequelize } from "sequelize";

const sequelize = new Sequelize("aes_demo", "root", "Sv@772002", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
