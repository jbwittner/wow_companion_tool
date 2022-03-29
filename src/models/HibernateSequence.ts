import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"

export class HibernateSequence extends Model {
    declare next_val: number
}

HibernateSequence.init({
    next_val: {
        type: DataTypes.INTEGER,
      }
  }, { sequelize: sequelizeInstance, tableName: 'hibernate_sequence', timestamps: false});
 