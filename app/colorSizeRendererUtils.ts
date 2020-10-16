import esri = __esri;
import colorSizeRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import colorRamps = require("esri/smartMapping/symbology/support/colorRamps");
import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");
import lang = require("esri/core/lang");

import { updateColorSizeSlider, colorPicker, SliderVars, updateColorSizeSliderColors } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";
import { SizeParams, getVisualVariablesByType, getVisualVariableByType, getSizeRendererColor, createAboveAndBelowRenderer } from "./rendererUtils";
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

  const visualVariables = updateVariablesFromTheme(result, theme, percentileStats);
  result.renderer.visualVariables = visualVariables;

  const sizeVariables = getVisualVariablesByType(result.renderer, "size") as esri.SizeVariable[];
  const colorVariables = getVisualVariablesByType(result.renderer, "color") as esri.ColorVariable[];

  result.size.visualVariables = sizeVariables;
  result.color.visualVariable = colorVariables[0];

  if(theme === "above-and-below" && useDonutsElement.checked){
    result.renderer = createAboveAndBelowRenderer(result.renderer);
  }

  await updateColorSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result,
    theme
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
      updateColorVariableToAboveAverageTheme( colorVariable, stats);
      break;
    case "below-average":
      updateVariableToBelowAverageTheme(sizeVariable, stats);
      updateColorVariableToBelowAverageTheme( colorVariable, stats);
      break;
    case "90-10":
      updateVariableTo9010Theme(sizeVariable, percentileStats);
      updateColorVariableTo9010Theme( colorVariable, percentileStats);
      break;
    case "above-and-below":
      updateVariableToAboveAndBelowTheme(sizeVariable, stats);
    default:
      // return variables without modifications
      break;
  }

  renderer.visualVariables = renderer.visualVariables.concat([sizeVariable, colorVariable]);

  return renderer.visualVariables;
}

function updateColorVariableToAboveAverageTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
  colorVariable.stops[0].value = stats.avg;
  colorVariable.stops[1].value = stats.avg;
  // colorVariable.stops[1].color = colorVariable.stops[0].color;
  colorVariable.stops[2].value = stats.avg;
  // colorVariable.stops[2].color = colorVariable.stops[0].color;
}

function updateColorVariableToBelowAverageTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
  reverseColors(colorVariable);
  colorVariable.stops[2].value = stats.avg;
  colorVariable.stops[3].value = stats.avg;
  // colorVariable.stops[3].color = colorVariable.stops[2].color;
  colorVariable.stops[4].value = stats.avg;
  // colorVariable.stops[4].color = colorVariable.stops[2].color;
}

function updateColorVariableTo9010Theme( colorVariable: esri.ColorVariable, stats: PercentileStats ){
  colorVariable.stops[0].value = stats["10"];
  colorVariable.stops[4].value = stats["90"];
}

function reverseColors( colorVariable: esri.ColorVariable ) {
  const colors = colorVariable.stops.map( stop => stop.color ).reverse();
  colorVariable.stops.forEach( (stop, i) => stop.color = colors[i] );
}

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