import {Worldwide} from "../models/MapData";
import * as tools from "../libs/tools";

export class Footer {
    constructor(data: Worldwide, timestamp: string) {
        const {deaths, reports, recovered} = data;
        document.getElementById('total-cases').innerHTML = tools.formatNumber(reports - recovered - deaths);
        document.getElementById('total-count').innerHTML = tools.formatNumber(reports);
        document.getElementById('total-deaths').innerHTML = tools.formatNumber(deaths);
        document.getElementById('total-recovered').innerHTML = tools.formatNumber(recovered);
        document.getElementById('mortality-rate').innerHTML = '(' + Math.ceil((deaths / reports) * 10000) / 100 + ')%';
        document.getElementById('recovery-rate').innerHTML = '(' + Math.ceil((recovered / reports) * 10000) / 100 + ')%';
        document.getElementById('timestamp').innerHTML = tools.convertDateToString(tools.dateDiffer(new Date(timestamp)));
    }
}