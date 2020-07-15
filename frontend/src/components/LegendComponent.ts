import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import { ValueAxisDataItem } from "@amcharts/amcharts4/charts";
import BaseComponent from "./BaseComponent";
import * as tools from "../libs/tools";

export default class LegendComponent extends BaseComponent<am4maps.HeatLegend> {
  private axisRangeLabels: {
    minRange: ValueAxisDataItem,
    maxRange: ValueAxisDataItem,
  };

  constructor(public min: number, public max:number) {
    super();
  }

  init(chart: am4maps.MapChart):this {
    this.target = chart.createChild(am4maps.HeatLegend);

    return this;
  }

  setConfiguration(polygonSeries: am4maps.MapPolygonSeries): this {
    this.target.series = polygonSeries;

    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color({
        r: 100,
        g: 0,
        b: 0,
      }),
      max: am4core.color({
        r: 255,
        g: 0,
        b: 0,
      }),
    });

    const minRange = this.target.valueAxis.axisRanges.create();
    minRange.value = this.min;
    minRange.label.text = this.min.toString();

    const maxRange = this.target.valueAxis.axisRanges.create();
    maxRange.value = this.max;
    maxRange.label.text = tools.formatNumber(this.max);

    this.axisRangeLabels = { minRange, maxRange };
    return this;
  }

  inject(): this {
    // Blank out internal heat legend value axis labels
    this.target.valueAxis.renderer.labels.template.adapter.add("text", () => "");
    return this;
  }

  setStyles(): this {
    this.target.align = "right";
    this.target.width = 250;
    this.target.marginRight = -80;
    this.target.marginBottom = -40;
    this.target.valign = "bottom";

    const labelColor = am4core.color("#fff");
    this.axisRangeLabels.minRange.label.fill = labelColor;
    this.axisRangeLabels.maxRange.label.fill = labelColor;


    const markersTemplate = this.target.markers.template;
    markersTemplate.stroke = am4core.color("#bab89b");
    markersTemplate.cornerRadius(4, 4, 4, 4);

    return this;
  }

  registerHooks(): this {
    this.target.events.on("ready", () => {
      const containerSize = this.target.dom.getBBox();
      const labelSize = this.axisRangeLabels.maxRange.label.dom.getBBox();
      this.axisRangeLabels.maxRange.label.x = containerSize.width - (labelSize.width / 2);
    });
    return this;
  }
}
