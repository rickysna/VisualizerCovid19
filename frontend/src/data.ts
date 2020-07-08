import axios from "axios";
import { API } from "./models/MapData";
import MapManager from "./MapManager";

function getCountriesData(): Promise<API> {
  let api = "https://3u4nbpkiqe.execute-api.us-east-1.amazonaws.com/dev/api";
  if (MapManager.dev) {
    api = `http://localhost:${process.env.API_PORT}/dev/api`;
  }

  return axios(api).then((result) => result.data);
}

export default {
  getCountriesData,
};
