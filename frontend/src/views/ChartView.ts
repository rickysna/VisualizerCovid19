import BaseView from "./BaseView";
import ChartComponent from "../components/ChartComponent";
import MapComponent from "../components/MapComponent";
import { IChartData } from "../controllers/ChartController";
import LegendComponent from "../components/LegendComponent";
import { am4core, am4themesAnimated } from "../libs/am4chart";

export type TDisplayModel = "desktop" | "mobile";

export default class ChartView extends BaseView<IChartData> {
  displayModel: TDisplayModel;

  components: {
    chart: ChartComponent,
    map: MapComponent,
    legend: LegendComponent
  };

  onViewReady() {
    am4core.useTheme(am4themesAnimated);

    const chart = new ChartComponent();
    chart
      .init("chartdiv")
      .inject()
      .setConfiguration()
      .setStyles()
      .registerHooks();

    const { countries, countriesSortedByActive } = this.data.mapData;

    const map = new MapComponent(countries, countriesSortedByActive);
    map
      .init(chart.target)
      .setConfiguration()
      .registerHooks();

    const maxCases = countries[countriesSortedByActive[0]].cases;
    const legend = new LegendComponent(0, maxCases);
    legend
      .init(chart.target)
      .setConfiguration(map.target)
      .inject()
      .setStyles()
      .registerHooks();

    this.components = { chart, map, legend };

    this.onResize();
  }

  selectCountry(id: string) {
    if (this.components.map) {
      this.components.map.selectCountry(id);
    }
  }

  registerHooks() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize() {
    if (document.body.offsetWidth < 1100 && this.displayModel !== "mobile") {
      this.displayModel = "mobile";
      this.components.legend.onResize(this.displayModel);
      this.components.map.onResize(this.displayModel);
      this.components.chart.onResize(this.displayModel);
    } else if (document.body.offsetWidth >= 1100 && this.displayModel !== "desktop") {
      this.displayModel = "desktop";
      this.components.legend.onResize(this.displayModel);
      this.components.map.onResize(this.displayModel);
      this.components.chart.onResize(this.displayModel);
    }
  }
}
