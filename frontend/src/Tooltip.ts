import {MapPolygon, MapPolygonSeries} from "@amcharts/amcharts4/maps";
import {CountryData, TimeSeries} from "./models/MapData";
import {ListTemplate} from "@amcharts/amcharts4/.internal/core/utils/List";

export class Tooltip {
    constructor(mapPolygons: ListTemplate<MapPolygon>) {
        mapPolygons.each((mapPolygon, index) => {
            const dataContext:any = mapPolygon.dataItem.dataContext;
            if (dataContext !== undefined) {
                // if (index === 0)
                //     mapPolygon.tooltip.events.on('transformed', ev => {
                //         console.log(ev.target.animations);
                //         debugger;
                //     });

                mapPolygon.tooltip.background.disabled = true;
                mapPolygon.tooltipPosition = 'fixed';
                mapPolygon.showTooltipOn = 'hit';
                //@ts-ignore
                mapPolygon.tooltipHTML = this.editTemplate(mapPolygon.dataItem.dataContext);
            }
        });
    }
    editTemplate(data:CountryData) {
        const timeSeries = data.timeseries;
        const passed_time = timeSeries ? this.formatDateToString(this.getTimeDifference(timeSeries)) : '';
        const report_cases_difference = timeSeries ? this.getNumberDifference(timeSeries, 'confirmed') : 0;
        const report_cases_math_prefix = report_cases_difference < 0 ? '-' : '+';
        const report_cases_difference_template = report_cases_difference ? `<span class="changed">${report_cases_math_prefix}${report_cases_difference} <span class="time">(since ${passed_time})</span></span><br>` : '';

        const death_cases_difference = timeSeries ? this.getNumberDifference(timeSeries, 'deaths') : 0;
        const death_cases_math_prefix = death_cases_difference < 0 ? '-' : '+';
        const death_cases_difference_template = death_cases_difference ? `<span class="changed">${death_cases_math_prefix}${death_cases_difference} <span class="time">(since ${passed_time})</span></span><br>` : '';

        // const recovered_cases_difference = timeSeries ? this.getNumberDifference(timeSeries, 'recovered') : 0;
        // const recovered_cases_math_prefix = recovered_cases_difference < 0 ? '-' : '+';
        // const recovered_cases_difference_template = recovered_cases_difference ? `<span class="changed">${recovered_cases_math_prefix}${recovered_cases_difference} <span class="time">(since a day ago)</span></span><br>` : '';
        return `
            <div class="earth-overlay">
                <div class="flag">
                    <img src="{flag}">
                </div>
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
        let resultTime:string = '';

        let scopeData = timeSeries[dataFields];
        let lastRecordNumber:any[] = scopeData.slice(-2);
        resultNumber = lastRecordNumber[1] - lastRecordNumber[0];

        return resultNumber;
    }
    private getTimeDifference(timeSeries: TimeSeries) {
        const previous = new Date(timeSeries['dates'].slice(-1)[0]);
        return this.dateDiffer(previous);
    }
    dateDiffer(previous: Date) {
        let current = new Date();

        // @ts-ignore
        const seconds = (current - previous) / 1000;
        const days = Math.floor(seconds / 60 / 60 / 24);
        const hours = Math.floor(seconds / 60 / 60);

        return {days, hours}
    }
    formatDateToString(data: {days: number, hours: number}) {
        if (data.days !== 0) {
            switch (data.days) {
                case 1:
                    return 'a day ago';
                case 2:
                    return 'two days ago';
                case 3:
                    return 'three days ago';
                default:
                    return 'few days ago'
            }
        } else {
            switch (data.hours) {
                case 0:
                    return 'just now';
                case 1:
                    return 'a hour ago';
                case 2:
                    return 'two hours ago';
                default:
                    return 'few hours ago';
            }
        }
    }
}