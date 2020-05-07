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

am4core.useTheme(am4themes_animated);

export class Map {
    chart:any;
    animatable = false;
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
        this.chart.seriesContainer.element.scale = 0.8;
        this.chart.seriesContainer.events.on("transformed", () => {
            this.chart.seriesContainer.element.x = 100;
            this.chart.seriesContainer.element.y = 65;
        });

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
}