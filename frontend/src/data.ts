import {API} from "./models/MapData";

export async function getCountriesData():Promise<API> {
    return await fetch('http://localhost:3000/dev/api')
    // return await fetch('https://vq0rwefgvd.execute-api.us-east-1.amazonaws.com/dev/api')
        .then(result => result.json());
}