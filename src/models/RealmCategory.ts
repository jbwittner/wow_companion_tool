import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"

export class RealmCategory extends LocalizedData{
    declare id: number
    declare slug: string
}

RealmCategory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    slug: DataTypes.STRING,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'REALM_CATEGORY', timestamps: false});