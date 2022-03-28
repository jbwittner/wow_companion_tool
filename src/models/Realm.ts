import { initLocalizedData, LocalizedData } from "./LocalizedType";
import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/sequelize"
import { RealmRegion } from "./RealmRegion";
import { RealmCategory } from "./RealmCategory";
import { RealmType } from "./RealmType";

export class Realm extends LocalizedData{
    declare id: number
    declare locale: string
    declare realm_category_id: number
    declare realm_region_id: number
    declare realm_type_id: number
    declare timezone: string
    declare slug: string
}

Realm.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    locale: DataTypes.STRING,
    realm_category_id: DataTypes.INTEGER,
    realm_region_id: DataTypes.INTEGER,
    realm_type_id: DataTypes.INTEGER,
    timezone: DataTypes.STRING,
    slug: DataTypes.STRING,
    ...initLocalizedData
  }, { sequelize: sequelizeInstance, tableName: 'REALMS', timestamps: false});

Realm.belongsTo(RealmCategory, { foreignKey: 'realm_category_id', targetKey: 'id' });
Realm.belongsTo(RealmRegion, { foreignKey: 'realm_region_id', targetKey: 'id' });
Realm.belongsTo(RealmType, { foreignKey: 'realm_type_id', targetKey: 'id' });