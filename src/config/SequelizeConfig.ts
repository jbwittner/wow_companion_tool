import { Sequelize } from "sequelize";

export const sequelizeInstance = new Sequelize('wow_companion_db', 'wow_companion_user', 'WoWCompanionPass2022', {
    host: 'localhost',
    port: 7000,
    dialect: 'mysql',
    logging: false
  });