import particles from "./particles";
import {AppManager} from "./AppManager";
import {Popup} from "./libs/Popup";
import {CountryData} from "./models/MapData";
import {Map} from "./Map";

AppManager.API.getCountriesData().then(api => {
    particles("particles-js");
    const map = new Map(api.countries, 'reports');
    AppManager.events.triggerEvent('MapReady');

    const dataSortByActive:CountryData[] = Object.values(api.countries).sort((va, vb) => {
        const vaIndex = Object.values(api.countries).indexOf(va);
        const vbIndex = Object.values(api.countries).indexOf(vb);
        const vaName = Object.keys(api.countries)[vaIndex];
        const vbName = Object.keys(api.countries)[vbIndex];
        const vaNameIndex = api.countriesSortedByActive.indexOf(vaName);
        const vbNameIndex = api.countriesSortedByActive.indexOf(vbName);

        return vaNameIndex < vbNameIndex ? -1 : 1;
    });

    const ranking = new AppManager.components.Ranking('ranking', dataSortByActive, api.timestamp);
    const footer = new AppManager.components.Footer('footer', api.worldwide, api.timestamp);
});

AppManager.events.addEventListener('MapReady', () => {
    const loader = document.getElementById('loading');
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 200);

    const popup = new Popup('popup');
    document.getElementById('bottomBar')
        .addEventListener('click', () => popup.show(), false);
});

