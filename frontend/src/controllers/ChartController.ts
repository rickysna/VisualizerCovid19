import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import ChartView from "../views/ChartView";
import {
  MapModelDispatchCountriesData, MapModelDispatchCountriesDataByCases,
  MapModelGetCountriesData,
  MapModelGetCountriesDataByCases,
  MapModelGetSelectedCountryID,
} from "../events";
import { CountriesData, CountryData } from "../models";

export interface IChartData {
  countries: CountriesData,
  sortedCountries: CountryData[]
}

export default class ChartController extends BaseController<MapModel, ChartView, IChartData> {
  get elementId() {
    return "chartdiv";
  }

  get immediateRender() {
    return false;
  }

  registerHooks() {
    this.events.addEventListener(MapModelGetSelectedCountryID, this.selectCountry.bind(this));

    this.events.addEventListener(MapModelGetCountriesData, this.addCountriesData.bind(this, "countries"));

    this.events.addEventListener(MapModelGetCountriesDataByCases, this.addCountriesData.bind(this, "sortedCountries"));
  }

  onReady(): void {
    this.events.triggerEvent(MapModelDispatchCountriesData);
    this.events.triggerEvent(MapModelDispatchCountriesDataByCases);

    this.updateView();
  }

  selectCountry(id: string) {
    this.view.selectCountry(id);
  }

  addCountriesData(fieldName: string, data: CountriesData) {
    if (typeof data === "object") {
      this.viewDataFields.addFieldData(fieldName, data);
    }
  }
}
