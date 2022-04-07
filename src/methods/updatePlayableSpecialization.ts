import { Configuration, PlayableSpecializationApi, PlayableSpecializationData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import { PlayableClass } from "../models/PlayableClass";
import { PlayableSpecialization } from "../models/PlayableSpecialization";
import { SpecializationRole } from "../models/SpecializationRole";
import { getName } from "../updateStaticData";

export const updatePlayableSpecialization = async (configuration:Configuration) => {
    console.log("PLAYABLE_SPECIALIZATION : Start update")

    const playableSpecializationApi : PlayableSpecializationApi = new PlayableSpecializationApi(configuration);

    console.log("PLAYABLE_SPECIALIZATION : Start getPlayableSpecializationIndex")

    const playableSpecializationIndexResult = await playableSpecializationApi.getPlayableSpecializationIndex("static-eu","eu")

    console.log("PLAYABLE_SPECIALIZATION : End getPlayableSpecializationIndex")

    const playableSpecializationsIndexData = playableSpecializationIndexResult.data.character_specializations

    const promiseplayableSpecializationDataArray : Promise<PlayableSpecializationData>[] = [];

    console.log("PLAYABLE_SPECIALIZATION : Start getPlayableSpecializationData")

    for(const playableSpecializationIndexData of playableSpecializationsIndexData){
        const promiseplayableSpecializationData = getPlayableSpecializationData(playableSpecializationIndexData.id, playableSpecializationApi)
        promiseplayableSpecializationDataArray.push(promiseplayableSpecializationData)
    }

    const playableSpecializationDataArray = await Promise.all(promiseplayableSpecializationDataArray)

    console.log("PLAYABLE_SPECIALIZATION : End getPlayableSpecializationData")

    console.log("PLAYABLE_SPECIALIZATION : Start save data")

    
    for(const playableSpecializationData of playableSpecializationDataArray){
        const specializationRole = await createOrUpdateSpecilizationRole(playableSpecializationData);
        await createOrUpdatePlayableSpecialization(playableSpecializationData, specializationRole, playableSpecializationApi)
    }
    
    console.log("PLAYABLE_SPECIALIZATION : End save data")
}

const getPlayableSpecializationData = async (id: number, playableSpecializationApi: PlayableSpecializationApi) => {
    while(true){
        try {
            const data = await playableSpecializationApi.getPlayableSpecializationById("static-eu","eu", id)
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const getPlayableSpecializationMediaData = async (id: number, playableSpecializationApi: PlayableSpecializationApi) => {
    while(true){
        try {
            const data = await playableSpecializationApi.getPlayableSpecializationMediaById("static-eu","eu", id)
            return (data.data);
        } catch (error) {
            //console.log("Error get realm : " + slug)
        }
    }
}

const createOrUpdateSpecilizationRole = async (playableSpecializationData: PlayableSpecializationData) => {

    const specializationRoleData = playableSpecializationData.role;
    const count = await SpecializationRole.findAndCountAll()

    const [specializationRole] = await SpecializationRole.findOrCreate({
        where : {
            type: specializationRoleData.type
        },
        defaults: {
            id: (count.count + 1)
        }
    })

    Object.assign(specializationRole, getName(specializationRoleData.name))

    await specializationRole.save()

    return specializationRole
    
}

const createOrUpdatePlayableSpecialization = async (playableSpecializationData: PlayableSpecializationData, specializationRole: SpecializationRole, playableSpecializationApi: PlayableSpecializationApi) => {

    const mediaDataResult = await getPlayableSpecializationMediaData(playableSpecializationData.id, playableSpecializationApi);

    const mediaURL = mediaDataResult.assets[0].value

    const playableClass = await PlayableClass.findOne({
        where: {
            id: playableSpecializationData.playable_class.id
        }
    })

    if(playableClass === null){
        throw 'Error playable class not exist'
    }

    const [playableSpecialization] = await PlayableSpecialization.findOrCreate({
        where : {
            id: playableSpecializationData.id
        },
        defaults: {
            media_url: mediaURL,
            specialization_role_id: specializationRole.id,
            playable_class_id: playableClass.id
        }
    })

    playableSpecialization.media_url = mediaURL
    playableSpecialization.specialization_role_id = specializationRole.id,
    playableSpecialization.playable_class_id = playableClass.id

    Object.assign(playableSpecialization, getName(playableSpecializationData.name))

    await playableSpecialization.save()

    return playableSpecialization

}