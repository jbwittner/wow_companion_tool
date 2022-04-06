import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"

export class Faction extends LocalizedData{
    declare id: number
    declare type: string
}

Faction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      type: DataTypes.STRING,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'FACTIONS', timestamps: false});