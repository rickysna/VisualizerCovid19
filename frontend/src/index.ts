import particles from "./libs/particles";
import AppManager from "./AppManager";
import { Popup } from "./libs/Popup";
import { CountryData } from "./models/MapData";
import { Map } from "./components/map/Map";

AppManager.API.getCountriesData().then((api) => {
  particles("particles-js");

  const dataSortByActive: CountryData[] = Object.values(api.countries).sort((va, vb) => {
    const vaIndex = Object.values(api.countries).indexOf(va);
    const vbIndex = Object.values(api.countries).indexOf(vb);
    const vaName = Object.keys(api.countries)[vaIndex];
    const vbName = Object.keys(api.countries)[vbIndex];
    const vaNameIndex = api.countriesSortedByActive.indexOf(vaName);
    const vbNameIndex = api.countriesSortedByActive.indexOf(vbName);

    return vaNameIndex < vbNameIndex ? -1 : 1;
  });

  return {
    map: new Map(api.countries, "reports"),
    ranking: new AppManager.components.Ranking("ranking", dataSortByActive, api.timestamp),
    footer: new AppManager.components.Footer("footer", api.worldwide, api.timestamp),
  };
}).then(() => {
  AppManager.events.triggerEvent("MapReady");
});

AppManager.events.addEventListener("MapReady", () => {
  const loader = document.getElementById("loading");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 200);

  const popup = new Popup("popup");
  document.getElementById("bottomBar")
    .addEventListener("click", () => popup.show(), false);
});
