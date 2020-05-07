import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4core from "@amcharts/amcharts4/core";
import {HeatLegend, MapPolygonSeries} from "@amcharts/amcharts4/maps";
import {MapManager} from "./MapManager";

export class Legend {
    chart:HeatLegend;
    dataField:string;
    constructor(dataField: string) {
        this.chart = MapManager.createHeatLegend();
        this.dataField = dataField;
        this.styleChart();
        this.setSize();
        this.setPosition();
        this.customLabels();
    }
    customLabels() {
        const minRange = this.chart.valueAxis.axisRanges.create();
        minRange.label.horizontalCenter = "left";

        const maxRange = this.chart.valueAxis.axisRanges.create();
        maxRange.label.horizontalCenter = "left";

        const heatLegend = this.chart;
        MapManager.sortDataByField(this.dataField)
            .then(data => {
                let min = 0;
                // let min = data[0].cases;
                // let minRange = heatLegend.valueAxis.axisRanges.getIndex(0);
                minRange.value = min;
                minRange.label.text = "" + heatLegend.numberFormatter.format(min);

                let max = data.slice(-1)[0].cases;
                let maxRange = heatLegend.valueAxis.axisRanges.getIndex(1);

                maxRange.value = max;
                maxRange.label.text = "" + heatLegend.numberFormatter.format(max);
            });

        this.chart.events.on('ready', ev => {
            this.setLabelSize(minRange, maxRange);
            this.chart.events.on('sizechanged', ev => this.setLabelSize(minRange, maxRange));
        });

        let label = this.chart.createChild(am4core.Label);
        label.text = "legend (active cases)";
        label.fontSize = 14;
        label.fill = am4core.color('#b6b6b6');
        label.align = "center";
        label.dy = -70;
    }
    setPosition() {
        this.chart.align = "right";
        this.chart.valign = "bottom";
    }
    setSize() {
        this.chart.width = am4core.percent(25);
        this.chart.minWidth = 300;
    }
    styleChart() {
        const markersTemplate = this.chart.markers.template;
        const labelsTemplate = this.chart.valueAxis.renderer.labels.template;
        labelsTemplate.fill = am4core.color("#fff");

        markersTemplate.stroke = am4core.color("#bab89b");
        markersTemplate.cornerRadius(4, 4, 4, 4);
        markersTemplate.marginRight = 40;
    }
    setLabelSize(minRange: any, maxRange: any) {
        const _y = -18;
        const containerWidth = this.chart.dom.getBBox().width;
        // @ts-ignore
        minRange.label.dom.firstChild.setAttribute('transform', `translate(10, ${_y})`);
        // @ts-ignore
        const maxRangeDomWidth = maxRange.label.dom.firstChild.getBBox().width;
        // @ts-ignore
        maxRange.label.dom.firstChild.setAttribute('transform', `translate(${containerWidth - maxRangeDomWidth - 50}, ${_y})`);
    }
}