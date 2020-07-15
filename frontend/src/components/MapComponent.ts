import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4cores from "@amcharts/amcharts4/core";
import { iRGB } from "@amcharts/amcharts4/.internal/core/utils/Colors";
import { Color } from "@amcharts/amcharts4/core";
import { MapPolygon } from "@amcharts/amcharts4/maps";
import BaseComponent from "./BaseComponent";
import { CountriesData, CountryData } from "../models";
// import Tooltip from "./map/Tooltip";
import { ChartComponentMoveAnimation } from "../events";
import * as tools from "../libs/tools";

interface IMapColorDefinitionParameter {
  itemsPercent: number, // <= 1 本分组占总数据句比例
  levelBasicColor: iRGB, // 当前分级基准颜色
}

interface IMapColorDefinition extends IMapColorDefinitionParameter {
  boundary: {
    min: number,
    max: number
  }
}

export default class MapComponent extends BaseComponent<am4maps.MapPolygonSeries> {
  mapColorDefinition: IMapColorDefinition[] = [];

  mapPolygons: {[key:string]: MapPolygon} = {};

  constructor(private renderData: CountriesData, private sortedData: CountryData[]) {
    super();
  }

  init(chart: am4maps.MapChart): this {
    this.target = chart.series.push(new am4maps.MapPolygonSeries());

    return this;
  }

  setConfiguration(): this {
    this.target.calculateVisualCenter = true;
    this.target.useGeodata = true;

    this.setColorDefinition();
    return this;
  }

  inject(): this {
    return this;
  }

  setStyles(): this {
    const strokeColor = am4cores.color("#450000"); // 区块边框颜色
    let backgroundColor = am4cores.color("#242424");

    this.target.mapPolygons.each((mapPolygon) => {
      // @ts-ignore
      const countryID = mapPolygon.dataItem.dataContext.id;
      const countryData = this.renderData[countryID];

      if (countryData) {
        const sortIndex = this.sortedData.length - this.sortedData.indexOf(countryData) - 1;
        backgroundColor = this.generateColorObject(sortIndex);
      }
      mapPolygon.fill = backgroundColor;
      mapPolygon.stroke = strokeColor;
      mapPolygon.strokeWidth = 0.1;
      mapPolygon.nonScalingStroke = true;

      mapPolygon.tooltip.background.disabled = true;
      mapPolygon.tooltipPosition = "fixed";
      mapPolygon.showTooltipOn = "hit";
      mapPolygon.tooltipHTML = this.getTooltipTemplate(countryData);

      this.mapPolygons[countryID] = mapPolygon;
    });

    return this;
  }

  registerHooks(): this {
    this.target.mapPolygons.template.events.on(
      "hit",
      (ev) => this.events.triggerEvent(ChartComponentMoveAnimation, { data: ev }),
    );

    this.target.events.on("inited", this.setStyles.bind(this));

    this.target.tooltip.events.onAll(
      (name, ev) => {
        this.centralizeTooltipPosition(ev);
        this.killToolTipAnimations(ev);
      },
    );

    this.target.tooltip.events.on("shown", (ev) => this.showTooltip(ev));

    this.target.tooltip.events.on("hidden", (ev) => this.hideTooltip(ev));

    return this;
  }

  private setColorDefinition() {
    const colorParams:IMapColorDefinitionParameter[] = [
      {
        itemsPercent: 0.4,
        levelBasicColor: {
          r: 100,
          g: 0,
          b: 0,
        },
      },
      {
        itemsPercent: 0.3,
        levelBasicColor: {
          r: 155,
          g: 0,
          b: 0,
        },
      },
      {
        itemsPercent: 0.25,
        levelBasicColor: {
          r: 200,
          g: 0,
          b: 0,
        },
      },
      {
        itemsPercent: 0.05,
        levelBasicColor: {
          r: 255,
          g: 0,
          b: 0,
        },
      },
    ];

    const countriesAmount = this.sortedData.length;
    let percentSub = 0;
    this.mapColorDefinition = colorParams.map((param) => {
      const minPercent = percentSub;
      percentSub += param.itemsPercent;
      const boundary = {
        min: Math.floor(countriesAmount * minPercent),
        max: Math.floor(countriesAmount * percentSub),
      };

      param.levelBasicColor.a = 1;

      return { ...param, boundary };
    });
  }

