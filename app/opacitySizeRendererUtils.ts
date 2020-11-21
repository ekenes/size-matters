import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");
import OpacityStop = require("esri/renderers/visualVariables/support/OpacityStop");
import OpacityVariable = require("esri/renderers/visualVariables/OpacityVariable");

import { updateSizeSlider, updateOpacitySlider, updateOpacityValuesSlider, colorPicker } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";
import { SizeParams, getVisualVariablesByType, getVisualVariableByType, getSizeRendererColor } from "./rendererUtils";
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

  let result = await sizeRendererCreator.createContinuousRenderer(params as esri.sizeCreateContinuousRendererParams);

  const rendererColor = getSizeRendererColor(result.renderer as ClassBreaksRenderer);
  colorPicker.value = rendererColor.toHex();

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
