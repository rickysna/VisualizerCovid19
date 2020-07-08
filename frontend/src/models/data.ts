import axios from "axios";
import { MapData } from "./index";
import MapManager from "../controllers/MapManager";

function getCountriesData(): Promise<MapData> {
  let api = "https://3u4nbpkiqe.execute-api.us-east-1.amazonaws.com/dev/api";
  if (MapManager.dev) {
    api = `http://localhost:${process.env.API_PORT}/dev/api`;
  }

  return axios(api).then((result) => result.data);
}

export default {
  getCountriesData,
};
