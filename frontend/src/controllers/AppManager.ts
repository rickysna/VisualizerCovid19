import Broadcast from "../libs/Broadcast";
import Footer from "../views/Footer";
import data from "../models/data";
import Ranking from "../views/Ranking";
import Popup from "../views/Popup";
import Map from "../components/map/Map";
import Loading from "../views/Loading";

interface Components {
  map: Map,
  ranking: Ranking,
  footer: Footer,
  popup: Popup,
  loading: Loading,
}

export default class AppManager {
    static events:Broadcast = new Broadcast();

    static API = {
      getCountriesData: data.getCountriesData,
    };

    static components:Components;
}
