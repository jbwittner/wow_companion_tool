import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/sequelize"

export class RealmType extends Model {
    declare id: number
    declare type: string
}

RealmType.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    type: DataTypes.STRING
  }, { sequelize: sequelizeInstance, tableName: 'REALM_TYPE', timestamps: false});
 