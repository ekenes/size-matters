import esri = __esri;
import Color = require("esri/Color");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import ClassBreakInfo = require("esri/renderers/support/ClassBreakInfo");

import { createSizeRenderer } from "./sizeRendererUtils";
import { createColorSizeRenderer, useDonutsElement } from "./colorSizeRendererUtils";
import { SliderVars } from "./sliderUtils";
import { createOpacitySizeRenderer, opacityValuesContainer } from "./opacitySizeRendererUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { CIMSymbol, SimpleMarkerSymbol } from "esri/symbols";
import { donutSymbol, selectedSymbols, updateSymbolStroke, SymbolNames, symbolOptions } from "./symbolUtils";
import { LayerVars } from "./layerUtils";

export interface SizeParams extends esri.sizeCreateContinuousRendererParams {
  theme?: "high-to-low" | "90-10" | "above-average" | "below-average" | "above-and-below" | "extremes" | "centered-on",
  style?: "size" | "color-and-size" | "opacity-and-size"
}

const useDonutsParentElement = document.getElementById("use-donuts-parent") as HTMLDivElement;
const symbolColorContainer = document.getElementById("symbol-color-container") as HTMLDivElement;
const sizeOptionsElement = document.getElementById("size-options") as HTMLDivElement;
const opacityOptionsElement = document.getElementById("opacity-options") as HTMLDivElement;
const colorRampsElement = document.getElementById("color-ramps") as HTMLDivElement;

export async function updateRenderer(params: SizeParams){
  const { layer, theme } = params;
  const style = params.style || "size";

  let result = null;

  switch( style ){
    case "size":
      if(SliderVars.colorSizeSlider){
        SliderVars.colorSizeSlider.destroy();
        SliderVars.colorSizeSlider.container = null;
        SliderVars.colorSizeSlider = null;
      }
      if(SliderVars.opacitySlider){
        SliderVars.opacitySlider.destroy();
        SliderVars.opacitySlider.container = null;
        SliderVars.opacitySlider = null;
      }
      result = await createSizeRenderer(params);
      useDonutsParentElement.style.display = "none";
      symbolColorContainer.style.display = "block";
      opacityOptionsElement.style.display = "none";
      colorRampsElement.style.display = "none";
      break;
    case "color-and-size":
      if(SliderVars.slider){
        SliderVars.slider.destroy();
        SliderVars.slider.container = null;
        SliderVars.slider = null;
      }
      if(SliderVars.opacitySlider){
        SliderVars.opacitySlider.destroy();
        SliderVars.opacitySlider.container = null;
        SliderVars.opacitySlider = null;
      }
      if(theme === "above-and-below"){
        useDonutsParentElement.style.display = "block";
      } else {
        useDonutsParentElement.style.display = "none";
      }
      symbolColorContainer.style.display = "none";
      opacityOptionsElement.style.display = "none";
      colorRampsElement.style.display = "flex";
      result = await createColorSizeRenderer(params);
      break;
    case "opacity-and-size":
      if(SliderVars.colorSizeSlider){
        SliderVars.colorSizeSlider.destroy();
        SliderVars.colorSizeSlider.container = null;
        SliderVars.colorSizeSlider = null;
      }
      symbolColorContainer.style.display = "block";
      useDonutsParentElement.style.display = "none";
      opacityOptionsElement.style.display = "flex";
      colorRampsElement.style.display = "none";
      result = await createOpacitySizeRenderer(params);
      break;
    default:
      // return variables without modifications
      break;
  }


  sizeOptionsElement.style.display = "flex";

  layer.renderer = result.renderer.clone();
}

export function getVisualVariableByType(renderer: esri.RendererWithVisualVariables, type: "size" | "color" | "opacity" | "outline") {
  const visualVariables = renderer.visualVariables;
  return (
    visualVariables &&
    visualVariables.filter(function (vv) {
      if (type === "outline"){
        return vv.type === "size" && (vv as esri.SizeVariable).target === "outline";
      }
      return vv.type === type;
    })[0]
  );
}

export function getVisualVariablesByType(renderer: esri.RendererWithVisualVariables, type: "size" | "color" | "opacity") {
  const visualVariables = renderer.visualVariables;
  return (
    visualVariables &&
    visualVariables.filter(function (vv) {
      return vv.type === type;
    })
  );
}

