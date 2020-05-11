import Broadcast from "./libs/Broadcast";
import {Footer} from "./components/Footer";
import {getCountriesData} from "./data";
import {Ranking} from "./components/Ranking";
import {Popup} from "./libs/Popup";

export class AppManager {
    static events:Broadcast = new Broadcast();
    static API = {
        getCountriesData
    };
    static components = {
        Ranking: Ranking,
        Footer: Footer,
        Popup: Popup
    }
}