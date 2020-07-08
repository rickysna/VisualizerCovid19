import Broadcast from "./libs/Broadcast";
import Footer from "./components/Footer";
import data from "./data";
import Ranking from "./components/Ranking";
import Popup from "./libs/Popup";

export default class AppManager {
    static events:Broadcast = new Broadcast();

    static API = {
      getCountriesData: data.getCountriesData,
    };

    static components = {
      Ranking,
      Footer,
      Popup,
    }
}
