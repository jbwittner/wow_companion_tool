import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/sequelize"

export class RealmRegion extends LocalizedData{
    declare id: number
}

RealmRegion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'REALM_REGION', timestamps: false});