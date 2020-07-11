import BaseView from "./BaseView";
import { IFooterData } from "../controllers/FooterController";

const infoSVG = require("../assets/info.svg");

export default class FooterView extends BaseView<IFooterData> {
  render() {
    const {
      totalCases,
      totalCount,
      totalDeaths,
      totalRecovered,
      mortalityRate,
      recoveryRate,
      timestamp,
    } = this.data;

    return `
      <p>
        <span class="tiny">TOTAL COUNTS (as of <span class="timestamp">${timestamp}</span>)</span>
        <br>
        ACTIVE:&nbsp;<span class="total-cases">${totalCases}</span><span class="tiny total-count">/${totalCount}</span><span class="muted disappear">&nbsp;•</span>
        DEATHS:&nbsp;
        <span class="total-deaths">${totalDeaths}</span><span class="tiny mortality-rate">${mortalityRate}</span>
        <span class="tooltip">
          <img src="${infoSVG.default}">
          <span class="tooltiptext">Deaths out of<br><em>total</em> cases</span>
        </span>
        <span class="muted disappear">•</span><br>
        &nbsp;RECOVERIES:&nbsp;
        <span class="total-recovered">${totalRecovered}</span>
        <span class="tiny">${recoveryRate}</span>
        <span class="tooltip">
          <img src="${infoSVG.default}">
          <span class="tooltiptext">Recoveries out of<br><em>total</em> cases</span>
        </span>
      </p>
    `;
  }

  updateView() {
    this.viewNode.innerHTML = this.render();
  }
}
