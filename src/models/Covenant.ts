import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"

export class Covenant extends LocalizedData{
    declare id: number
    declare media_url: String
}

Covenant.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    media_url: DataTypes.STRING,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'COVENANT', timestamps: false});