import {CountriesData} from "./models/MapData";

export async function getCountriesData():Promise<CountriesData> {
    return await fetch('http://localhost:3000/dev/api')
        .then(result => result.json());
}