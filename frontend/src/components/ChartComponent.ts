import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
// eslint-disable-next-line camelcase
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { MapPolygon } from "@amcharts/amcharts4/maps";
import BaseComponent from "./BaseComponent";
import { ChartComponentMoveAnimation } from "../events";
import { TDisplayModel } from "../views/ChartView";

export default class ChartComponent extends BaseComponent<am4maps.MapChart> {
  init(elementId: string): this {
    this.target = am4core.create(elementId, am4maps.MapChart);

    return this;
  }

  setConfiguration(): this {
    try {
      // eslint-disable-next-line camelcase
      this.target.geodata = am4geodata_worldLow;
    } catch (e) {
      this.target.raiseCriticalError(
        new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."),
      );
    }

    this.target.projection = new am4maps.projections.Orthographic();

    this.target.deltaLongitude = 0;
    this.target.deltaLatitude = 0;
    // 移动方式
    this.target.panBehavior = "rotateLongLat";

    this.target.adapter.add("deltaLatitude", (delatLatitude: number) => am4core.math.fitToRange(delatLatitude, -90, 90));

    return this;
  }

  inject(): this {
    return this;
  }

  setStyles(): this {
    this.target.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#000");
    this.target.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.5;
    // this.target.padding(90, 160, 90, 0);

    return this;
  }

  registerHooks(): this {
    this.events.addEventListener(
      ChartComponentMoveAnimation,
      this.onCountryPolygonClicked.bind(this),
    );

    return this;
  }

  onCountryPolygonClicked(polygon: MapPolygon) {
    const { visualLongitude, visualLatitude } = polygon;
    // rotate to country's location
    this.target.animate([{
      to: -visualLongitude,
      property: "deltaLongitude",
    }, {
      to: -visualLatitude,
      property: "deltaLatitude",
    }], 1000, am4core.ease.linear);
    this.target.goHome();
  }

  onResize(model: TDisplayModel) {
    if (model === "desktop") {
      this.target.padding(90, 100, 90, 30);
    } else if (model === "mobile") {
      this.target.padding(80, 0, 80, 0);
    }
  }
}
