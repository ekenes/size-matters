import esri = __esri;
import Color = require("esri/Color");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import ClassBreakInfo = require("esri/renderers/support/ClassBreakInfo");

import { createSizeRenderer } from "./sizeRendererUtils";
import { createColorSizeRenderer, useDonutsElement } from "./colorSizeRendererUtils";
import { SliderVars } from "./sliderUtils";
import { createOpacitySizeRenderer, opacityValuesContainer } from "./opacitySizeRendererUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { CIMSymbol, Symbol } from "esri/symbols";
import {  symbolOptions } from "./symbolUtils";

export type SizeParams = esri.sizeCreateContinuousRendererParams | esri.univariateColorSizeCreateContinuousRendererParams;
export type Style = "size" | "color-and-size" | "opacity-and-size";

const binaryParentElement = document.getElementById("binary-parent") as HTMLDivElement;
const isBinaryElement = document.getElementById("binary-switch") as HTMLInputElement;
const symbolColorContainer = document.getElementById("symbol-color-container") as HTMLDivElement;
const symbolColor = document.getElementById("symbol-color") as HTMLDivElement;
const symbolColorAbove = document.getElementById("symbol-color-above") as HTMLDivElement;
const symbolColorBelow = document.getElementById("symbol-color-below") as HTMLDivElement;
const sizeOptionsElement = document.getElementById("size-options") as HTMLDivElement;
const opacityOptionsElement = document.getElementById("opacity-options") as HTMLDivElement;
const colorRampsContainer = document.getElementById("color-ramps-container") as HTMLDivElement;
const symbolsSelect = document.getElementById("symbols-select") as HTMLSelectElement;
const themeSelect = document.getElementById("theme-select") as HTMLSelectElement;

export async function updateRenderer(params: SizeParams, style: Style){
  const { layer, theme } = params;

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
      [].forEach.call(  themeSelect , function(option: HTMLOptionElement){
        option.disabled = option.value === "above-and-below";
      });
      if(params.theme === "above-and-below"){
        params.theme = "high-to-low";
        themeSelect.value = "high-to-low";
      }

      result = await createSizeRenderer(params as esri.sizeCreateContinuousRendererParams);

      symbolColor.style.display = "block";
      symbolColorAbove.style.display = "none";
      symbolColorBelow.style.display = "none";

      binaryParentElement.style.display = "none";
      symbolColorContainer.style.display = "block";
      opacityOptionsElement.style.display = "none";
      colorRampsContainer.style.display = "none";
      break;
    case "color-and-size":
      const useSizeSlider = isBinaryElement.checked && theme === "above-and-below";
      symbolColor.style.display = "none";
      if(SliderVars.slider && !useSizeSlider ){
        SliderVars.slider.destroy();
        SliderVars.slider.container = null;
        SliderVars.slider = null;

        symbolColorAbove.style.display = "none";
        symbolColorBelow.style.display = "none";
        symbolColorContainer.style.display = "none";
        colorRampsContainer.style.display = "flex";
      }
      if(SliderVars.colorSizeSlider && useSizeSlider){
        SliderVars.colorSizeSlider.destroy();
        SliderVars.colorSizeSlider.container = null;
        SliderVars.colorSizeSlider = null;

        symbolColorAbove.style.display = "block";
        symbolColorBelow.style.display = "block";
        symbolColorContainer.style.display = "block";
        colorRampsContainer.style.display = "none";
      }
      if(SliderVars.opacitySlider){
        SliderVars.opacitySlider.destroy();
        SliderVars.opacitySlider.container = null;
        SliderVars.opacitySlider = null;
      }
      [].forEach.call(  themeSelect , function(option: HTMLOptionElement){
        option.disabled = false;
      });
      if(theme === "above-and-below"){
        binaryParentElement.style.display = "block";
        (params as esri.univariateColorSizeCreateContinuousRendererParams).colorOptions = {
          isContinuous: !isBinaryElement.checked
        };

        if(symbolsSelect.value){
          if(symbolsSelect.value === "custom"){
            (params as esri.univariateColorSizeCreateContinuousRendererParams).symbolOptions = {
              symbolStyle: null,
              symbols: {
                above: symbolOptions.dottedArrows.above,
                below: symbolOptions.dottedArrows.below
              }
            }
          } else {
            (params as esri.univariateColorSizeCreateContinuousRendererParams).symbolOptions = {
              symbolStyle: symbolsSelect.value !== "" ? symbolsSelect.value as any : null
            }
          }
        }

      } else {
        binaryParentElement.style.display = "none";
      }
      // symbolColorContainer.style.display = "none";
      opacityOptionsElement.style.display = "none";
      // colorRampsContainer.style.display = "flex";
      result = await createColorSizeRenderer(params as esri.univariateColorSizeCreateContinuousRendererParams);
      break;
    case "opacity-and-size":
      if(SliderVars.colorSizeSlider){
        SliderVars.colorSizeSlider.destroy();
        SliderVars.colorSizeSlider.container = null;
        SliderVars.colorSizeSlider = null;
      }
      symbolColorContainer.style.display = "block";
      opacityOptionsElement.style.display = "flex";
      colorRampsContainer.style.display = "none";
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

export function getSymbolColor(symbol: Symbol | CIMSymbol): Color {
  const color = symbol.type === "cim" ? cimSymbolUtils.getCIMSymbolColor(symbol as CIMSymbol) : symbol.color;
  return color;
}
