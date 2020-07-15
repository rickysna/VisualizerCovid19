import data from "../API/data";
import { CountriesData, MapData } from "./index";
import BaseModel from "./BaseModel";
import {
  MapModelDispatchCountriesData, MapModelDispatchCountriesDataByCases,
  MapModelDispatchMapData,
  MapModelGetCountriesData, MapModelGetCountriesDataByCases,
  MapModelGetMapData, MapModelGetSelectedCountryID, MapModelUpdateSelectedCountryID,
} from "../events";

export default class MapModel extends BaseModel<MapData> {
  selectedCountryId: string;

  registerHooks(): void {
    this.events.addEventListener(MapModelDispatchMapData, () => this.getMapData());

    this.events.addEventListener(MapModelDispatchCountriesData, () => this.getCountriesData());

    this.events.addEventListener(MapModelDispatchCountriesDataByCases, () => this.getCountriesDataSortByCases());

    this.events.addEventListener(MapModelUpdateSelectedCountryID, (id: string) => this.updateSelectedCountryID(id));
  }

  fetchData() {
    return <Promise<MapData>>data.getMapData().catch(() => {
      //  update errors to the server
    });
  }

  getMapData() {
    this.events.triggerEvent(MapModelGetMapData, { data: this.data });
  }

  getCountriesData() {
    this.events.triggerEvent(MapModelGetCountriesData, { data: this.data.countries });
  }

  getCountriesDataSortByCases() {
    const countriesData = this.data.countries;

    const sortedData:CountriesData[] = Object.values(countriesData).sort((va, vb) => {
      const vaIndex = Object.values(countriesData).indexOf(va);
      const vbIndex = Object.values(countriesData).indexOf(vb);
      const vaName = Object.keys(countriesData)[vaIndex];
      const vbName = Object.keys(countriesData)[vbIndex];
      const vaNameIndex = this.data.countriesSortedByActive.indexOf(vaName);
      const vbNameIndex = this.data.countriesSortedByActive.indexOf(vbName);

      return vaNameIndex < vbNameIndex ? -1 : 1;
    });

    this.events.triggerEvent(MapModelGetCountriesDataByCases, { data: sortedData });
  }

  updateSelectedCountryID(id: string) {
    if (id) {
      this.selectedCountryId = id;
      this.events.triggerEvent(MapModelGetSelectedCountryID, { data: id });
    }
  }
}
