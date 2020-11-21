import CIMSymbol = require("esri/symbols/CIMSymbol");
import Color = require("esri/Color");
import WebStyleSymbol = require("esri/symbols/WebStyleSymbol");
import promiseUtils = require("esri/core/promiseUtils");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import { SimpleLineSymbol, SimpleMarkerSymbol } from "esri/symbols";

const styleUrl = "https://www.arcgis.com/sharing/rest/content/items/a19aa7c44b824838a8bb1ba3492f7780/data";

const dottedUp = new WebStyleSymbol({
  styleUrl,
  name: "dotted arrow up"
});

const dottedDown = new WebStyleSymbol({
  styleUrl,
  name: "dotted arrow down"
});

export type SymbolNames = "donuts" | "rings" | "carets" | "arrows" | "plusMinus" | "radio" | "triangles" | "plusMinusCircle" | "highLow" | "happySad";

export const symbolOptions = {
  dottedArrows: {
    name: "dottedArrows",
    above: dottedUp,
    below: dottedDown
  }
}

interface SymbolOption {
  name: string,
  above: CIMSymbol | WebStyleSymbol | SimpleMarkerSymbol | SimpleLineSymbol,
  below: CIMSymbol | WebStyleSymbol | SimpleMarkerSymbol | SimpleLineSymbol
}

export async function fetchCIMdata(){
  const response = await promiseUtils.eachAlways([
    dottedUp.fetchCIMSymbol(),
    dottedDown.fetchCIMSymbol()
  ]);

  symbolOptions.dottedArrows.above = response[0].value;
  symbolOptions.dottedArrows.below = response[1].value;
}