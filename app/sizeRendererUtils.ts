import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");

import { updateSizeSlider, colorPicker } from "./sliderUtils";
import { getVisualVariableByType, getSizeRendererColor } from "./rendererUtils";
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

export async function createSizeRenderer(params: esri.sizeCreateContinuousRendererParams): Promise<esri.sizeContinuousRendererResult> {
  const { layer, view } = params;

  const theme = params.theme || "high-to-low";

  params.symbolType = "2d";

  let result = await sizeRendererCreator.createContinuousRenderer(params);

  const rendererColor = getSizeRendererColor(result.renderer as ClassBreaksRenderer);
  colorPicker.value = rendererColor.toHex();

  await updateSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result,
    theme
  });

  return result;
}

export function calcuateMidSize( minSize: number, maxSize: number): number {
  return Math.round(( maxSize - minSize) / 2) + minSize;
}