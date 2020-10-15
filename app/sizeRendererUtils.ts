import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");

import { updateSizeSlider, colorPicker } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";
import { getVisualVariableByType, SizeParams, getVisualVariablesByType, getSizeRendererColor, createRendererWithDonutSymbol } from "./rendererUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";

export function updateRendererFromSizeSlider(renderer: esri.RendererWithVisualVariables, slider: esri.SizeSlider){

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  renderer.visualVariables.push(slider.updateVisualVariable(sizeVariable));

  return renderer.clone();
}

/////////////////////////////////////
///
/// Size Renderer
///
//////////////////////////////////////

export async function createSizeRenderer(params: SizeParams): Promise<esri.sizeContinuousRendererResult> {
  const { layer, view, field, normalizationField, valueExpression } = params;

  const theme = params.theme || "high-to-low";

  let result = await sizeRendererCreator.createContinuousRenderer(params);

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
  result.visualVariables = sizeVariables;

  if(theme === "above-and-below"){
    result.renderer = createRendererWithDonutSymbol(result.renderer);
  }

  await updateSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result,
    theme
  });

  return result;
}

type RendererResult = esri.sizeContinuousRendererResult

function updateVariablesFromTheme( rendererResult: RendererResult, theme: SizeParams["theme"], percentileStats?: PercentileStats){
  const stats = rendererResult.statistics;
  const renderer = rendererResult.renderer.clone();
  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);

  renderer.visualVariables.splice(sizeVariableIndex, 1);

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

  renderer.visualVariables.push(sizeVariable);

  return renderer.visualVariables;
}

export function updateVariableToAboveAverageTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  sizeVariable.minDataValue = stats.avg;
}

export function updateVariableToBelowAverageTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  sizeVariable.flipSizes();
  sizeVariable.maxDataValue = stats.avg;
}

export function updateVariableTo9010Theme( sizeVariable: esri.SizeVariable, stats: PercentileStats ){
  sizeVariable.minDataValue = stats["10"];
  sizeVariable.maxDataValue = stats["90"];
}

export function updateVariableToAboveAndBelowTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  const { min, max, avg, stddev } = stats;
  const oldSizeVariable = sizeVariable.clone();


  const midDataValue = (avg + stddev) > 0 && 0 > (avg - stddev) ? 0 : avg;
  const aboveAvgSpread = max - midDataValue;
  const belowAvgSpread = midDataValue - min;
  const maxSpread = aboveAvgSpread > belowAvgSpread ? aboveAvgSpread : belowAvgSpread;
  const maxDataValue = midDataValue + maxSpread;
  const minDataValue = midDataValue - maxSpread;

  let minSize: number, maxSize: number = null;

  if( typeof oldSizeVariable.minSize === "object"){
    const stops = oldSizeVariable.minSize.stops;
    const numStops = stops.length;
    const midIndex = Math.floor(numStops/2);
    minSize = stops[midIndex].size;
  } else {
    minSize = oldSizeVariable.minSize;
  }

  if( typeof oldSizeVariable.maxSize === "object"){
    const stops = oldSizeVariable.maxSize.stops;
    const numStops = stops.length;
    const midIndex = Math.floor(numStops/2);
    maxSize = stops[midIndex].size;
  } else {
    maxSize = oldSizeVariable.maxSize;
  }

  const midSize = calcuateMidSize(minSize, maxSize);
  const minMidDataValue = midDataValue - (( midDataValue - minDataValue ) / 2);
  const maxMidDataValue = (( maxDataValue - midDataValue ) / 2) + midDataValue;

  const stops = [
    new SizeStop({ value: minDataValue, size: maxSize }),
    new SizeStop({ value: minMidDataValue, size: midSize }),
    new SizeStop({ value: midDataValue, size: minSize }),
    new SizeStop({ value: maxMidDataValue, size: midSize }),
    new SizeStop({ value: maxDataValue, size: maxSize })
  ];

  sizeVariable.minDataValue = null;
  sizeVariable.maxDataValue = null;
  sizeVariable.minSize = null;
  sizeVariable.maxSize = null;

  sizeVariable.stops = stops;
}

export function calcuateMidSize( minSize: number, maxSize: number): number {
  return Math.round(( maxSize - minSize) / 2) + minSize;
}