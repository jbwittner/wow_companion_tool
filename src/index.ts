import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeInstance } from "./config/sequelize"
import { Realm } from "./models/Realm";
import { RealmCategory } from "./models/RealmCategory";
import { RealmRegion } from "./models/RealmRegion";
import { RealmType } from "./models/RealmType";

sequelizeInstance.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    const realm = new RealmType({
        id: 5,
        type: 'toto'
    })
    realm.save()
    const tata = new RealmRegion({
        id: 4,
        de_de: "DataTypes.STRING_1",
        en_gb: "DataTypes.STRING_2",
        en_us: "DataTypes.STRING_3",
        es_es: "DataTypes.STRING_4",
        es_mx: "DataTypes.STRING_5",
        fr_fr: "DataTypes.STRING_6",
        it_it: "DataTypes.STRING_7",
        ko_kr: "DataTypes.STRING_8",
        pt_br: "DataTypes.STRING_9",
        ru_ru: "DataTypes.STRING_10",
        zh_cn: "DataTypes.STRING_11",
        zh_tw: "DataTypes.STRING_12",
    })
    tata.save()
    const totooo = new RealmCategory({
        id: 6,
        slug: "aaaaa",
        de_de: "DataTypes.STRING_1",
        en_gb: "DataTypes.STRING_2",
        en_us: "DataTypes.STRING_3",
        es_es: "DataTypes.STRING_4",
        es_mx: "DataTypes.STRING_5",
        fr_fr: "DataTypes.STRING_6",
        it_it: "DataTypes.STRING_7",
        ko_kr: "DataTypes.STRING_8",
        pt_br: "DataTypes.STRING_9",
        ru_ru: "DataTypes.STRING_10",
        zh_cn: "DataTypes.STRING_11",
        zh_tw: "DataTypes.STRING_12",
    })
    totooo.save();
    const tttttt = new Realm({
        id: 456,
        locale: "eeeee",
        realm_category_id: totooo.id,
        realm_region_id: tata.id,
        realm_type_id: realm.id,
        timezone: "kkkk",
        slug: "sdlqksldk"
    })
    tttttt.save()

}).catch((reason) => {
    console.error('Unable to connect to the database:', reason);
})

/*
const sequelize = new Sequelize('wow_companion_db', 'wow_companion_user', 'WoWCompanionPass2022', {
    host: 'localhost',
    port: 7000,
    dialect: 'mysql'
  });

class RealmType extends Model {
    declare id: number
    declare type: string
}

RealmType.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    type: DataTypes.STRING
  }, { sequelize, tableName: 'REALM_TYPE', timestamps: false});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    const realm = new RealmType({
        id: 5,
        type: 'toto'
    })
    realm.save()
}).catch((reason) => {
    console.error('Unable to connect to the database:', reason);
})
*/