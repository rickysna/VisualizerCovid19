import {DateDiffer} from "../models/Date";

export function formatNumber(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function dateDiffer(previous: Date):DateDiffer {
    let current = new Date();

    // @ts-ignore
    const totalSeconds = (current - previous) / 1000;
    const days = Math.floor(totalSeconds / 3600 / 24);
    let restSeconds = totalSeconds - days * 24 * 3600;
    const hours = Math.floor(restSeconds / 3600);
    restSeconds = restSeconds - hours * 3600;
    const minutes = Math.floor(restSeconds / 60);
    const seconds = Math.floor(restSeconds - minutes * 60);

    return {days, hours, minutes, seconds};
}

export function convertDateToString(date: DateDiffer) {
    if (date.days > 0) {
        return date.days + ' days ago';
    } else if (date.hours > 0) {
        return date.hours + ' hours ago';
    } else if (date.seconds > 0) {
        return 'just ' + date.seconds + ' seconds ago';
    }
}