import {CountryData} from "../models/MapData";
import * as tools from "../libs/tools";

export class Ranking {
    container: HTMLElement;
    list: HTMLElement;
    timestamp: HTMLElement;
    constructor(elementId: string, data: CountryData[], timestamp: string) {
        this.container = document.getElementById(elementId);
        this.list = this.container.querySelector('[data-mark="list"]');
        this.timestamp = this.container.querySelector('[data-mark="timestamp"]');

        this.container.innerHTML = Ranking.getRankingTemplate(Ranking.renderItems(data));
    }
    static getItemTemplate(data: CountryData) {
        return `
            <div class="country">
                <div class="country-flag" style="background-image: url(${data.flag})"></div>
                <div class="country-info">
                    <span class="country-name">${data.name}</span><br>
                    <span class="country-cases">${tools.formatNumber(data.cases)} <span class="muted">total cases</span></span>
                </div>
            </div>
        `
    }
    static getRankingTemplate(items: string) {
        return `
            <div class="ranking__container">
                <div class="ranking__header">
                    <h2 class="ranking__title">
                        All Countries & Territories (by cases)
                    </h2>
                </div>
                <div class="ranking__content">
                    <p class="muted">
                        Data last updated <span class="timestamp" data-mark="timestamp">a minute ago</span> by
                        <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometers</a>.
                    </p>
                    <div class="ranking__list" data-mark="list">${items}</div>
                </div>
            </div>
        `
    }
    static renderItems(data: CountryData[]) {
        let listHTML = '';
        data.forEach(_data => {
            listHTML += Ranking.getItemTemplate(_data);
        });
        return listHTML;
    }
}