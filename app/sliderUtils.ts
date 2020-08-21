import esri = __esri;
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import ColorSizeSlider = require("esri/widgets/smartMapping/ColorSizeSlider");
import OpacitySlider = require("esri/widgets/smartMapping/OpacitySlider");
import { calculateHistogram } from "./statUtils";
import { getVisualVariableByType } from "./rendererUtils";
import { updateRendererFromSizeSlider } from "./sizeRendererUtils";
import { updateRendererFromColorSizeSlider } from "./colorSizeRendererUtils";

export class SliderVars {
  public static slider: SizeSlider = null;
  public static colorSizeSlider: ColorSizeSlider = null;
  public static opacitySlider: OpacitySlider = null;
}

interface CreateSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.sizeContinuousRendererResult
}

// const slidersContainer = document.getElementById("sliders-container");
const sizeSlidersContainer = document.getElementById("size-slider-container");
const opacitySlidersContainer = document.getElementById("opacity-slider-container");

export async function updateSizeSlider(params: CreateSizeSliderParams) {
  const { layer, view, rendererResult } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size") as esri.SizeVariable;

  const { field, normalizationField, valueExpression } = sizeVariable;

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!SliderVars.slider){
    SliderVars.slider = SizeSlider.fromRendererResult(rendererResult, histogramResult);
    SliderVars.slider.container = document.createElement("div");
    sizeSlidersContainer.appendChild(SliderVars.slider.container);
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

interface CreateColorSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.univariateColorSizeContinuousRendererResult
}

export async function updateColorSizeSlider(params: CreateColorSizeSliderParams) {
  const { layer, view, rendererResult } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size") as esri.SizeVariable;

  const { field, normalizationField, valueExpression } = sizeVariable;

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!SliderVars.colorSizeSlider){
    SliderVars.colorSizeSlider = ColorSizeSlider.fromRendererResult(rendererResult, histogramResult);
    SliderVars.colorSizeSlider.container = document.createElement("div");
    sizeSlidersContainer.appendChild(SliderVars.colorSizeSlider.container);
    SliderVars.colorSizeSlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    SliderVars.colorSizeSlider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      const newRenderer = updateRendererFromColorSizeSlider(layer.renderer as esri.RendererWithVisualVariables, SliderVars.colorSizeSlider);
      layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.colorSizeSlider.container as HTMLElement).style.display = "block";
    SliderVars.colorSizeSlider.updateFromRendererResult(rendererResult, histogramResult);
  }

}

interface CreateOpacitySliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  visualVariableResult: esri.opacityVisualVariableResult
}

export async function updateOpacitySlider(params: CreateOpacitySliderParams) {
  const { layer, view, visualVariableResult } = params;

  let opacityVariable = visualVariableResult.visualVariable;

  const { field, normalizationField, valueExpression } = opacityVariable;

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!SliderVars.opacitySlider){
    SliderVars.opacitySlider = OpacitySlider.fromVisualVariableResult(visualVariableResult, histogramResult);
    SliderVars.opacitySlider.container = document.createElement("div");
    opacitySlidersContainer.appendChild(SliderVars.opacitySlider.container);
    SliderVars.opacitySlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    SliderVars.opacitySlider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      const newRenderer = (layer.renderer as esri.RendererWithVisualVariables).clone();
      const opacityVariable = getVisualVariableByType(newRenderer, "opacity") as esri.OpacityVariable;
      opacityVariable.stops = SliderVars.opacitySlider.stops;
      layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.opacitySlider.container as HTMLElement).style.display = "block";
    SliderVars.opacitySlider.updateFromVisualVariableResult(visualVariableResult, histogramResult);
  }

}