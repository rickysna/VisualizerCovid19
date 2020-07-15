import BaseView from "./BaseView";
import ChartComponent from "../components/ChartComponent";
import MapComponent from "../components/MapComponent";
import { IChartData } from "../controllers/ChartController";
import LegendComponent from "../components/LegendComponent";

export default class ChartView extends BaseView<IChartData> {
  components: {
    chart: ChartComponent,
    map: MapComponent,
    legend: LegendComponent
  };

  onViewReady() {
    const chart = new ChartComponent();
    chart
      .init("chartdiv")
      .inject()
      .setConfiguration()
      .setStyles()
      .registerHooks();

    const { countries, sortedCountries } = this.data;

    const map = new MapComponent(countries, sortedCountries);
    map
      .init(chart.target)
      .setConfiguration()
      .registerHooks();

    const maxCases = sortedCountries[0].cases;
    const legend = new LegendComponent(0, maxCases);
    legend
      .init(chart.target)
      .setConfiguration(map.target)
      .inject()
      .setStyles()
      .registerHooks();

    this.components = { chart, map, legend };
  }

  selectCountry(id: string) {
    if (this.components.map) {
      this.components.map.selectCountry(id);
    }
  }
}
