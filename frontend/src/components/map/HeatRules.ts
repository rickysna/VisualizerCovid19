import { MapPolygon } from "@amcharts/amcharts4/maps";
import { iRGB } from "@amcharts/amcharts4/.internal/core/utils/Colors";
import MapManager from "../../controllers/MapManager";

type RuleProperty = {
  itemsPercent: number, // <= 1 本分组占总数据句比例
  levelBasicColor: iRGB, // 当前分级基准颜色
};

interface _ruleProperty extends RuleProperty {
  level: number, // unique 国家分组
  countItemsPercent: number,
  indexBoundary: {
    min: number,
    max: number
  }
}

export default class HeatRules {
  rules: RuleProperty[] = [];

  dataField: string;

  constructor(dataField: string) {
    this.dataField = dataField;
  }

  pushRule(data: RuleProperty) {
    this.rules.push(data);
  }

  pushAllRules(arr: RuleProperty[]) {
    this.rules = this.rules.concat(arr);
  }

  process() {
    if (this.rules.length === 0) return Promise.reject(new Error("call pushRule or pushAllRules first"));
    this.handleDefaultRules();

    return MapManager.sortDataByField(this.dataField).then((data) => {
      const rules = HeatRules.handleRules(this.rules, data.length);
      MapManager.polygonSeries.mapPolygons.each((mapPolygon) => {
        const cIndex = HeatRules.findCountryIndex(data, mapPolygon.dataItem.dataContext);
        if (cIndex === -1) {
          // eslint-disable-next-line no-param-reassign
          mapPolygon.fill = MapManager.libs.am4core.color("#242424");
          return;
        }

        const rule = HeatRules.findRuleByCountryIndex(rules, cIndex);
        HeatRules.processMapPolygon(mapPolygon, rule, cIndex);
      });
    });
  }

  static processMapPolygon(mapPolygon: MapPolygon, rule: _ruleProperty, index: number) {
    const { min, max } = rule.indexBoundary;
    const alphaPercent = ((index - min) / (max - min) / 2).toFixed(2);
    const color = { a: Number(alphaPercent) + 0.5, ...rule.levelBasicColor };

    // eslint-disable-next-line no-param-reassign
    mapPolygon.fill = MapManager.libs.am4core.color(color);
  }

  static findCountryIndex(data: any[], dataContext: any) {
    return data.indexOf(dataContext);
  }

  static findRuleByCountryIndex(rules: _ruleProperty[], countryIndex: number): _ruleProperty {
    for (let index = 0; index < rules.length; index += 1) {
      const rule = rules[index];
      if (countryIndex <= rule.indexBoundary.max) return rule;
    }
    return null;
  }

  // 重构
  static handleRules(initialRules: RuleProperty[], maxIndex: number) {
    let percentVal = 0;
    const rules: _ruleProperty[] = [];
    initialRules.forEach((rule, index) => {
      const { itemsPercent } = rule;
      percentVal += itemsPercent;
      const countItemsPercent = percentVal;
      const level = index + 1;
      const preRule = index === 0 ? null : rules[index - 1];
      const indexBoundary = {
        min: preRule ? Math.floor(preRule.indexBoundary.max) : 0,
        max: Math.ceil(countItemsPercent * maxIndex),
      };

      const result = {
        ...rule,
        level,
        countItemsPercent,
        indexBoundary,
      };
      rules.push(result);
    });
    return rules;
  }

  private handleDefaultRules() {
    const first = this.rules[0];
    const last = this.rules.slice(-1)[0];
    MapManager.polygonSeries.heatRules.push({
      property: "fill",
      target: MapManager.polygonSeries.mapPolygons.template,
      min: MapManager.libs.am4core.color(first.levelBasicColor),
      max: MapManager.libs.am4core.color(last.levelBasicColor),
    });
  }
}
