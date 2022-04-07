import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"
import { initLocalizedData, LocalizedData } from "./LocalizedType";

export class SpecializationRole extends LocalizedData {
    declare id: number
    declare type: string
}

SpecializationRole.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    type: DataTypes.STRING,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'SPECIALIZATION_ROLES', timestamps: false});
 