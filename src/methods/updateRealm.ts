import { Configuration, RealmApi, RealmData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { Realm } from "../models/Realm";
import { RealmCategory } from "../models/RealmCategory";
import { RealmType } from "../models/RealmType";
import { getName } from "../updateStaticData";

export const updateRealms = async (configuration:Configuration) => {
    console.log("REALMS : Start update realms")
    console.time("REALMS")

    const realmApi : RealmApi = new RealmApi(configuration);

    console.log("REALMS : Start getRealmIndex")

    const realmIndexResult = await getRealmIndexData(realmApi)

    console.log("REALMS : End getRealmIndex")

    const realmsIndexData = realmIndexResult.realms

    const promiseRealmDataArray : Promise<RealmData>[] = [];

    console.log("REALMS : Start getRealmData")

    for(const realmIndexData of realmsIndexData){
        const promiseRealmData = getRealmData(realmIndexData.slug, realmApi)
        promiseRealmDataArray.push(promiseRealmData)
    }

    const realmDataArray = await Promise.all(promiseRealmDataArray)

    console.log("REALMS : End getRealmData")

    console.log("REALMS : Start save data")

    for(const realmData of realmDataArray){
        const realmTypePromise = createOrUpdateRealmType(realmData)
        const RealmCategoryPromise = createOrUpdateRealmCategory(realmData)
        const result = await Promise.all([realmTypePromise, RealmCategoryPromise])
        await createOrUpdateRealm(realmData,result[1],result[0])
    }

    console.timeEnd("REALMS")
    console.log("REALMS : End save data")
}

const getRealmIndexData = async (realmApi: RealmApi) => {
    while(true){
        try {
            const data = await realmApi.getRealmIndex("dynamic-eu","eu")
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

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

    const count = await RealmType.findAndCountAll()

    const [realmType] = await RealmType.findOrCreate({
        where : {
            type: typeData.type
        },
        defaults: {
            id: (count.count + 1)
        }
    })

    Object.assign(realmType, getName(typeData.name))

    await realmType.save()

    return realmType

}

const createOrUpdateRealmCategory = async (realmData: RealmData) => {

    const categoryData = realmData.category;

    const count = await RealmCategory.findAndCountAll()

    const [realmCategory] = await RealmCategory.findOrCreate({
        where : {
            slug: categoryData.en_US
        },
        defaults: {
            id: (count.count + 1)
        }
    })

    Object.assign(realmCategory, getName(categoryData))

    await realmCategory.save()

    return realmCategory

}

const createOrUpdateRealm = async (realmData: RealmData, realmCategory: RealmCategory, realmType: RealmType) => {

    const [realm] = await Realm.findOrCreate({
        where : {
            id: realmData.id
        },
        defaults: {
            locale: realmData.locale,
            realm_category_id: realmCategory.id,
            realm_type_id: realmType.id,
            timezone: realmData.timezone,
            slug: realmData.slug,
        }
    })

    realm.locale = realmData.locale
    realm.realm_category_id = realmCategory.id
    realm.realm_type_id = realmType.id
    realm.timezone = realmData.timezone
    realm.slug = realmData.slug

    Object.assign(realm, getName(realmData.name))

    await realm.save()

    return realm

}
