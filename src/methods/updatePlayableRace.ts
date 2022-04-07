import { Configuration, PlayableRaceApi, PlayableRaceData, PlayableSpecializationApi, PlayableSpecializationApiFp, PlayableSpecializationApiInterface, RealmApi, RealmData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { Faction } from "../models/Faction";
import { getName } from "../updateStaticData";

export const updatePlayableRace = async (configuration:Configuration) => {
    console.log("PLAYABLE_RACE : Start update")

    const playableRaceApi : PlayableRaceApi = new PlayableRaceApi(configuration);

    console.log("PLAYABLE_RACE : Start getPlayableRaceIndex")

    const playableRaceIndexResult = await playableRaceApi.getPlayableRaceIndex("static-eu","eu")

    console.log("PLAYABLE_RACE : End getPlayableRaceIndex")

    const playableRacesIndexData = playableRaceIndexResult.data.races

    const promisePlayableRaceDataArray : Promise<PlayableRaceData>[] = [];

    console.log("PLAYABLE_RACE : Start getPlayableRaceData")

    for(const playableRaceIndexData of playableRacesIndexData){
        const promisePlayableRaceData = getPlayableRaceData(playableRaceIndexData.id, playableRaceApi)
        promisePlayableRaceDataArray.push(promisePlayableRaceData)
    }

    const playableRaceDataArray = await Promise.all(promisePlayableRaceDataArray)

    console.log("PLAYABLE_RACE : End getPlayableRaceData")

    console.log("PLAYABLE_RACE : Start save data")

    for(const playableRaceData of playableRaceDataArray){
        await createOrUpdatePlayableRace(playableRaceData)
    }

    console.log("PLAYABLE_RACE : End save data")
}

const getPlayableRaceData = async (id: number, playableRaceApi: PlayableRaceApi) => {
    while(true){
        try {
            const data = await playableRaceApi.getPlayableRaceById("static-eu","eu", id)
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const createOrUpdatePlayableRace = async (playableRaceData: PlayableRaceData) => {

    const factionData = playableRaceData.faction;

    const count = await Faction.findAndCountAll()

    const [faction] = await Faction.findOrCreate({
        where : {
            type: factionData.type
        },
        defaults: {
            id: (count.count + 1)
        }
    })

    Object.assign(faction, getName(factionData.name))

    await faction.save()

    return faction

}