import esri = __esri;
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import { calculateHistogram } from "./statUtils";
import { updateRendererFromSizeSlider, getVisualVariableByType } from "./rendererUtils";

interface CreateSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.sizeContinuousRendererResult
}

export class SliderVars {
  public static slider: SizeSlider = null;
}

export async function updateSizeSlider(params: CreateSizeSliderParams) {
  const { layer, view, rendererResult } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size");

  const { field, normalizationField, valueExpression } = sizeVariable as esri.SizeVariable;

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!SliderVars.slider){
    SliderVars.slider = SizeSlider.fromRendererResult(rendererResult, histogramResult);
    SliderVars.slider.container = "size-slider-container";
    SliderVars.slider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    SliderVars.slider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      const newRenderer = updateRendererFromSizeSlider(layer.renderer as esri.RendererWithVisualVariables, SliderVars.slider);
      layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.slider.container as HTMLElement).style.display = "block";
    SliderVars.slider.updateFromRendererResult(rendererResult, histogramResult);
  }

}