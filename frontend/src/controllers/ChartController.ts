import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import ChartView from "../views/ChartView";
import {
  MapModelGetMapData,
  MapModelGetSelectedCountryID,
} from "../events";
import { MapData } from "../models";

export interface IChartData {
  mapData: MapData,
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

    this.events.addEventListener(MapModelGetMapData, this.addMapData.bind(this));
  }

  onReady(): void {
    this.updateView();
  }

  selectCountry(id: string) {
    this.view.selectCountry(id);
  }

  addMapData(data: MapData) {
    if (typeof data === "object") {
      this.viewDataFields.addFieldData("mapData", data);
    }
  }
}
