import esri = __esri;
import colorSizeRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import colorRamps = require("esri/smartMapping/symbology/support/colorRamps");
import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");
import lang = require("esri/core/lang");

import { updateColorSizeSlider, colorPicker, SliderVars, updateColorSizeSliderColors } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";
import { SizeParams, getVisualVariablesByType, getVisualVariableByType, getSizeRendererColor, createRendererWithDonutSymbol } from "./rendererUtils";
import { updateVariableToAboveAverageTheme, updateVariableToBelowAverageTheme, updateVariableTo9010Theme, updateVariableToAboveAndBelowTheme } from "./sizeRendererUtils"
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { LayerVars } from "./layerUtils";

export const useDonutsElement = document.getElementById("use-donuts") as HTMLInputElement;

export function updateRendererFromColorSizeSlider(renderer: esri.RendererWithVisualVariables, slider: esri.ColorSizeSlider){

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  let colorVariable = getVisualVariableByType(renderer, "color") as esri.ColorVariable;
  const colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
  renderer.visualVariables.splice(colorVariableIndex, 1);

  renderer.visualVariables = slider.updateVisualVariables([sizeVariable, colorVariable]);

  return renderer.clone();
}

/////////////////////////////////////
///
/// Color and Size Renderer
///
//////////////////////////////////////

export async function createColorSizeRenderer(params: SizeParams): Promise<esri.univariateColorSizeContinuousRendererResult> {
  const { layer, view, field, normalizationField, valueExpression } = params;

  const invalidColorThemes: SizeParams["theme"][] = [ "90-10", "above-average", "below-average", "centered-on", "extremes" ];
  const theme = lang.clone(params.theme) || "high-to-low";
  params.theme = invalidColorThemes.indexOf(theme) > -1 ? "high-to-low" : params.theme;

  let result = await colorSizeRendererCreator.createContinuousRenderer(params);
  result.renderer.authoringInfo.type = "univariate-color-size";

  const rendererColor = getSizeRendererColor(result.renderer as ClassBreaksRenderer);
  colorPicker.value = rendererColor.toHex();

  const percentileStats = await calculate9010Percentile({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    field, normalizationField, valueExpression
  });

  const visualVariables = updateVariablesFromTheme(result, params.theme, percentileStats);
  result.renderer.visualVariables = visualVariables;

  const sizeVariables = getVisualVariablesByType(result.renderer, "size") as esri.SizeVariable[];
  const colorVariables = getVisualVariablesByType(result.renderer, "color") as esri.ColorVariable[];

  result.size.visualVariables = sizeVariables;
  result.color.visualVariable = colorVariables[0];

  if(theme === "above-and-below" && useDonutsElement.checked){
    result.renderer = createRendererWithDonutSymbol(result.renderer);
    // avoid size slider
    return result;
  }

  await updateColorSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result
  });

  createColorRamps(theme);

  return result;
}

type RendererResult = esri.univariateColorSizeContinuousRendererResult

function updateVariablesFromTheme( rendererResult: RendererResult, theme: SizeParams["theme"], percentileStats?: PercentileStats){
  const stats = rendererResult.statistics;
  const renderer = rendererResult.renderer.clone();

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  let colorVariable = getVisualVariableByType(renderer, "color") as esri.ColorVariable;
  const colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
  renderer.visualVariables.splice(colorVariableIndex, 1);

  switch( theme ){
    case "above-average":
      updateVariableToAboveAverageTheme(sizeVariable, stats);
      break;
    case "below-average":
      updateVariableToBelowAverageTheme(sizeVariable, stats);
      break;
    case "90-10":
      updateVariableTo9010Theme(sizeVariable, percentileStats);
      break;
    case "above-and-below":
      updateVariableToAboveAndBelowTheme(sizeVariable, stats);
    default:
      // return variables without modifications
      break;
  }

  renderer.visualVariables = renderer.visualVariables.concat([sizeVariable, colorVariable]);

  return renderer.visualVariables//[sizeVariable, colorVariable];
}

// function updateColorVariableToAboveAverageTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
//   colorVariable.minDataValue = stats.avg;
// }

// function updateColorVariableToBelowAverageTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
//   colorVariable.flipSizes();
//   colorVariable.maxDataValue = stats.avg;
// }

// function updateColorVariableTo9010Theme( colorVariable: esri.ColorVariable, stats: PercentileStats ){
//   colorVariable.minDataValue = stats["10"];
//   colorVariable.maxDataValue = stats["90"];
// }

// function updateColorVariableToAboveAndBelowTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
//   const { min, max, avg, stddev } = stats;
//   const oldSizeVariable = colorVariable.clone();


//   const midDataValue = (avg + stddev) > 0 && 0 > (avg - stddev) ? 0 : avg;

//   let minSize: number, maxSize: number = null;

//   if( typeof oldSizeVariable.minSize === "object"){
//     const stops = oldSizeVariable.minSize.stops;
//     const numStops = stops.length;
//     const midIndex = Math.floor(numStops/2);
//     minSize = stops[midIndex].size;
//   } else {
//     minSize = oldSizeVariable.minSize;
//   }

//   if( typeof oldSizeVariable.maxSize === "object"){
//     const stops = oldSizeVariable.maxSize.stops;
//     const numStops = stops.length;
//     const midIndex = Math.floor(numStops/2);
//     maxSize = stops[midIndex].size;
//   } else {
//     maxSize = oldSizeVariable.maxSize;
//   }

//   const midSize = Math.round(( maxSize - minSize) / 2);
//   const minMidDataValue = ( midDataValue - oldSizeVariable.minDataValue ) / 2;
//   const maxMidDataValue = ( oldSizeVariable.maxDataValue - midDataValue ) / 2;

//   const stops = [
//     new SizeStop({ value: oldSizeVariable.minDataValue, size: maxSize }),
//     new SizeStop({ value: minMidDataValue, size: midSize }),
//     new SizeStop({ value: midDataValue, size: minSize }),
//     new SizeStop({ value: maxMidDataValue, size: midSize }),
//     new SizeStop({ value: oldSizeVariable.maxDataValue, size: maxSize })
//   ];

//   sizeVariable.minDataValue = null;
//   sizeVariable.maxDataValue = null;
//   sizeVariable.minSize = null;
//   sizeVariable.maxSize = null;

//   sizeVariable.stops = stops;
// }


const colorRampsElement = document.getElementById("color-ramps") as HTMLDivElement;

function createColorRamps(theme: SizeParams["theme"]){
  colorRampsElement.innerHTML = null;
  const excludedTags = [ "extremes", "heatmap", "point-cloud", "categorical", "centered-on" ];

  const ramps = colorRamps.byTag({
    includedTags: theme === "above-and-below" ? [ "diverging" ] : ["sequential"],
    excludedTags: theme === "above-and-below" ? excludedTags : excludedTags.concat(["diverging"])
  });

  ramps.sort(function(a, b) {
    return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
  });

  ramps.forEach((ramp) => {

    const rampElement = symbolUtils.renderColorRampPreviewHTML(ramp.colors, {
      align: "vertical",
      gradient: true,
      width: 10,
      height: 30
    });

    const rampContainer = document.createElement("div");
    rampContainer.classList.add("ramps");
    rampContainer.title = ramp.name;
    rampContainer.appendChild(rampElement);
    rampContainer.addEventListener("click", (event) => {
      updateColorVariableRamp(ramp.colors);
    });
    colorRampsElement.appendChild(rampContainer);
  });
}

function updateColorVariableRamp(colors: Color[]) {
  const renderer = (LayerVars.layer.renderer as ClassBreaksRenderer).clone();

  const colorVariable = getVisualVariableByType(renderer, "color") as esri.ColorVariable;
  colorVariable.stops.forEach( (stop, i) => {
    stop.color = colors[i];
  });

  LayerVars.layer.renderer = renderer;
  updateColorSizeSliderColors(colorVariable);
}