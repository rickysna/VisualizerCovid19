import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import { CountryData } from "../models";
import RankingView from "../views/RankingView";

export interface IRankingData {
  countries: CountryData[],
}

export default class RankingController extends BaseController<MapModel, RankingView, IRankingData> {
  get elementId() {
    return "ranking";
  }

  onReady() {
    const countries = this.model.getCountriesDataSortByCases();

    this.viewDataFields.addFieldData("countries", countries);

    this.updateView();
  }
}
