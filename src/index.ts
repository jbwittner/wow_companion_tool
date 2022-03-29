import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeInstance } from "./config/SequelizeConfig"
import { Realm } from "./models/Realm";
import { RealmCategory } from "./models/RealmCategory";
import { RealmRegion } from "./models/RealmRegion";
import { RealmType } from "./models/RealmType";
import { ReadLine } from "readline";
import { Configuration, IndexData, NameData, RealmApi, RealmData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import axios from "axios";
import * as qs from 'query-string'
import { HibernateSequence } from "./models/HibernateSequence";


const getName = (data: NameData) => {
    return {
        de_de: data.de_DE,
        en_gb: data.en_GB,
        en_us: data.en_US,
        es_es: data.es_ES,
        es_mx: data.es_MX,
        fr_fr: data.fr_FR,
        it_it: data.it_IT,
        ko_kr: data.ko_KR,
        pt_br: data.pt_BR,
        ru_ru: data.ru_RU,
        zh_cn: data.zh_CN,
        zh_tw: data.zh_TW,
    }
}


const getSequence = async() => {
    const result = await HibernateSequence.findAll();
    const sequence = result[0];
    const sequenceValue = sequence.next_val;
    sequence.next_val = sequenceValue + 1;
    await sequence.save()
    return sequenceValue;
}

const grantType = {
    grant_type: 'client_credentials',
  };

const getRealmData = async (slug: string, realmApi: RealmApi) => {
    while(true){
        try {
            const data = await realmApi.getRealmBySlug("dynamic-eu","eu", slug)
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const createOrUpdateRealmType = async (realmData: RealmData) => {

    const typeData = realmData.type;

    let realmType = await RealmType.findOne({
        where : {
            type: typeData.type
        }
    })

    if (realmType === null){
        const idValue = await getSequence()
        realmType = new RealmType({
            id: idValue,
            type: typeData.type,
        })
        realmType.save()
    }

    console.log(realmData.type.type)
    console.log(realmType)

    return realmType

}

async function updateDate() {
    try {
        const getTokenResult = await axios.request({
            url: '/oauth/token',
            method: 'post',
            baseURL: 'https://eu.battle.net/',
            auth: {
              username: "8028f870c3b347bdba96ec8559af19c3", // This is the client_id
              password: "6ZRjBNHRRMUTmJyTX7tVfWD00kSJ2aPm", // This is the client_secret
            },
            data: qs.stringify(grantType),
          })
        
        console.log(getTokenResult.data)

        const configuration : Configuration = new Configuration({
            accessToken: getTokenResult.data.access_token,
            baseOptions: {
                timeout: 1000
            }
        });

        const realmApi : RealmApi = new RealmApi(configuration);

        const realmIndexResult = await realmApi.getRealmIndex("dynamic-eu","eu")

        const realmsIndexData = realmIndexResult.data.realms

        const promiseRealmDataArray : Promise<RealmData>[] = [];

        for(const realmIndexData of realmsIndexData){
            const promiseRealmData = getRealmData(realmIndexData.slug, realmApi)
            promiseRealmDataArray.push(promiseRealmData)
        }

        const realmDataArray = await Promise.all(promiseRealmDataArray)

        console.table(realmDataArray)

        for(const realmData of realmDataArray){
            console.log(realmData)
            const realmType = await createOrUpdateRealmType(realmData)
            console.log(realmType)
        }

    } catch (error) {
        
    }
}

updateDate()

/*

axios.request({
    url: '/oauth/token',
    method: 'post',
    baseURL: 'https://eu.battle.net/',
    auth: {
      username: "8028f870c3b347bdba96ec8559af19c3", // This is the client_id
      password: "6ZRjBNHRRMUTmJyTX7tVfWD00kSJ2aPm", // This is the client_secret
    },
    data: qs.stringify(grantType),
  }).then((response) => {
    console.log(response.data)

    const configuration : Configuration = new Configuration({
        accessToken: response.data.access_token,
        baseOptions: {
            timeout: 1000
        }
    });

    const realmApi : RealmApi = new RealmApi(configuration);

    const getRealmData = async (slug: string) => {

        while(true){
            try {
                const data = await realmApi.getRealmBySlug("dynamic-eu","eu", slug)
                return (data.data);
            } catch (error) {
                //console.log("Error get realm : " + slug)
            }
    
        }

    }

    realmApi.getRealmIndex("dynamic-eu","eu")
        .then((value) => {
            const toto : Promise<RealmData>[] = [];
            for(const realms of value.data.realms){
                toto.push(getRealmData(realms.slug))
            }
            Promise.all(toto).then((value) => {
                console.table(value)

                const realmRegions : RealmRegion[] = [];
                const realmTypes : RealmType[] = [];
                const realmCategorys : RealmCategory[] = [];
                
                let realmTypeId = 1;
                let realmCategoryId = 1;
                
                for(const realmData of value){
                    const realmRegionId = realmData.region.id;
                    const realmTypeType = realmData.type.type;
                    const RealmCategoryEnUs = realmData.category.en_US;

                    const containRealmRegion = realmRegions.some(element => {
                        if(element.id === realmRegionId){
                            return true;
                        }
                    })


                    if(!containRealmRegion){
                        const realmRegion = new RealmRegion({
                            id: realmRegionId,
                            ... getName(realmData.region.name)
                        })
                        realmRegions.push(realmRegion)
                        realmRegion.save()
                    }

                    const containRealmType = realmTypes.some(element => {
                        if(element.type === realmTypeType){
                            return true;
                        }
                    })

                    let tmpRealmTypeId: number;

                    if(!containRealmType){
                        const realmType = new RealmType({
                            id: realmTypeId,
                            type: realmTypeType,
                            ... getName(realmData.region.name)
                        })
                        tmpRealmTypeId = realmTypeId
                        realmTypeId = realmTypeId + 1;
                        realmTypes.push(realmType)
                        realmType.save()
                    } else {
                        const findElement = realmTypes.find(element => element.type === realmData.type.type)
                        tmpRealmTypeId = findElement !== undefined ? findElement.id : 1;
                    }

                    const containRealmCategory = realmCategorys.some(element => {
                        if(element.en_us === RealmCategoryEnUs){
                            return true;
                        }
                    })

                    let tmpRealmCategoryId: number;

                    if(!containRealmCategory){
                        const realmCategory = new RealmCategory({
                            id: realmCategoryId,
                            slug: realmData.category.en_US,
                            ... getName(realmData.category)
                        })
                        tmpRealmCategoryId = realmCategoryId
                        realmCategoryId = realmCategoryId + 1;
                        realmCategorys.push(realmCategory)
                        realmCategory.save()
                    } else {
                        const findElement = realmCategorys.find(element => element.slug === realmData.category.en_US)
                        tmpRealmCategoryId = findElement !== undefined ? findElement.id : 1;
                    }
                    
                    console.log(realmData)
                    console.log(tmpRealmCategoryId)
                    console.log(realmData.region.id)
                    console.log(tmpRealmTypeId)

                    const realm = new Realm({
                        id: realmData.id,
                        locale: realmData.locale,
                        slug: realmData.slug,
                        timezone: realmData.timezone,
                        realm_category_id: tmpRealmCategoryId,
                        realm_region_id: realmData.region.id,
                        realm_type_id: tmpRealmTypeId,
                        ... getName(realmData.category)
                    })

                    realm.save()
                }

            })

        }).catch((error) => {
            console.log("ERROR2")
            console.log(error)
            console.log("ERROR2")
        })


    }).catch((error) => {
    console.log("ERROR")
    })

*/