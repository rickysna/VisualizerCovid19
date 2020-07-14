import BaseView from "./BaseView";
import { CountryData } from "../models";
import * as tools from "../libs/tools";
import { IRankingData } from "../controllers/RankingController";
import {RankingViewUpdateCountryID} from "../events";

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
    const { countries } = this.data;
    const itemsTpl = this.renderItems(countries);
    const node = this.viewNode.querySelector(".ranking__list");

    if (node) {
      node.innerHTML = itemsTpl;
    }
  }

  renderItems(data: CountryData[]) {
    let listHTML = "";
    data.forEach((_data) => {
      listHTML += this.getItemTemplate(_data);
    });
    return listHTML;
  }

  registerHooks() {
    delegate.bind(this.viewNode, ".country", "click", (e: any) => {
      const countryId = e.delegateTarget.getAttribute("data-name");

      this.events.triggerEvent(RankingViewUpdateCountryID, countryId);
      //       MapManager.polygonSeries.mapPolygons.each((mapPolygon) => {
      //         // @ts-ignore
      //         if (mapPolygon.dataItem.dataContext.id === countryId) {
      //           const eventPointerdown = new Event("pointerdown");
      //           const eventMouseenter = new Event("mouseenter");
      //           // @ts-ignore
      //           eventMouseenter.buttons = 0;
      //           // @ts-ignore
      //           eventMouseenter.which = 0;
      //           // @ts-ignore
      //           eventMouseenter.relatedTarget = null;
      //           mapPolygon.dom.dispatchEvent(eventPointerdown);
      //           document.dispatchEvent(eventMouseenter);
      //         }
      //       });
    });
  }
}
