import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");
import ClassBreakInfo = require("esri/renderers/support/ClassBreakInfo");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");

import { updateSizeSlider } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";
import { SimpleMarkerSymbol } from "esri/symbols";
import { donutSymbol, updateSymbolStroke } from "./symbolUtils";
import { getVisualVariableByType, SizeParams, getVisualVariablesByType } from "./rendererUtils";

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
    const sizeVariable = getVisualVariableByType(result.renderer, "size") as esri.SizeVariable;
    const stops = sizeVariable.stops;

    const originalSymbol = (result.renderer.classBreakInfos[0].symbol as SimpleMarkerSymbol).clone();
    cimSymbolUtils.applyCIMSymbolColor(donutSymbol, originalSymbol.color);

    const symbolSize = originalSymbol.size;
    const outline = originalSymbol.outline;

    cimSymbolUtils.scaleCIMSymbolTo(donutSymbol, symbolSize);

    updateSymbolStroke(donutSymbol, outline.width, outline.color);

    result.renderer.field = field;
    result.renderer.normalizationField = normalizationField;
    result.renderer.valueExpression = valueExpression;
    result.renderer.classBreakInfos = [
      new ClassBreakInfo({ minValue: stops[0].value, maxValue: stops[2].value, symbol: donutSymbol }),
      new ClassBreakInfo({ minValue: stops[2].value, maxValue: stops[4].value, symbol: originalSymbol }),
    ];

    // avoid size slider
    return result;
  }

  await updateSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result
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

function updateVariableToAboveAverageTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  sizeVariable.minDataValue = stats.avg;
}

function updateVariableToBelowAverageTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  sizeVariable.flipSizes();
  sizeVariable.maxDataValue = stats.avg;
}

function updateVariableTo9010Theme( sizeVariable: esri.SizeVariable, stats: PercentileStats ){
  sizeVariable.minDataValue = stats["10"];
  sizeVariable.maxDataValue = stats["90"];
}

function updateVariableToAboveAndBelowTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  const { min, max, avg, stddev } = stats;
  const oldSizeVariable = sizeVariable.clone();


  const midDataValue = (avg + stddev) > 0 && 0 > (avg - stddev) ? 0 : avg;

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

  const midSize = Math.round(( maxSize - minSize) / 2);
  const minMidDataValue = ( midDataValue - oldSizeVariable.minDataValue ) / 2;
  const maxMidDataValue = ( oldSizeVariable.maxDataValue - midDataValue ) / 2;

  const stops = [
    new SizeStop({ value: oldSizeVariable.minDataValue, size: maxSize }),
    new SizeStop({ value: minMidDataValue, size: midSize }),
    new SizeStop({ value: midDataValue, size: minSize }),
    new SizeStop({ value: maxMidDataValue, size: midSize }),
    new SizeStop({ value: oldSizeVariable.maxDataValue, size: maxSize })
  ];

  sizeVariable.minDataValue = null;
  sizeVariable.maxDataValue = null;
  sizeVariable.minSize = null;
  sizeVariable.maxSize = null;

  sizeVariable.stops = stops;
}
