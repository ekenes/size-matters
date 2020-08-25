import esri = __esri;
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import ColorSizeSlider = require("esri/widgets/smartMapping/ColorSizeSlider");
import Slider = require("esri/widgets/Slider");
import OpacitySlider = require("esri/widgets/smartMapping/OpacitySlider");
import { calculateHistogram } from "./statUtils";
import { getVisualVariableByType } from "./rendererUtils";
import { updateRendererFromSizeSlider, calcuateMidSize } from "./sizeRendererUtils";
import { updateRendererFromColorSizeSlider } from "./colorSizeRendererUtils";

export class SliderVars {
  public static slider: SizeSlider = null;
  public static symbolSizesSlider: Slider = null;
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
const symbolSizesContainer = document.getElementById("symbol-sizes");

export async function updateSizeSlider(params: CreateSizeSliderParams) {
  const { layer, view, rendererResult } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size") as esri.SizeVariable;

  const { field, normalizationField, valueExpression, minSize, maxSize, stops } = sizeVariable;
  let symbolSizeSliderValues: number[] = [];

  if(stops && stops.length > 0){
    const lastStop = stops[stops.length-1];
    const firstStop = stops[0];

    symbolSizeSliderValues = [ firstStop.size, lastStop.size ];
  }
  if(minSize && maxSize){
    symbolSizeSliderValues = [ minSize as number, maxSize as number ];
  }

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


  updateSymbolSizesSlider({ layer, values: symbolSizeSliderValues });

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

interface UpdateSymbolSizesSlider {
  values: number[],
  layer: esri.FeatureLayer
}

function updateSymbolSizesSlider(params: UpdateSymbolSizesSlider){
  const { layer, values } = params;
  if(!SliderVars.symbolSizesSlider){
    SliderVars.symbolSizesSlider = new Slider({
      values,
      container: symbolSizesContainer,
      min: 1,
      max: 120,
      steps: 0.5,
      labelInputsEnabled: true,
      rangeLabelInputsEnabled: true,
      visibleElements: {
        rangeLabels: true,
        labels: true
      }
    });
    SliderVars.symbolSizesSlider.watch("values", function(values){
      const renderer = (layer.renderer as esri.RendererWithVisualVariables).clone();
      const sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
      const { stops, minSize, maxSize } = sizeVariable;

      if(stops && stops.length > 0){
        const midSize = calcuateMidSize(minSize as number, maxSize as number);
        stops[0].size = maxSize as number;
        stops[1].size = midSize;
        stops[2].size = minSize as number;
        stops[3].size = midSize;
        stops[4].size = maxSize as number;
      } else {
        sizeVariable.minSize = values[0];
        sizeVariable.maxSize = values[1];
      }

      layer.renderer = renderer;
    });
  } else {
    SliderVars.symbolSizesSlider.values = values;
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