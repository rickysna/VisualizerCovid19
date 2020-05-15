import {API} from "./models/MapData";
import {MapManager} from "./MapManager";

export async function getCountriesData():Promise<API> {
    let api = 'https://3u4nbpkiqe.execute-api.us-east-1.amazonaws.com/dev/api';
    if (MapManager.__useLocalModule__) {
        api = 'http://localhost:3000/dev/api';
    }

    return await fetch(api)
        .then(result => result.json());
}