import { Configuration, PlayableRaceApi, PlayableRaceData, PlayableSpecializationApi, PlayableSpecializationApiFp, PlayableSpecializationApiInterface, RealmApi, RealmData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { Faction } from "../models/Faction";
import { PlayableRace } from "../models/PlayableRace";
import { getName } from "../updateStaticData";

export const updatePlayableRace = async (configuration:Configuration) => {
    console.log("PLAYABLE_RACE : Start update")
    console.time("PLAYABLE_RACE")

    const playableRaceApi : PlayableRaceApi = new PlayableRaceApi(configuration);

    console.log("PLAYABLE_RACE : Start getPlayableRaceIndex")

    const playableRaceIndexResult = await getPlayableRaceIndex(playableRaceApi)

    console.log("PLAYABLE_RACE : End getPlayableRaceIndex")

    const playableRacesIndexData = playableRaceIndexResult.races

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
        const faction = await createOrUpdateFaction(playableRaceData)
        await createOrUpdatePlayableRace(playableRaceData, faction)
    }

    console.timeEnd("PLAYABLE_RACE")
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

const getPlayableRaceIndex = async (playableRaceApi: PlayableRaceApi) => {
    while(true){
        try {
            const data = await playableRaceApi.getPlayableRaceIndex("static-eu","eu")
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const createOrUpdateFaction = async (playableRaceData: PlayableRaceData) => {

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

const createOrUpdatePlayableRace = async (playableRaceData: PlayableRaceData, faction: Faction) => {

    const [playableRace] = await PlayableRace.findOrCreate({
        where : {
            id: playableRaceData.id
        },
        defaults: {
            faction_id: faction.id
        }
    })

    playableRace.faction_id = faction.id

    Object.assign(playableRace, getName(playableRaceData.name))

    await playableRace.save()

    return playableRace

}