import { Configuration, NameObjectData, PlayableClassApi, PlayableClassData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { PlayableClass } from "../models/PlayableClass";
import { getName } from "../updateStaticData";

export const updatePlayableClass = async (configuration:Configuration) => {
    console.log("PLAYABLE_CLASS : Start update")
    console.time("PLAYABLE_CLASS")

    const playableClassApi : PlayableClassApi = new PlayableClassApi(configuration);

    console.log("PLAYABLE_CLASS : Start getPlayableClassIndex")

    const playableClassIndexResult = await getPlayableClassIndexData(playableClassApi)

    console.log("PLAYABLE_CLASS : End getPlayableClassIndex")

    const playableClasssIndexData = playableClassIndexResult.classes

    const promiseplayableClassDataArray : Promise<PlayableClassData>[] = [];

    console.log("PLAYABLE_CLASS : Start getPlayableClassData")

    for(const playableClassIndexData of playableClasssIndexData){
        const promiseplayableClassData = getPlayableClassData(playableClassIndexData.id, playableClassApi)
        promiseplayableClassDataArray.push(promiseplayableClassData)
    }

    const playableClassDataArray = await Promise.all(promiseplayableClassDataArray)

    console.log("PLAYABLE_CLASS : End getPlayableClassData")

    console.log("PLAYABLE_CLASS : Start save data")

    for(const playableClassData of playableClassDataArray){
        await createOrUpdatePlayableClass(playableClassData, playableClassApi)
    }
    
    console.timeEnd("PLAYABLE_CLASS")
    console.log("PLAYABLE_CLASS : End save data")
}

const getPlayableClassIndexData = async (playableClassApi: PlayableClassApi) => {
    while(true){
        try {
            const data = await playableClassApi.getPlayableClassIndex("static-eu","eu")
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const getPlayableClassData = async (id: number, playableClassApi: PlayableClassApi) => {
    while(true){
        try {
            const data = await playableClassApi.getPlayableClassById("static-eu","eu", id)
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const getPlayableClassMediaData = async (id: number, playableClassApi: PlayableClassApi) => {
    while(true){
        try {
            const data = await playableClassApi.getPlayableClassMediaById("static-eu","eu", id)
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const createOrUpdatePlayableClass = async (playableClassData: PlayableClassData, playableClassApi: PlayableClassApi) => {

    const mediaData = await getPlayableClassMediaData(playableClassData.id, playableClassApi);

    const [playableClass] = await PlayableClass.findOrCreate({
        where : {
            id: playableClassData.id
        },
        defaults: {
            media_url: mediaData.assets[0].value
        }
    })

    playableClass.media_url = mediaData.assets[0].value

    Object.assign(playableClass, getName(<NameObjectData> playableClassData.name))

    await playableClass.save()

    return playableClass

}