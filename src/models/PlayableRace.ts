import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/SequelizeConfig"
import { RealmCategory } from "./RealmCategory";
import { RealmType } from "./RealmType";
import { Faction } from "./Faction";

export class PlayableRace extends LocalizedData{
    declare id: number
    declare faction_id: number
}

PlayableRace.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    faction_id: DataTypes.INTEGER,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'PLAYABLE_RACES', timestamps: false});

  PlayableRace.belongsTo(Faction, { foreignKey: 'faction_id', targetKey: 'id' });