import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import { CountriesData, CountryData } from "../models";
import RankingView from "../views/RankingView";
import {
  MapModelDispatchCountriesDataByCases, MapModelGetCountriesDataByCases,
  MapModelUpdateSelectedCountryID,
  RankingViewUpdateCountryID,
} from "../events";

export interface IRankingData {
  countries: CountryData[],
}

export default class RankingController extends BaseController<MapModel, RankingView, IRankingData> {
  get elementId() {
    return "ranking";
  }

  onReady() {
    this.events.triggerEvent(MapModelDispatchCountriesDataByCases);
  }

  registerHooks(): void {
    this.events.addEventListener(
      RankingViewUpdateCountryID,
      (id: string) => this.updateSelectedCountryID(id),
    );

    this.events.addEventListener(MapModelGetCountriesDataByCases, this.addCountriesData.bind(this));
  }

  updateSelectedCountryID(id: string) {
    this.events.triggerEvent(MapModelUpdateSelectedCountryID, { data: id });
  }

  addCountriesData(countries: CountriesData[]) {
    if (typeof countries === "object") {
      this.viewDataFields.addFieldData("countries", countries);
      this.updateView();
    }
  }
}
