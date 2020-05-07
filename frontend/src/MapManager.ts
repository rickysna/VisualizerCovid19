import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4core from "@amcharts/amcharts4/core";
import {HeatLegend, MapPolygonSeries} from "@amcharts/amcharts4/maps";
import {CountriesData} from "./models/MapData";

export class MapManager {
    static data:any[];
    static chart:any;
    static polygonSeries:MapPolygonSeries;
    static heatLegend: HeatLegend;
    static dataField:string;
    static createChart(htmlElement: string) {
        return this.chart = am4core.create(htmlElement, am4maps.MapChart);
    }
    static createPolygonSeries(renderData: CountriesData, dataFields: string) {
        // debugger;
        this.polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
        this.insertData(renderData, dataFields);
        return this.polygonSeries;
    }
    static createHeatLegend() {
        this.heatLegend = this.chart.createChild(am4maps.HeatLegend);
        this.heatLegend.series = this.polygonSeries;
        return this.heatLegend;
    }
    static insertData(renderData: CountriesData, dataFields: string) {
        this.polygonSeries.events.on("beforedatavalidated", () => {
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