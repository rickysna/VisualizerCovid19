import {Map} from "./Map";
import particles from "./particles";
import {getCountriesData} from "./data";
import {AppManager} from "./AppManager";
import {Popup} from "./libs/Popup";
import * as tools from "./libs/tools";

getCountriesData().then(api => {
    particles("particles-js");
    const map = new Map(api.countries, 'reports');
    // AppManager.events.triggerEvent('MapReady');

    const {deaths, reports, recovered} = api.worldwide;
    document.getElementById('total-cases').innerHTML = tools.formatNumber(reports - recovered - deaths);
    document.getElementById('total-count').innerHTML = tools.formatNumber(reports);
    document.getElementById('total-deaths').innerHTML = tools.formatNumber(deaths);
    document.getElementById('total-recovered').innerHTML = tools.formatNumber(recovered);
    document.getElementById('mortality-rate').innerHTML = '(' + Math.ceil((deaths / reports) * 10000) / 100 + ')%';
    document.getElementById('recovery-rate').innerHTML = '(' + Math.ceil((recovered / reports) * 10000) / 100 + ')%';
    document.getElementById('timestamp').innerHTML = tools.convertDateToString(tools.dateDiffer(new Date(api.timestamp)));
});

AppManager.events.addEventListener('MapReady', () => {
    const loader = document.getElementById('loading');
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 200);

    const popup = new Popup('popup');
    document.getElementById('bottomBar')
        .addEventListener('click', () => popup.show(), false);
});
