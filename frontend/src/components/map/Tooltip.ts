import { CountryData, TimeSeries } from "../../models";
import MapManager from "../../controllers/MapManager";
import * as tools from "../../libs/tools";

export default class Tooltip {
  axis: { x: number, y: number } = { x: 0, y: 0 };

  constructor() {
    MapManager.polygonSeries.mapPolygons.each((mapPolygon) => {
      const { dataContext } = mapPolygon.dataItem;
      if (dataContext !== undefined) {
        // eslint-disable-next-line no-param-reassign
        mapPolygon.tooltip.background.disabled = true;
        // eslint-disable-next-line no-param-reassign
        mapPolygon.tooltipPosition = "fixed";
        // eslint-disable-next-line no-param-reassign
        mapPolygon.showTooltipOn = "hit";
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        mapPolygon.tooltipHTML = this.editTemplate(mapPolygon.dataItem.dataContext);
      }
    });
    this.centralTooltipPosition();
  }

  initialPosition() {
    const boxSize = MapManager.polygonSeries.dom.getBBox();
    this.axis.x = boxSize.x + boxSize.width / 2 + 200;
    this.axis.y = boxSize.y + boxSize.height / 2 - 20;
  }

  centralTooltipPosition() {
    this.initialPosition();
    window.addEventListener("resize", () => {
      setTimeout(() => this.initialPosition(), 200);
    }, true);
    MapManager.polygonSeries.tooltip.events.onAll((name, ev) => {
      ev.target.animations.forEach((animation) => {
        animation.kill();
      });
      ev.target.dom.setAttribute("transform", `translate(${this.axis.x},${this.axis.y})`);
    });
    MapManager.polygonSeries.tooltip.events.on("shown", (ev) => {
      ev.target.dom.querySelector("foreignObject").setAttribute("height", "100%");
      ev.target.opacity = 1;
    });
    MapManager.polygonSeries.tooltip.events.on("hidden", (ev) => {
      ev.target.opacity = 0;
    });
    MapManager.polygonSeries.events.on("hit", (ev) => {
      const { spritePoint } = ev;
      MapManager.polygonSeries.tooltip.x = spritePoint.x - 40;
      MapManager.polygonSeries.tooltip.y = spritePoint.y;
    });
  }

  editTemplate(data: CountryData) {
    const timeSeries = data.timeseries;
    const passedTime = timeSeries ? tools.convertDateToString(Tooltip.getTimeDifference(timeSeries)) : "";
    const rcDifference = timeSeries ? Tooltip.getNumberDifference(timeSeries, "confirmed") : 0;
    const rcMathPrefix = rcDifference < 0 ? "-" : "+";
    const rcDifferenceTemplate = rcDifference ? `<span class="changed">${rcMathPrefix}${rcDifference} <span class="time">(since ${passedTime})</span></span><br>` : "";

    const dcDifference = timeSeries ? Tooltip.getNumberDifference(timeSeries, "deaths") : 0;
    const dcMathPrefix = dcDifference < 0 ? "-" : "+";
    const dcDifferenceTemplate = dcDifference ? `<span class="changed">${dcMathPrefix}${dcDifference} <span class="time">(since ${passedTime})</span></span><br>` : "";

    if (data.timeseries === undefined && data.reports === undefined) {
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
    return `
        <div class="earth-overlay">
            <img src="{flag}">
            <div class="title">
                <span>
                    <em>{name}</em>
                    <span><br>
                        <span class="tiny">{cases} total cases</span>
                    </span>
                </span>
            </div>
            <div class="info">
                <span><span class="_active">{reports}</span> active</span><br>
                ${rcDifferenceTemplate}
                <span><span class="_dead">{deaths}</span> deceased</span><br>
                ${dcDifferenceTemplate}
                <span><span class="_recovered">{recovered}</span> recovered</span><br>
            </div>
        </div>
    `;
  }

  static getNumberDifference(timeSeries: TimeSeries, dataFields: keyof TimeSeries) {
    let resultNumber: number = 0;

    const scopeData = timeSeries[dataFields];
    const lastRecordNumber: any[] = scopeData.slice(-2);
    resultNumber = lastRecordNumber[1] - lastRecordNumber[0];

    return resultNumber;
  }

  static getTimeDifference(timeSeries: TimeSeries) {
    const previous = new Date(timeSeries.dates.slice(-1)[0]);
    return tools.dateDiffer(previous);
  }
}
