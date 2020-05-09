/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {CountryPolygon} from "./Country";
import {Legend} from "./Legend";
import {FeatureCollection} from "@amcharts/amcharts4-geodata/.internal/Geodata";
import {Animation} from "@amcharts/amcharts4/.internal/core/utils/Animation";
import {MapManager} from "./MapManager";
import {CountriesData} from "./models/MapData";
import {AppManager} from "./AppManager";

am4core.useTheme(am4themes_animated);

export class Map {
    chart:any;
    animatable = false;
    scale:number = 0.6;
    constructor(data: CountriesData, dataField: string) {
        this.initial();
        this.limitVerticalRotate();
        this.automateRotateEarth();
        if (MapManager.chart) {
            new CountryPolygon(data, dataField);
            if (MapManager.polygonSeries) {
                new Legend(dataField);
            }
        }
        this.scaleMap();
    }
    initial() {
        this.chart = MapManager.createChart("chartdiv");
        this.chart.seriesWidth = 400;
        this.chart.seriesHeight = 400;
        this.setChartContinentsLevel(am4geodata_worldLow);
        this.setChartProjection();
        this.setChartPolygonColor();
        this.chart.deltaLongitude = 0;
        this.chart.deltaLatitude = 0;
        // 移动方式
        this.chart.panBehavior = "rotateLongLat";
    }
    setChartPolygonColor() {
        this.chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#000");
        this.chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.5;
    }
    // 地图类型
    setChartProjection() {
        this.chart.projection = new am4maps.projections.Orthographic();
    }
    // 地图细节还原程度
    setChartContinentsLevel(continents: FeatureCollection) {
        try {
            this.chart.geodata = continents || am4geodata_worldLow;
        } catch (e) {
            this.chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
        }
    }
    // limits vertical rotation
    limitVerticalRotate() {
        this.chart.adapter.add("deltaLatitude", (delatLatitude:any) => {
            return am4core.math.fitToRange(delatLatitude, -90, 90);
        });
    }
    // animation
    automateRotateEarth() {
        if (!this.animatable) return;

        let earthAnimateObj:Animation;

        (function loop(chart) {
            earthAnimateObj = chart.animate({
                from: 0,
                to: 360,
                property: "deltaLongitude",
            }, 50000, am4core.ease.linear);
            earthAnimateObj.events.on('animationended', () => loop(chart));
        })(this.chart);

        this.chart.seriesContainer.events.on("down", function() {
            earthAnimateObj && earthAnimateObj.kill();
        });
    }
    scaleMap() {
        this.chart.seriesContainer.events.on('ready', (ev:any) => {
            this.chart.events.disable();
            this.chart.seriesContainer.events.disable();
            const seriesElement = this.chart.seriesContainer.element;
            seriesElement.scale = this.scale;
            this.centralContainer();
            seriesElement.transform = this.centralContainer.bind(this, true);
            AppManager.events.triggerEvent('MapReady');
        });
    }
    centralContainer(setAttribute?:boolean) {
        const fullWidth = window.innerWidth;
        const fullHeight = window.innerHeight;
        const polygonBox = MapManager.polygonSeries.dom.getBBox();
        const seriesElement = this.chart.seriesContainer.element;
        const x = Math.ceil((fullWidth / 2) - (polygonBox.x * this.scale) - (polygonBox.width * this.scale / 2));
        const y = Math.ceil((fullHeight / 2) - (polygonBox.height * this.scale / 2));
        seriesElement.x = x;
        seriesElement.y = y;

        if (setAttribute) {
            seriesElement.node.setAttribute('transform', `translate(${x}, ${y}) scale(${this.scale})`);
        }
    }
}