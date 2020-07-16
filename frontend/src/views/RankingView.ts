import BaseView from "./BaseView";
import {CountryData, MapData} from "../models";
import * as tools from "../libs/tools";
import { IRankingData } from "../controllers/RankingController";
import { RankingViewUpdateCountryID } from "../events";

const delegate = require("delegate-events");

export default class RankingView extends BaseView<IRankingData> {
  getItemTemplate(data: CountryData) {
    return `
        <div class="country" data-name="${data.altNames[0]}">
            <div class="country-flag" style="background-image: url(${data.flag})"></div>
            <div class="country-info">
                <span class="country-name">${data.name}</span><br>
                <span class="country-cases">${tools.formatNumber(data.cases)} <span class="muted">total cases</span></span>
            </div>
        </div>
        `;
  }

  render() {
    return `
        <div class="ranking__container">
            <div class="ranking__header">
                <h2 class="ranking__title">
                    All Countries & Territories (by cases)
                </h2>
            </div>
            <div class="ranking__content">
                <div class="ranking__list"></div>
            </div>
        </div>
      `;
  }

  updateView() {
    const itemsTpl = this.renderItems(this.data.mapData);
    const node = this.viewNode.querySelector(".ranking__list");

    if (node) {
      node.innerHTML = itemsTpl;
    }
  }

  renderItems(mapData: MapData) {
    const { countries, countriesSortedByActive } = mapData;

    let listHTML = "";
    countriesSortedByActive.forEach((countryName) => {
      const data = countries[countryName];
      listHTML += this.getItemTemplate(data);
    });
    return listHTML;
  }

  registerHooks() {
    delegate.bind(this.viewNode, ".country", "click", (e: any) => {
      const countryId = e.delegateTarget.getAttribute("data-name");

      this.events.triggerEvent(RankingViewUpdateCountryID, { data: countryId});
    });
  }
}
