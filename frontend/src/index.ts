import AppManager from "./controllers/AppManager";
import Popup from "./views/Popup";
import Map from "./components/map/Map";
import Ranking from "./views/Ranking";
import Footer from "./views/Footer";
import Loading from "./views/Loading";

AppManager.API.getCountriesData().then((data) => {
  return {
    map: new Map(data.countries, "reports"),
    ranking: new Ranking("ranking", data),
    footer: new Footer("footer", data.worldwide, data.timestamp),
    popup: new Popup("popup"),
    loading: new Loading("loading"),
  };
}).then((components) => {
  AppManager.components = components;
  AppManager.events.triggerEvent("MapReady");
});

AppManager.events.addEventListener("MapReady", () => {
  AppManager.components.loading.hide();

  document.getElementById("bottomBar")
    .addEventListener("click", () => {
      if (AppManager.components.popup !== undefined) AppManager.components.popup.show();
    }, false);
});
