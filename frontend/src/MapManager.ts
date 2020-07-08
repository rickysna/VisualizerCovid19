import { HeatLegend, MapPolygonSeries } from "@amcharts/amcharts4/maps";
import { CountriesData } from "./models";

const { dev } = process.env;

const newWindowObject = window as any;
const am4maps: typeof import("@amcharts/amcharts4/maps") = dev ? require("@amcharts/amcharts4/maps") : newWindowObject.am4maps;
const am4core: typeof import("@amcharts/amcharts4/core") = dev ? require("@amcharts/amcharts4/core") : newWindowObject.am4core;
// eslint-disable-next-line camelcase
const am4themes_animated = dev ? require("@amcharts/amcharts4/themes/animated").default : newWindowObject.am4themes_animated;
// eslint-disable-next-line camelcase
const am4geodata_worldLow = dev ? require("@amcharts/amcharts4-geodata/worldLow").default : newWindowObject.am4geodata_worldLow;

export default class MapManager {
  static dev = dev;

  static libs = {
    am4maps,
    am4core,
    themes: { am4themes_animated },
    geodata: { am4geodata_worldLow },
  };

  static data: any[];

  static chart: any;

  static polygonSeries: MapPolygonSeries;

  static heatLegend: HeatLegend;

  static dataField: string;

  static createChart(htmlElement: string) {
    this.chart = MapManager.libs.am4core.create(htmlElement, MapManager.libs.am4maps.MapChart);
    return this.chart;
  }

  static createPolygonSeries(renderData: CountriesData, dataFields: string) {
    // debugger;
    this.polygonSeries = this.chart.series.push(new MapManager.libs.am4maps.MapPolygonSeries());
    this.insertData(renderData, dataFields);
    return this.polygonSeries;
  }

  static createHeatLegend() {
    this.heatLegend = this.chart.createChild(MapManager.libs.am4maps.HeatLegend);
    this.heatLegend.series = this.polygonSeries;
    return this.heatLegend;
  }

  static insertData(renderData: CountriesData, dataFields: string) {
    this.polygonSeries.events.once("beforedatavalidated", () => {
      this.polygonSeries.data = this.polygonSeries.data.map((data) => {
        const apiData = renderData[data.id] || {};
        return Object.assign(apiData, data);
      });
      this.dataField = dataFields;
    });
  }

  static sortDataByField(dataField: string): Promise<any[]> {
    if (this.data) return Promise.resolve(this.data);

    return new Promise((resolve) => {
      const callback = () => {
        this.data = this.polygonSeries.data.filter((_data) => _data[dataField] !== undefined);
        this.data.sort((a, b) => a[dataField] - b[dataField]);
        resolve(this.data);
      };
      if (this.polygonSeries.inited) {
        callback();
      } else {
        this.polygonSeries.events.on("datavalidated", callback);
      }
    });
  }
}

MapManager.libs.am4core.useTheme(MapManager.libs.themes.am4themes_animated);