export function getSizeRendererColor(renderer: ClassBreaksRenderer): Color {
  const classBreakInfos = renderer.classBreakInfos;
  const solidSymbol = classBreakInfos[classBreakInfos.length-1].symbol;
  return solidSymbol.color;
}

export function createRendererWithDonutSymbol(renderer: ClassBreaksRenderer): ClassBreaksRenderer {
  const rendererWithDonuts = renderer.clone();
  const sizeVariable = getVisualVariableByType(rendererWithDonuts, "size") as esri.SizeVariable;
  const { stops, field, normalizationField, valueExpression } = sizeVariable;

  if(!stops || stops.length < 4){
    console.error("The provided renderer does not use the above and below theme");
    return renderer;
  }

  let aboveSymbol, belowSymbol;

  if( selectedSymbols.name === "donuts"){
    aboveSymbol = (rendererWithDonuts.classBreakInfos[0].symbol as SimpleMarkerSymbol).clone();
    belowSymbol = donutSymbol;
    cimSymbolUtils.applyCIMSymbolColor(belowSymbol, aboveSymbol.color);

    const symbolSize = aboveSymbol.size;
    const outline = aboveSymbol.outline;

    cimSymbolUtils.scaleCIMSymbolTo(belowSymbol, symbolSize);

    updateSymbolStroke(belowSymbol, outline.width, outline.color);
  } else {
    aboveSymbol = selectedSymbols.above;
    belowSymbol = selectedSymbols.below;
  }

  rendererWithDonuts.field = field;
  rendererWithDonuts.normalizationField = normalizationField;
  rendererWithDonuts.valueExpression = valueExpression;
  rendererWithDonuts.classBreakInfos = [
    new ClassBreakInfo({ minValue: stops[0].value, maxValue: stops[2].value, symbol: belowSymbol }),
    new ClassBreakInfo({ minValue: stops[2].value, maxValue: stops[4].value, symbol: aboveSymbol }),
  ];

  rendererWithDonuts.authoringInfo.visualVariables[0].theme = "above-and-below";

  return rendererWithDonuts;
}

export function updateAboveAndBelowRendererSymbols(renderer: ClassBreaksRenderer, symbolName: SymbolNames ): ClassBreaksRenderer {
  const rendererWithDonuts = renderer.clone();
  const originalSymbol = rendererWithDonuts.classBreakInfos[0].symbol;
  const color = originalSymbol.type === "cim" ? cimSymbolUtils.getCIMSymbolColor(originalSymbol as CIMSymbol) : originalSymbol.color;

  const symbols = selectedSymbols;

  const aboveSymbol = symbols.above;
  const belowSymbol = symbols.below;

  if(aboveSymbol.type === "cim"){
    cimSymbolUtils.applyCIMSymbolColor(aboveSymbol, color);
  } else {
    aboveSymbol.color = color;
  }

  if(belowSymbol.type === "cim"){
    cimSymbolUtils.applyCIMSymbolColor(belowSymbol, color);
  } else {
    belowSymbol.color = color;
  }

  rendererWithDonuts.classBreakInfos[0].symbol = aboveSymbol;
  rendererWithDonuts.classBreakInfos[1].symbol = belowSymbol;

  return rendererWithDonuts;
}

function removeDonutFromRenderer(renderer: ClassBreaksRenderer): ClassBreaksRenderer {
  const rendererWithoutDonuts = renderer.clone();
  const classBreakInfos = rendererWithoutDonuts.classBreakInfos;

  if(classBreakInfos.length !== 2){
    console.error("The provided renderer doesn't have the correct number of class breaks");
    return renderer;
  }

  classBreakInfos.shift();
  classBreakInfos[0].minValue = -9007199254740991;
  classBreakInfos[0].maxValue = 9007199254740991;

  return rendererWithoutDonuts;
}

useDonutsElement.addEventListener("change", () => {
  const renderer = LayerVars.layer.renderer as ClassBreaksRenderer;
  LayerVars.layer.renderer = useDonutsElement.checked ? createRendererWithDonutSymbol(renderer) : removeDonutFromRenderer(renderer);
});
