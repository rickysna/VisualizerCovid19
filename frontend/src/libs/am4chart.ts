const { dev } = process.env;

const newWindowObject = window as any;

export const am4maps: typeof import("@amcharts/amcharts4/maps") = dev ? require("@amcharts/amcharts4/maps") : newWindowObject.am4maps;
export const am4core: typeof import("@amcharts/amcharts4/core") = dev ? require("@amcharts/amcharts4/core") : newWindowObject.am4core;
export const am4themesAnimated = dev ? require("@amcharts/amcharts4/themes/animated").default : newWindowObject.am4themes_animated;
export const am4geodataWorldLow = dev ? require("@amcharts/amcharts4-geodata/worldLow").default : newWindowObject.am4geodata_worldLow;
