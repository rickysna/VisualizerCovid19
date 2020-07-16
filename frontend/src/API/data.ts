import axios from "axios";
import { MapData } from "../models";
// import MapManager from "../controllers/MapManager";

function getMapData(): Promise<MapData> {
  const api = `http://${document.domain}:${process.env.API_PORT}/dev/api`;

  // let api = "https://3u4nbpkiqe.execute-api.us-east-1.amazonaws.com/dev/api";
  // if (MapManager.dev) {
  //   api = `http://localhost:${process.env.API_PORT}/dev/api`;
  // }

  return axios(api).then((result) => result.data);
}

export default {
  getMapData,
};
