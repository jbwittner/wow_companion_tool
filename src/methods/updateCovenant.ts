import { Configuration, CovenantApi, IndexData, NameObjectData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { getName } from "../updateStaticData";
import { Covenant } from "../models/Covenant";

export const updateCovenant = async (configuration:Configuration) => {
    console.log("COVENANT : Start update")
    console.time("COVENANT")

    const covenantApi : CovenantApi = new CovenantApi(configuration);

    console.log("COVENANT : Start getCovenantIndex")

    const covenantIndexResult = await getCovenantIndex(covenantApi)

    console.log("COVENANT : End getCovenantIndex")

    const covenantsIndexData = covenantIndexResult.covenants

    if(covenantsIndexData === undefined){
        throw "Error covenant data"
    }

    console.log("COVENANT : Start save data")

    for(const covenantData of covenantsIndexData){
        await createOrUpdateCovenant(covenantData, covenantApi)
    }
    
    console.timeEnd("COVENANT")
    console.log("COVENANT : End save data")
}

const getCovenantIndex = async (covenantApi: CovenantApi) => {
    while(true){
        try {
            const data = await covenantApi.getCovenantIndex("static-eu","eu")
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const getCovenantMediaData = async (id: number, covenantApi: CovenantApi) => {
    while(true){
        try {
            const data = await covenantApi.getCovenantMediaById("static-eu","eu", id)
            const value = data.data.assets;
            if(value === undefined){
                throw "Error covenantMediaData"
            }
            return (value);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const createOrUpdateCovenant = async (covenantData: IndexData, covenantApi: CovenantApi) => {

    const mediaData = await getCovenantMediaData(covenantData.id, covenantApi);

    const [covenant] = await Covenant.findOrCreate({
        where : {
            id: covenantData.id
        },
        defaults: {
            media_url: mediaData[0].value
        }
    })

    covenant.media_url = mediaData[0].value

    Object.assign(covenant, getName(<NameObjectData> covenantData.name))

    await covenant.save()

    return covenant

}