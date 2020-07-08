/* Imports */
import { FeatureCollection } from "@amcharts/amcharts4-geodata/.internal/Geodata";
import { Animation } from "@amcharts/amcharts4/.internal/core/utils/Animation";
import CountryPolygon from "./Country";
import Legend from "./Legend";
import MapManager from "../../controllers/MapManager";
import { CountriesData } from "../../models";
import AppManager from "../../controllers/AppManager";
import particles from "../../views/particles";

export default class Map {
    chart:any;

    animatable = false;

    scale:number = 0.7;

    countryPolygon: CountryPolygon;

    legend: Legend;

    constructor(data: CountriesData, dataField: string) {
      this.initial();
      this.limitVerticalRotate();
      this.automateRotateEarth();
      if (MapManager.chart) {
        this.countryPolygon = new CountryPolygon(data, dataField);
        if (MapManager.polygonSeries) {
          this.legend = new Legend(dataField);
        }
      }
      this.scaleMap(this.scale);
    }

    initial() {
      Map.initialBackground();
      this.chart = MapManager.createChart("chartdiv");
      this.chart.seriesWidth = 400;
      this.chart.seriesHeight = 400;
      this.setChartContinentsLevel(MapManager.libs.geodata.am4geodata_worldLow);
      this.setChartProjection();
      this.setChartPolygonColor();
      this.chart.deltaLongitude = 0;
      this.chart.deltaLatitude = 0;
      // 移动方式
      this.chart.panBehavior = "rotateLongLat";

      window.onresize = () => {
        if (window.innerWidth > 1000) {
          this.scaleMap(this.scale = 0.7);
        } else {
          this.scaleMap(this.scale = 0.6);
        }
      };
    }

    static initialBackground() {
      particles("particles-js");
    }

    setChartPolygonColor() {
      this.chart.backgroundSeries.mapPolygons.template.polygon.fill = MapManager.libs.am4core.color("#000");
      this.chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.5;
    }

    // 地图类型
    setChartProjection() {
      this.chart.projection = new MapManager.libs.am4maps.projections.Orthographic();
    }

    // 地图细节还原程度
    setChartContinentsLevel(continents: FeatureCollection) {
      try {
        this.chart.geodata = continents;
      } catch (e) {
        this.chart.raiseCriticalError(
          new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."),
        );
      }
    }

    // limits vertical rotation
    limitVerticalRotate() {
      this.chart.adapter.add("deltaLatitude", (delatLatitude:any) => {
        MapManager.libs.am4core.math.fitToRange(delatLatitude, -90, 90);
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
        }, 50000, MapManager.libs.am4core.ease.linear);
        earthAnimateObj.events.on("animationended", () => loop(chart));
      }(this.chart));

      this.chart.seriesContainer.events.on("down", () => {
        if (earthAnimateObj) earthAnimateObj.kill();
      });
    }

    scaleMap(scale: number) {
      const promise = new Promise((resolve) => {
        if (this.chart.seriesContainer.isReady()) {
          resolve();
        } else {
          this.chart.seriesContainer.events.on("ready", (ev: any) => {
            resolve();
          });
        }
      });

      promise.then(() => {
        this.chart.events.disable();
        this.chart.seriesContainer.events.disable();
        const seriesElement = this.chart.seriesContainer.element;
        seriesElement.scale = scale;
        this.centralContainer(scale);
        seriesElement.transform = this.centralContainer.bind(this, scale, true);
        AppManager.events.triggerEvent("MapReady");
      });
    }

    centralContainer(scale: number, setAttribute?:boolean) {
      const fullWidth = window.innerWidth;
      const fullHeight = window.innerHeight;
      const polygonBox = MapManager.polygonSeries.dom.getBBox();
      const seriesElement = this.chart.seriesContainer.element;
      const x = Math.ceil((fullWidth / 2) - (polygonBox.x * scale) - 50);
      const y = Math.ceil((fullHeight / 2) - (polygonBox.height * scale / 2));
      seriesElement.x = x;
      seriesElement.y = y;

      if (setAttribute) {
        seriesElement.node.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);
      }
    }
}
