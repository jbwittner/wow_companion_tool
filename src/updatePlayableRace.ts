import { Configuration, PlayableRaceApi, PlayableRaceData, RealmApi, RealmData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { getName } from ".";
import { Faction } from "./models/Faction";
import { PlayableRace } from "./models/PlayableRace";
import { Realm } from "./models/Realm";
import { RealmCategory } from "./models/RealmCategory";
import { RealmType } from "./models/RealmType";

export const updatePlayableRace = async (configuration:Configuration) => {
    console.log("PLAYABLE_RACE : Start update playable races")

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
        const faction = await createOrUpdateFaction(playableRaceData)
        await createOrUpdateRace(playableRaceData, faction)
    }

    console.log("REALMS : End save data")
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

const createOrUpdateFaction = async (playableRaceData: PlayableRaceData) => {

    const factionData = playableRaceData.faction;

    const count = await Faction.findAndCountAll()

    const result = await Faction.findOrCreate({
        where : {
            type: factionData.type
        },
        defaults: {
            id: (count.count + 1)
        }
    })

    const faction = result[0]

    Object.assign(faction, getName(factionData.name))

    await faction.save()

    return faction

}

const createOrUpdateRace = async (playableRaceData: PlayableRaceData, faction: Faction) => {
    
    const result = await PlayableRace.findOrCreate({
        where : {
            id: playableRaceData.id
        },
        defaults: {
            faction_id: faction.id
        }
    })

    const playableRace = result[0]

    if(result[1] === false){
        playableRace.faction_id = faction.id
    }

    Object.assign(playableRace, getName(playableRaceData.name))

    await playableRace.save()
}