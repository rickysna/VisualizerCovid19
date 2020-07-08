import { CountryData, MapData } from "../models";
import * as tools from "../libs/tools";
import MapManager from "../controllers/MapManager";
import AppManager from "../controllers/AppManager";

export default class Ranking {
    container: HTMLElement;

    constructor(elementId: string, data: MapData) {
      this.container = document.getElementById(elementId);

      const dataSortByActive: CountryData[] = Object.values(data.countries).sort((va, vb) => {
        const vaIndex = Object.values(data.countries).indexOf(va);
        const vbIndex = Object.values(data.countries).indexOf(vb);
        const vaName = Object.keys(data.countries)[vaIndex];
        const vbName = Object.keys(data.countries)[vbIndex];
        const vaNameIndex = data.countriesSortedByActive.indexOf(vaName);
        const vbNameIndex = data.countriesSortedByActive.indexOf(vbName);

        return vaNameIndex < vbNameIndex ? -1 : 1;
      });

      this.container.innerHTML = Ranking.getRankingTemplate(
        Ranking.renderItems(dataSortByActive),
        data.timestamp,
      );

      this.addEvents();
    }

    static getItemTemplate(data: CountryData) {
      return `
        <div class="country" data-name="${data.altNames[0]}">
            <div class="country-flag" data-style="background-image: url(${data.flag})"></div>
            <div class="country-info">
                <span class="country-name">${data.name}</span><br>
                <span class="country-cases">${tools.formatNumber(data.cases)} <span class="muted">total cases</span></span>
            </div>
        </div>
        `;
    }

    static getRankingTemplate(items: string, timestamp: string) {
      const timeStr = tools.convertDateToString(tools.dateDiffer(new Date(timestamp)));
      return `
        <div class="ranking__container">
            <div class="ranking__header">
                <h2 class="ranking__title">
                    All Countries & Territories (by cases)
                </h2>
            </div>
            <div class="ranking__content">
<!--                    <p class="muted">-->
<!--                        Data last updated <span class="timestamp">${timeStr}</span> by-->
<!--                        <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometers</a>.-->
<!--                    </p>-->
                <div class="ranking__list">${items}</div>
            </div>
        </div>
      `;
    }

    static renderItems(data: CountryData[]) {
      let listHTML = "";
      data.forEach((_data) => {
        listHTML += Ranking.getItemTemplate(_data);
      });
      return listHTML;
    }

    addEvents() {
      this.container.querySelectorAll(".country").forEach((dom) => {
        dom.addEventListener("click", () => {
          const countryId = dom.getAttribute("data-name");
          MapManager.polygonSeries.mapPolygons.each((mapPolygon) => {
            // @ts-ignore
            if (mapPolygon.dataItem.dataContext.id === countryId) {
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
          });
        });
      });
      AppManager.events.addEventListener("MapReady", () => {
        this.container.querySelectorAll(".country-flag").forEach((dom) => {
          const flag = dom.getAttribute("data-style");
          dom.setAttribute("style", flag);
        });
      });
    }
}
