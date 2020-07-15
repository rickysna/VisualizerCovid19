import BaseController from "./BaseController";
import * as tools from "../libs/tools";
import MapModel from "../models/MapModel";
import FooterView from "../views/FooterView";
import { MapData, Worldwide } from "../models";
import { MapModelDispatchMapData, MapModelGetMapData } from "../events";

export interface IFooterData {
  totalCases: number,
  totalCount: number,
  totalDeaths: number,
  totalRecovered: number,
  mortalityRate: string,
  recoveryRate: string,
  timestampString: string,
  timestamp: string,
  totalRecords: Worldwide
}

export default class FooterController extends BaseController<MapModel, FooterView, IFooterData> {
  get elementId() {
    return "footer";
  }

  get immediateRender() {
    return false;
  }

  onReady() {
    this.events.triggerEvent(MapModelDispatchMapData);
  }

  registerHooks() {
    this.events.addEventListener(MapModelGetMapData, this.handleMapData.bind(this));
  }

  handleMapData = ({ timestamp, worldwide }: MapData) => {
    this.viewDataFields.addFieldData("timestamp", timestamp);
    this.viewDataFields.addFieldData("totalRecords", worldwide);

    const { deaths, reports, recovered } = worldwide;
    const totalCases = tools.formatNumber(reports - recovered - deaths);
    const totalCount = tools.formatNumber(reports);
    const totalDeaths = tools.formatNumber(deaths);
    const totalRecovered = tools.formatNumber(recovered);
    const mortalityRate = `(${Math.ceil((deaths / reports) * 10000) / 100})%`;
    const recoveryRate = `(${Math.ceil((recovered / reports) * 10000) / 100})%`;
    const timestampString = tools.convertDateToString(tools.dateDiffer(new Date(timestamp)));

    this.viewDataFields.addFieldData({
      totalCases,
      totalCount,
      totalDeaths,
      totalRecovered,
      mortalityRate,
      recoveryRate,
      timestampString,
    });

    this.updateView();
  }
}
