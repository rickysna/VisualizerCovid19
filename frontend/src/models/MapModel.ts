import data from "../API/data";
import { CountriesData, MapData } from "./index";
import BaseModel from "./BaseModel";
import {
  MapModelDispatchCountriesData, MapModelDispatchCountriesDataByCases,
  MapModelDispatchMapData,
  MapModelGetCountriesData, MapModelGetCountriesDataByCases,
  MapModelGetMapData,
} from "../events";

export default class MapModel extends BaseModel<MapData> {
  registerHooks(): void {
    this.events.addEventListener(MapModelDispatchMapData, () => {
      const mapData = this.getMapData();
      this.events.triggerEvent(MapModelGetMapData, { data: mapData });
    });

    this.events.addEventListener(MapModelDispatchCountriesData, () => {
      const countriesData = this.getCountriesData();
      this.events.triggerEvent(MapModelGetCountriesData, { data: countriesData });
    });

    this.events.addEventListener(MapModelDispatchCountriesDataByCases, () => {
      const mapData = this.getCountriesDataSortByCases();
      this.events.triggerEvent(MapModelGetCountriesDataByCases, { data: mapData });
    });
  }

  fetchData() {
    return <Promise<MapData>>data.getMapData().catch(() => {
      //  update errors to the server
    });
  }

  getMapData(): MapData {
    return this.data;
  }

  getCountriesData(): CountriesData {
    return this.data.countries;
  }

  getCountriesDataSortByCases(): CountriesData[] {
    const countriesData = this.data.countries;

    return Object.values(countriesData).sort((va, vb) => {
      const vaIndex = Object.values(countriesData).indexOf(va);
      const vbIndex = Object.values(countriesData).indexOf(vb);
      const vaName = Object.keys(countriesData)[vaIndex];
      const vbName = Object.keys(countriesData)[vbIndex];
      const vaNameIndex = this.data.countriesSortedByActive.indexOf(vaName);
      const vbNameIndex = this.data.countriesSortedByActive.indexOf(vbName);

      return vaNameIndex < vbNameIndex ? -1 : 1;
    });
  }
}
