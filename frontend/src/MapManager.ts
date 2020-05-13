import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4core from "@amcharts/amcharts4/core";
import {HeatLegend, MapPolygonSeries} from "@amcharts/amcharts4/maps";
import {CountriesData} from "./models/MapData";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
const newWindowObject = window as any;
const am3core:typeof am4core = newWindowObject.am4core;
const am3maps:typeof am4maps = newWindowObject.am4maps;
const am3themes_animated:typeof am4themes_animated = newWindowObject.am4themes_animated;
const am3geodata_worldLow:typeof am4geodata_worldLow = newWindowObject.am4geodata_worldLow;

const __useLocalModule__ = process.env.development;

export class MapManager {
    static libs = {
        am4maps: __useLocalModule__ ? am4maps : am3maps,
        am4core: __useLocalModule__ ? am4core: am3core,
        themes: {
            am4themes_animated: __useLocalModule__ ? am4themes_animated : am3themes_animated
        },
        geodata: {
            am4geodata_worldLow: __useLocalModule__ ? am4geodata_worldLow : am3geodata_worldLow
        }
    };
    static data:any[];
    static chart:any;
    static polygonSeries:MapPolygonSeries;
    static heatLegend: HeatLegend;
    static dataField:string;
    static createChart(htmlElement: string) {
        return this.chart = MapManager.libs.am4core.create(htmlElement, MapManager.libs.am4maps.MapChart);
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
    static sortDataByField(dataField: string):Promise<any[]> {
        if (this.data) return Promise.resolve(this.data);

        return new Promise((resolve, reject) => {
            const callback = () => {
                this.data = this.polygonSeries.data.filter(_data => _data[dataField] !== undefined);
                this.data.sort((a, b) => {
                    return a[dataField] - b[dataField];
                });
                resolve(this.data);
            };
            if (this.polygonSeries.inited) {
                callback();
            } else {
                this.polygonSeries.events.on('datavalidated', callback);
            }
        });
    }
}

MapManager.libs.am4core.useTheme(MapManager.libs.themes.am4themes_animated);