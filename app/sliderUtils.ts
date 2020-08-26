import esri = __esri;
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import ColorSizeSlider = require("esri/widgets/smartMapping/ColorSizeSlider");
import Slider = require("esri/widgets/Slider");
import OpacitySlider = require("esri/widgets/smartMapping/OpacitySlider");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import Color = require("esri/Color");

import { calculateHistogram } from "./statUtils";
import { getVisualVariableByType, SizeParams, getSizeRendererColor } from "./rendererUtils";
import { updateRendererFromSizeSlider, calcuateMidSize } from "./sizeRendererUtils";
import { updateRendererFromColorSizeSlider } from "./colorSizeRendererUtils";
import { LayerVars } from "./layerUtils";
import { RendererWithVisualVariables } from "esri/renderers";
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { CIMSymbol, MarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";

export class SliderVars {
  public static slider: SizeSlider = null;
  public static symbolSizesSlider: Slider = null;
  public static colorSizeSlider: ColorSizeSlider = null;
  public static opacitySlider: OpacitySlider = null;
}

interface CreateSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.sizeContinuousRendererResult,
  theme: SizeParams["theme"]
}

// const slidersContainer = document.getElementById("sliders-container");
const sizeSlidersContainer = document.getElementById("size-slider-container");
const opacitySlidersContainer = document.getElementById("opacity-slider-container");
const symbolSizesContainer = document.getElementById("symbol-sizes");
const sizeOptionsElement = document.getElementById("size-options") as HTMLDivElement;
export const colorPicker = document.getElementById("color-picker") as HTMLInputElement;

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
      const newRenderer = updateRendererFromSizeSlider(LayerVars.layer.renderer as esri.RendererWithVisualVariables, SliderVars.slider);
      LayerVars.layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.slider.container as HTMLElement).style.display = "block";
    SliderVars.slider.updateFromRendererResult(rendererResult, histogramResult);
  }

  updateSymbolSizesSlider({ values: symbolSizeSliderValues });
  sizeOptionsElement.style.display = "flex";
}

interface CreateColorSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.univariateColorSizeContinuousRendererResult
}

export async function updateColorSizeSlider(params: CreateColorSizeSliderParams) {
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
      const newRenderer = updateRendererFromColorSizeSlider(LayerVars.layer.renderer as esri.RendererWithVisualVariables, SliderVars.colorSizeSlider);
      LayerVars.layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.colorSizeSlider.container as HTMLElement).style.display = "block";
    SliderVars.colorSizeSlider.updateFromRendererResult(rendererResult, histogramResult);
  }

  updateSymbolSizesSlider({ values: symbolSizeSliderValues });
}

interface UpdateSymbolSizesSlider {
  values: number[]
}

function updateSymbolSizesSlider(params: UpdateSymbolSizesSlider){
  const { values } = params;
  if(!SliderVars.symbolSizesSlider){
    SliderVars.symbolSizesSlider = new Slider({
      values,
      container: symbolSizesContainer,
      min: 1,
      max: 40,
      steps: 0.5,
      labelInputsEnabled: true,
      rangeLabelInputsEnabled: true,
      visibleElements: {
        rangeLabels: true,
        labels: true
      }
    });
    SliderVars.symbolSizesSlider.watch("values", function(values: number[]){
      const renderer = (LayerVars.layer.renderer as esri.RendererWithVisualVariables).clone();
      const sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
      let { stops, minSize, maxSize } = sizeVariable;

      if(stops && stops.length > 0){
        const minSize = values[0];
        const maxSize = values[1];
        const midSize = calcuateMidSize(minSize as number, maxSize as number);
        stops[0].size = maxSize;
        stops[1].size = midSize;
        stops[2].size = minSize;
        stops[3].size = midSize;
        stops[4].size = maxSize;
      } else {
        sizeVariable.minSize = values[0];
        sizeVariable.maxSize = values[1];
      }

      LayerVars.layer.renderer = renderer;
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
      const newRenderer = (LayerVars.layer.renderer as esri.RendererWithVisualVariables).clone();
      const opacityVariable = getVisualVariableByType(newRenderer, "opacity") as esri.OpacityVariable;
      opacityVariable.stops = SliderVars.opacitySlider.stops;
      LayerVars.layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.opacitySlider.container as HTMLElement).style.display = "block";
    SliderVars.opacitySlider.updateFromVisualVariableResult(visualVariableResult, histogramResult);
  }

}

type SymbolWithColor = SimpleMarkerSymbol | SimpleLineSymbol | SimpleFillSymbol

colorPicker.addEventListener("input", function(event){
  const newColor = new Color(colorPicker.value);
  const renderer = (LayerVars.layer.renderer as ClassBreaksRenderer).clone();
  const classBreakInfos = renderer.classBreakInfos;

  classBreakInfos.forEach( (info) => {
    const symbol = info.symbol;

    if(symbol.type === "cim"){
      cimSymbolUtils.applyCIMSymbolColor(symbol as CIMSymbol, newColor);
    } else {
      (symbol as SymbolWithColor).color = newColor;
    }
  });

  LayerVars.layer.renderer = renderer;
});

export function destroySizeSlider(){
  SliderVars.slider.destroy();
  SliderVars.slider.container = null;
  SliderVars.slider = null;
}