import {MapPolygon, MapPolygonSeries} from "@amcharts/amcharts4/maps";
import {iRGB} from "@amcharts/amcharts4/.internal/core/utils/Colors";
import * as am4core from "@amcharts/amcharts4/core";
import {MapManager} from "./MapManager";

type ruleProperty = {
    itemsPercent: number, // <= 1 本分组占总数据句比例
    levelBasicColor: iRGB, // 当前分级基准颜色
};

interface _ruleProperty extends ruleProperty {
    level: number, // unique 国家分组
    countItemsPercent: number,
    indexBoundary: {
        min: number,
        max: number
    }
}

export class HeatRules {
    rules: ruleProperty[] = [];
    dataField: string;
    constructor(dataField:string) {
        this.dataField = dataField;
    }
    pushRule(data: ruleProperty) {
        this.rules.push(data);
    }
    pushAllRules(arr: ruleProperty[]) {
        this.rules = this.rules.concat(arr);
    }
    process() {
        if (this.rules.length === 0)
            return Promise.reject('call pushRule or pushAllRules first');
        this.handleDefaultRules();

        const _promise = MapManager.sortDataByField(this.dataField);

        return _promise.then((data) => {
            // setTimeout(() => {
                const rules = this.handleRules(this.rules, data.length);
                MapManager.polygonSeries.mapPolygons.each((mapPolygon) => {
                    const cIndex = this.findCountryIndex(data, mapPolygon.dataItem.dataContext);
                    if (cIndex === -1)
                        return mapPolygon.fill = am4core.color('#242424');

                    const rule = this.findRuleByCountryIndex(rules, cIndex);
                    this.processMapPolygon(mapPolygon, rule, cIndex);
                });
            // }, 100);
        });
    }
    private processMapPolygon(mapPolygon: MapPolygon, rule: _ruleProperty, index: number) {
        const alphaPercent = ((index - rule.indexBoundary.min) / (rule.indexBoundary.max - rule.indexBoundary.min) / 2).toFixed(2);
        const color = Object.assign({a: Number(alphaPercent) + 0.5}, rule.levelBasicColor);

        mapPolygon.fill = am4core.color(color);
    }
    private findCountryIndex(data: any[], dataContext: any) {
        return data.indexOf(dataContext);
    }
    private findRuleByCountryIndex(rules: _ruleProperty[], index: number):_ruleProperty {
        for (let _index = 0; _index < rules.length; _index++) {
            let rule = rules[_index];
            if (index <= rule.indexBoundary.max)
                return rule;
        }
    }
    private handleRules(rules: ruleProperty[], maxIndex: number) {
        let percentval = 0;
        const _rules:_ruleProperty[] = [];
        rules.forEach((rule, index) => {
            const itemsPercent = rule.itemsPercent;
            const countItemsPercent = percentval += itemsPercent;
            const level = index + 1;
            const preRule = index === 0 ? null : _rules[index - 1];
            const indexBoundary = {
                min: preRule ? Math.floor(preRule.indexBoundary.max) : 0,
                max: Math.ceil(countItemsPercent * maxIndex)
            };

            const result = Object.assign({}, rule, {
                level,
                countItemsPercent,
                indexBoundary
            });
            _rules.push(result);
        });
        return _rules;
    }
    private handleDefaultRules() {
        const first = this.rules[0];
        const last = this.rules.slice(-1)[0];
        MapManager.polygonSeries.heatRules.push({
            "property": "fill",
            "target": MapManager.polygonSeries.mapPolygons.template,
            "min": am4core.color(first.levelBasicColor),
            "max": am4core.color(last.levelBasicColor),
        });
    }
}