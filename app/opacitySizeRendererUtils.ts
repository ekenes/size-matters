import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");
import OpacityStop = require("esri/renderers/visualVariables/support/OpacityStop");
import OpacityVariable = require("esri/renderers/visualVariables/OpacityVariable");
import lang = require("esri/core/lang");

import { updateSizeSlider, updateOpacitySlider, updateOpacityValuesSlider, colorPicker } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";
import { SizeParams, getVisualVariablesByType, getVisualVariableByType, getSizeRendererColor } from "./rendererUtils";
import { updateVariableToAboveAverageTheme, updateVariableToBelowAverageTheme, updateVariableTo9010Theme, updateVariableToAboveAndBelowTheme } from "./sizeRendererUtils"
import { ClassBreaksRenderer } from "esri/rasterRenderers";

export const opacityValuesContainer = document.getElementById("opacity-values-container") as HTMLDivElement;

export function updateRendererFromOpacitySlider(renderer: esri.RendererWithVisualVariables, slider: esri.SizeSlider){

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  let colorVariable = getVisualVariableByType(renderer, "color") as esri.ColorVariable;
  const colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
  renderer.visualVariables.splice(colorVariableIndex, 1);

  renderer.visualVariables = [ slider.updateVisualVariable(sizeVariable) ];

  return renderer.clone();
}

/////////////////////////////////////
///
/// Opacity and Size Renderer
///
//////////////////////////////////////

export async function createOpacitySizeRenderer(params: SizeParams): Promise<esri.sizeContinuousRendererResult> {
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
  const opacityVariable = getVisualVariableByType(result.renderer, "opacity") as OpacityVariable;
  result.visualVariables = sizeVariables;

  await updateOpacitySlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    visualVariableResult: {
      statistics: result.statistics,
      visualVariable: opacityVariable,
      defaultValuesUsed: false,
      authoringInfo: result.renderer.authoringInfo
    }
  });

  if(theme === "above-and-below"){
    return result;
  }

  await updateSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result,
    theme
  });

  const opacityValues = opacityVariable.stops.map( stop => stop.opacity );
  updateOpacityValuesSlider({ values: opacityValues });

  return result;
}

type RendererResult = esri.sizeContinuousRendererResult;

function updateVariablesFromTheme( rendererResult: RendererResult, theme: SizeParams["theme"], percentileStats?: PercentileStats){
  const stats = rendererResult.statistics;
  const renderer = rendererResult.renderer.clone();

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  let opacityStops: OpacityStop[] = null;

  switch( theme ){
    case "above-average":
      updateVariableToAboveAverageTheme(sizeVariable, stats);
      opacityStops = createOpacityStopsWithAboveAverageTheme(stats);
      break;
    case "below-average":
      updateVariableToBelowAverageTheme(sizeVariable, stats);
      opacityStops = createOpacityStopsWithBelowAverageTheme(stats);
      break;
    case "90-10":
      updateVariableTo9010Theme(sizeVariable, percentileStats);
      opacityStops = createOpacityStopsWith9010Theme(percentileStats);
      break;
    case "above-and-below":
      updateVariableToAboveAndBelowTheme(sizeVariable, stats);
      opacityStops = createOpacityStopsWithAboveAndBelowTheme(stats);
      break;
    case "centered-on":
      opacityStops = createOpacityStopsWithCenteredOnTheme(stats);
      break;
    case "extremes":
      opacityStops = createOpacityStopsWithExtremesTheme(stats);
      break;
    default:
      opacityStops = createOpacityStopsWithHighToLowTheme(stats);
      break;
  }

  const opacityVariable = createOpacityVariable(sizeVariable, opacityStops);

  renderer.visualVariables = renderer.visualVariables.concat([sizeVariable, opacityVariable]);

  return renderer.visualVariables;
}

function createOpacityVariable(sizeVariable: esri.SizeVariable, stops: OpacityStop[]): OpacityVariable {
  const { field, normalizationField, valueExpression } = sizeVariable;
  return new OpacityVariable({
    field,
    normalizationField,
    valueExpression,
    stops
  });
}

export const minOpacity = 0.2;
export const maxOpacity = 1.0;

function createOpacityStopsWithHighToLowTheme( stats: esri.sizeContinuousRendererResult["statistics"] ): OpacityStop[] {
  const { max, min } = stats;

  return [
    new OpacityStop({
      value: min, opacity: minOpacity
    }),
    new OpacityStop({
      value: max, opacity: maxOpacity
    })
  ];
}

function createOpacityStopsWithAboveAverageTheme( stats: esri.sizeContinuousRendererResult["statistics"] ): OpacityStop[] {
  const { max, avg } = stats;

  return [
    new OpacityStop({
      value: avg, opacity: minOpacity
    }),
    new OpacityStop({
      value: max, opacity: maxOpacity
    })
  ];
}

function createOpacityStopsWithBelowAverageTheme( stats: esri.sizeContinuousRendererResult["statistics"] ): OpacityStop[] {
  const { min, avg } = stats;

  return [
    new OpacityStop({
      value: min, opacity: maxOpacity
    }),
    new OpacityStop({
      value: avg, opacity: minOpacity
    })
  ];
}

function createOpacityStopsWith9010Theme( stats: PercentileStats ): OpacityStop[] {
  return [
    new OpacityStop({
      value: stats["10"], opacity: minOpacity
    }),
    new OpacityStop({
      value: stats["90"], opacity: maxOpacity
    })
  ];
}

function createOpacityStopsWithAboveAndBelowTheme( stats: esri.sizeContinuousRendererResult["statistics"] ): OpacityStop[] {
  const { max, avg, stddev } = stats;

  return [
    new OpacityStop({
      value: avg, opacity: minOpacity
    }),
    new OpacityStop({
      value: avg + stddev, opacity: maxOpacity
    })
  ];
}

function createOpacityStopsWithExtremesTheme( stats: esri.sizeContinuousRendererResult["statistics"] ): OpacityStop[] {
  const { min, max, avg, stddev } = stats;

  return [
    new OpacityStop({
      value: min, opacity: maxOpacity
    }),
    new OpacityStop({
      value: avg, opacity: minOpacity
    }),
    new OpacityStop({
      value: max, opacity: maxOpacity
    })
  ];
}

function createOpacityStopsWithCenteredOnTheme( stats: esri.sizeContinuousRendererResult["statistics"] ): OpacityStop[] {
  const { min, max, avg, stddev } = stats;

  return [
    new OpacityStop({
      value: min, opacity: minOpacity
    }),
    new OpacityStop({
      value: avg, opacity: maxOpacity
    }),
    new OpacityStop({
      value: max, opacity: minOpacity
    })
  ];
}
