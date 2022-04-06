import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"
import { initLocalizedData, LocalizedData } from "./LocalizedType";

export class RealmType extends LocalizedData {
    declare id: number
    declare type: string
}

RealmType.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    type: DataTypes.STRING,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'REALM_TYPE', timestamps: false});
 