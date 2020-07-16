import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import { MapData } from "../models";
import RankingView from "../views/RankingView";
import {
  MapModelGetMapData,
  MapModelUpdateSelectedCountryID,
  RankingViewUpdateCountryID,
} from "../events";

export interface IRankingData {
  mapData: MapData,
}

export default class RankingController extends BaseController<MapModel, RankingView, IRankingData> {
  get elementId() {
    return "ranking";
  }

  registerHooks(): void {
    this.events.addEventListener(
      RankingViewUpdateCountryID,
      (id: string) => this.updateSelectedCountryID(id),
    );

    this.events.addEventListener(MapModelGetMapData, this.addMapData.bind(this));
  }

  updateSelectedCountryID(id: string) {
    this.events.triggerEvent(MapModelUpdateSelectedCountryID, { data: id });
  }

  addMapData(data: MapData) {
    if (typeof data === "object") {
      this.viewDataFields.addFieldData("mapData", data);
      this.updateView();
    }
  }
}