  private generateColorObject(index: number):Color {
    // eslint-disable-next-line no-restricted-syntax
    for (const element of this.mapColorDefinition) {
      const { min, max } = element.boundary;
      if (
        index >= element.boundary.min
        && index <= element.boundary.max
      ) {
        const alpha = ((index - min) / (max - min) / 2).toFixed(2);

        return am4cores.color({ ...element.levelBasicColor, a: Number(alpha) + 0.5 });
      }
    }
    return am4cores.color("#242424");
  }

  private getTooltipTemplate(data: CountryData | undefined) {
    if (!data || data.timeseries === undefined || data.reports === undefined) {
      return `
          <div class="earth-overlay">
              <img src="{flag}">
              <div class="title">
                  <span>
                      <em>{name}</em>
                      <span><br>
                          <span class="tiny">None</span>
                      </span>
                  </span>
              </div>
          </div>
      `;
    }

    const {
      flag, name, cases, reports, recovered,
    } = data;
    const { dates, confirmed, deaths } = data.timeseries;
    const lastDate = new Date(dates.slice(-1)[0]);
    const passedTime = tools.convertDateToString(tools.dateDiffer(lastDate));

    const rcDifference = confirmed.slice(-2).reduce((pre, cur) => cur - pre);
    const rcMathPrefix = rcDifference < 0 ? "" : "+";
    const rcDifferenceTemplate = rcDifference ? `<span class="changed">${rcMathPrefix}${rcDifference} <span class="time">(since ${passedTime})</span></span><br>` : "";

    const dcDifference = deaths.slice(-2).reduce((pre, cur) => cur - pre);
    const dcMathPrefix = dcDifference < 0 ? "" : "+";
    const dcDifferenceTemplate = dcDifference ? `<span class="changed">${dcMathPrefix}${dcDifference} <span class="time">(since ${passedTime})</span></span><br>` : "";

    return `
        <div class="earth-overlay">
            <img src="${flag}">
            <div class="title">
                <span>
                    <em>${name}</em>
                    <span><br>
                        <span class="tiny">${cases} total cases</span>
                    </span>
                </span>
            </div>
            <div class="info">
                <span><span class="_active">${reports}</span> active</span><br>
                ${rcDifferenceTemplate}
                <span><span class="_dead">${data.deaths}</span> deceased</span><br>
                ${dcDifferenceTemplate}
                <span><span class="_recovered">${recovered}</span> recovered</span><br>
            </div>
        </div>
    `;
  }

  private killToolTipAnimations(ev: any) {
    ev.target.animations.forEach((animation: any) => animation.kill());
  }

  private centralizeTooltipPosition(ev: any) {
    const boxSize = this.target.dom.getBBox();
    const x = boxSize.x + boxSize.width / 2;
    const y = boxSize.y + boxSize.height * 0.6;
    ev.target.dom.setAttribute("transform", `translate(${x},${y})`);
  }

  private showTooltip(ev: any) {
    ev.target.dom.querySelector("foreignObject").setAttribute("height", "100%");
    ev.target.opacity = 1;
  }

  private hideTooltip(ev: any) {
    ev.target.opacity = 0;
  }

  selectCountry(countryID: string) {
    const mapPolygon = this.mapPolygons[countryID];
    if (mapPolygon instanceof MapPolygon) {
      const eventPointerdown = new Event("pointerdown");
      const eventMouseenter = new Event("mouseenter");
      // @ts-ignore
      eventMouseenter.buttons = 0;
      // @ts-ignore
      eventMouseenter.which = 0;
      // @ts-ignore
      eventMouseenter.relatedTarget = null;
      mapPolygon.dom.dispatchEvent(eventPointerdown);
      document.dispatchEvent(eventMouseenter);
    }
  }
}
