import { Configuration, NameData } from "@jbwittner/blizzardswagger_wow-retail-api_typescript-axios";
import axios from "axios";
import * as qs from 'query-string'
import { updatePlayableRace } from "./updatePlayableRace";
import { updateRealms } from "./updateRealm";

export const getName = (data: NameData) => {
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

const grantType = {
    grant_type: 'client_credentials',
  };

async function updateDate() {
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

    //await updateRealms(configuration)
    //await updatePlayableRace(configuration)
}

updateDate().then(() => {
    console.log("END OK")
}).catch((error) => {
    console.error(error)
    console.log("END KO")
}).finally(() => {
    console.log("finally")
})