import {Map} from "./Map";
import particles from "./particles";
import {getCountriesData} from "./data";
import {MapManager} from "./MapManager";
import {AppManager} from "./AppManager";
import {Popup} from "./libs/Popup";

// getCountriesData().then(mapData => {
//     particles("particles-js");
//     const map = new Map(mapData, 'reports');
//     AppManager.events.triggerEvent('MapReady');
// });

AppManager.events.addEventListener('MapReady', () => {
    const loader = document.getElementById('loading');
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 200);

    const popup = new Popup('popup');
    document.getElementById('bottomBar')
        .addEventListener('click', () => popup.show(), false);
});

window.onload = () => {
    AppManager.events.triggerEvent('MapReady');
};
