import {CountryData, TimeSeries} from "./models/MapData";
import {MapManager} from "./MapManager";
import * as tools from "./libs/tools";
import {DateDiffer} from "./models/Date";

export class Tooltip {
    axis:{x: number, y: number} = {x: 0, y: 0};
    constructor() {
        MapManager.polygonSeries.mapPolygons.each((mapPolygon, index) => {
            const dataContext:any = mapPolygon.dataItem.dataContext;
            if (dataContext !== undefined) {
                mapPolygon.tooltip.background.disabled = true;
                mapPolygon.tooltipPosition = 'fixed';
                mapPolygon.showTooltipOn = 'hit';
                //@ts-ignore
                mapPolygon.tooltipHTML = this.editTemplate(mapPolygon.dataItem.dataContext);
            }
        });
        this.centralTooltipPosition();
    }
    initialPosition() {
        const boxSize = MapManager.polygonSeries.dom.getBBox();
        this.axis.x = boxSize.x + boxSize.width / 2;
        this.axis.y = boxSize.y + boxSize.height / 2 - 20;
    }
    centralTooltipPosition() {
        this.initialPosition();
        window.addEventListener("resize", () => {
            setTimeout(() => this.initialPosition(), 200);
        }, true);
        MapManager.polygonSeries.tooltip.events.onAll((name, ev) => {
            ev.target.animations.forEach((animation) => {
                animation.duration = 1500;
                animation.animationOptions.forEach(options => {
                    if (options.property === 'x') {
                        options.to = this.axis.x;
                    } else if (options.property === 'y') {
                        options.to = this.axis.y;
                    } else if (options.property === 'opacity') {
                        animation.kill();
                    }
                })
            });
        });
        MapManager.polygonSeries.tooltip.events.on('shown',(ev) => {
            ev.target.opacity = 1;
            ev.target.dom.querySelector('foreignObject').setAttribute('height', '100%');
        });
        MapManager.polygonSeries.tooltip.events.on('hidden',(ev) => {
            ev.target.opacity = 0;
        });
        MapManager.polygonSeries.events.on('hit', (ev) => {
            const {spritePoint} = ev;
            MapManager.polygonSeries.tooltip.x = spritePoint.x - 40;
            MapManager.polygonSeries.tooltip.y = spritePoint.y;
        });
    }
    editTemplate(data:CountryData) {
        const timeSeries = data.timeseries;
        const passed_time = timeSeries ? tools.convertDateToString(this.getTimeDifference(timeSeries)) : '';
        const report_cases_difference = timeSeries ? this.getNumberDifference(timeSeries, 'confirmed') : 0;
        const report_cases_math_prefix = report_cases_difference < 0 ? '-' : '+';
        const report_cases_difference_template = report_cases_difference ? `<span class="changed">${report_cases_math_prefix}${report_cases_difference} <span class="time">(since ${passed_time})</span></span><br>` : '';

        const death_cases_difference = timeSeries ? this.getNumberDifference(timeSeries, 'deaths') : 0;
        const death_cases_math_prefix = death_cases_difference < 0 ? '-' : '+';
        const death_cases_difference_template = death_cases_difference ? `<span class="changed">${death_cases_math_prefix}${death_cases_difference} <span class="time">(since ${passed_time})</span></span><br>` : '';

        // const recovered_cases_difference = timeSeries ? this.getNumberDifference(timeSeries, 'recovered') : 0;
        // const recovered_cases_math_prefix = recovered_cases_difference < 0 ? '-' : '+';
        // const recovered_cases_difference_template = recovered_cases_difference ? `<span class="changed">${recovered_cases_math_prefix}${recovered_cases_difference} <span class="time">(since a day ago)</span></span><br>` : '';
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
            `
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
                <div class="info" style="background-color: #cc0000">
                    <span><span class="_active">{reports}</span> active</span><br>
                    ${report_cases_difference_template}
                    <span><span class="_dead">{deaths}</span> deceased</span><br>
                    ${death_cases_difference_template}
                    <span><span class="_recovered">{recovered}</span> recovered</span><br>
                </div>
            </div>
        `
    }
    private getNumberDifference(timeSeries: TimeSeries, dataFields: keyof TimeSeries) {
        let resultNumber:number = 0;

        let scopeData = timeSeries[dataFields];
        let lastRecordNumber:any[] = scopeData.slice(-2);
        resultNumber = lastRecordNumber[1] - lastRecordNumber[0];

        return resultNumber;
    }
    private getTimeDifference(timeSeries: TimeSeries) {
        const previous = new Date(timeSeries['dates'].slice(-1)[0]);
        return tools.dateDiffer(previous);
    }
}