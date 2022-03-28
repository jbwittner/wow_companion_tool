import { DataTypes, Model } from "sequelize";

export class LocalizedData extends Model {
    declare de_de: string
    declare en_gb: string
    declare en_us: string
    declare es_es: string
    declare es_mx: string
    declare fr_fr: string
    declare it_it: string
    declare ko_kr: string
    declare pt_br: string
    declare ru_ru: string
    declare zh_cn: string
    declare zh_tw: string
}

export const initLocalizedData = {
    de_de: DataTypes.STRING,
    en_gb: DataTypes.STRING,
    en_us: DataTypes.STRING,
    es_es: DataTypes.STRING,
    es_mx: DataTypes.STRING,
    fr_fr: DataTypes.STRING,
    it_it: DataTypes.STRING,
    ko_kr: DataTypes.STRING,
    pt_br: DataTypes.STRING,
    ru_ru: DataTypes.STRING,
    zh_cn: DataTypes.STRING,
    zh_tw: DataTypes.STRING,
  };
 