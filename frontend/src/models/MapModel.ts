import data from "../API/data";
import { MapData } from "./index";
import BaseModel, { preRequest } from "./BaseModel";
import {
  MapModelDispatchCountriesData,
  MapModelDispatchMapData,
  MapModelGetCountriesData,
  MapModelGetMapData, MapModelGetSelectedCountryID, MapModelUpdateSelectedCountryID,
} from "../events";

export default class MapModel extends BaseModel<MapData> {
  selectedCountryId: string;

  registerHooks(): void {
    this.events.addEventListener(MapModelDispatchMapData, () => this.getMapData());

    this.events.addEventListener(MapModelDispatchCountriesData, () => this.getCountriesData());

    this.events.addEventListener(MapModelUpdateSelectedCountryID, (id: string) => this.updateSelectedCountryID(id));
  }

  fetchData() {
    return <Promise<MapData>>data.getMapData().catch(() => {
      //  update errors to the server
    });
  }

  @preRequest
  getMapData() {
    this.events.triggerEvent(MapModelGetMapData, { data: this.data });
  }

  @preRequest
  getCountriesData() {
    this.events.triggerEvent(MapModelGetCountriesData, { data: this.data.countries });
  }

  updateSelectedCountryID(id: string) {
    if (id) {
      this.selectedCountryId = id;
      this.events.triggerEvent(MapModelGetSelectedCountryID, { data: id });
    }
  }
}
