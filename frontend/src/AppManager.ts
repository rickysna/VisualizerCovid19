import Broadcast from "./libs/Broadcast";
import Footer from "./views/Footer";
import data from "./models/data";
import Ranking from "./views/Ranking";
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
