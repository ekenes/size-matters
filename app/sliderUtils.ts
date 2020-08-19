import esri = __esri;
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import { calculateHistogram } from "./statUtils";
import { updateRendererFromSizeSlider, getVisualVariableByType } from "./rendererUtils";

interface CreateSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.sizeContinuousRendererResult
}

let slider: SizeSlider = null;

export async function updateSizeSlider(params: CreateSizeSliderParams) {
  const { layer, view, rendererResult } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size");

  const { field, normalizationField, valueExpression } = sizeVariable as esri.SizeVariable;

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!slider){
    slider = SizeSlider.fromRendererResult(rendererResult, histogramResult);
    slider.container = "size-slider-container";
    slider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    slider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      const newRenderer = updateRendererFromSizeSlider(layer.renderer as esri.RendererWithVisualVariables, slider);
      layer.renderer = newRenderer;
    });
  } else {
    slider.updateFromRendererResult(rendererResult, histogramResult);
  }

}