import type { HeatLegend, MapChart, MapPolygonSeries } from "@amcharts/amcharts4/maps";
import type { ValueAxisDataItem } from "@amcharts/amcharts4/charts";
import { am4core, am4maps } from "../libs/am4chart";
import BaseComponent from "./BaseComponent";
import * as tools from "../libs/tools";
import { TDisplayModel } from "../views/ChartView";

export default class LegendComponent extends BaseComponent<HeatLegend> {
  private axisRangeLabels: {
    minRange: ValueAxisDataItem,
    maxRange: ValueAxisDataItem,
  };

  constructor(public min: number, public max:number) {
    super();
  }

  init(chart: MapChart):this {
    this.target = chart.createChild(am4maps.HeatLegend);

    return this;
  }

  setConfiguration(polygonSeries: MapPolygonSeries): this {
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
    this.target.marginRight = -40;
    this.target.marginBottom = -60;
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
      const minRangeLabelX = 10;
      const maxRangeLabelX = containerSize.width - labelSize.width - 10;
      const labelY = -20;
      this.axisRangeLabels.minRange.label.dom.setAttribute("transform", `translate(${minRangeLabelX}, ${labelY})`);
      this.axisRangeLabels.maxRange.label.dom.setAttribute("transform", `translate(${maxRangeLabelX}, ${labelY})`);
    });
    return this;
  }

  onResize(model: TDisplayModel) {
    if (model === "desktop") {
      this.target.visible = true;
    } else if (model === "mobile") {
      this.target.visible = false;
    }
  }
}
