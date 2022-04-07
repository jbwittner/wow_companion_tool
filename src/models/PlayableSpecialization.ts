import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"
import { PlayableClass } from "./PlayableClass";
import { SpecializationRole } from "./SpecializationRole";

export class PlayableSpecialization extends LocalizedData{
    declare id: number
    declare media_url: String
    declare playable_class_id: number
    declare specialization_role_id: number

}

PlayableSpecialization.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    media_url: DataTypes.STRING,
    playable_class_id: DataTypes.INTEGER,
    specialization_role_id: DataTypes.INTEGER,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'PLAYABLE_SPECIALIZATIONS', timestamps: false});

PlayableSpecialization.belongsTo(PlayableClass, { foreignKey: 'playable_class_id', targetKey: 'id' });
PlayableSpecialization.belongsTo(SpecializationRole, { foreignKey: 'specialization_role_id', targetKey: 'id' });