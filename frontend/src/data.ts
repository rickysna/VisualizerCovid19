import {API} from "./models/MapData";
import {MapManager} from "./MapManager";
import axios from "axios";

export async function getCountriesData():Promise<API> {
    let api = 'https://3u4nbpkiqe.execute-api.us-east-1.amazonaws.com/dev/api';
    if (MapManager.__dev__) {
        api = `http://localhost:${process.env.API_PORT}/dev/api`;
    }

    return await axios(api)
        .then(result => result.data);
}