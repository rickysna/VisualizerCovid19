import {MapPolygonSeries} from "@amcharts/amcharts4/maps";
import {HeatRules} from "./HeatRules";
import {Tooltip} from "./Tooltip";
import {MapManager} from "../../MapManager";
import {CountriesData} from "../../models";

export class CountryPolygon {
    polygonSeries:MapPolygonSeries = null;
    constructor(renderData: CountriesData, dataField: string) {
        this.polygonSeries = MapManager.createPolygonSeries(renderData, dataField);
        this.polygonSeries.calculateVisualCenter = true;
        this.polygonSeries.useGeodata = true;
        this.setCountriesStroke();
        this.setHeatRules();
        this.setOverlay();
        this.bindEvents();
    }
    setCountriesStroke() {
        let template = this.polygonSeries.mapPolygons.template;
        template.nonScalingStroke = true;
        template.stroke = MapManager.libs.am4core.color("#450000"); //区块边框颜色
        template.strokeWidth = 0.1;
    }
    setHeatRules() {
        const heatRules = new HeatRules('reports');
        heatRules.pushAllRules([
            {
                itemsPercent: 0.4,
                levelBasicColor: {
                    r: 100,
                    g: 0,
                    b: 0
                },
            },
            {
                itemsPercent: 0.3,
                levelBasicColor: {
                    r: 155,
                    g: 0,
                    b: 0
                },
            },
            {
                itemsPercent: 0.25,
                levelBasicColor: {
                    r: 200,
                    g: 0,
                    b: 0
                },
            },
            {
                itemsPercent: 0.05,
                levelBasicColor: {
                    r: 255,
                    g: 0,
                    b: 0
                },
            }
        ]);
        heatRules.process();
    }
    setOverlay() {
        this.polygonSeries.events.on('inited', () => {
            new Tooltip();
        });
    }
    bindEvents() {
        MapManager.polygonSeries.mapPolygons.template.events.on('hit', (ev) => {
            const {visualLongitude, visualLatitude} = ev.target;
            // rotate to country's location
            MapManager.chart.animate([{
                to: -visualLongitude,
                property: 'deltaLongitude'
            }, {
                to: -visualLatitude,
                property: 'deltaLatitude'
            }], 1000, MapManager.libs.am4core.ease.linear);
            MapManager.chart.goHome();
        });
        // this.countries.polygonSeries.mapPolygons.template.events.on('hit', ({target}) => {
        //     console.log(target.tooltip.animations[0]);
        //     debugger;
        // });
    }
}