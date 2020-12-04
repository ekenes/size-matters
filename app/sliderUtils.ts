import esri = __esri;
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import ColorSizeSlider = require("esri/widgets/smartMapping/ColorSizeSlider");
import BinaryColorSizeSlider = require("esri/widgets/smartMapping/BinaryColorSizeSlider");
import Slider = require("esri/widgets/Slider");
import OpacitySlider = require("esri/widgets/smartMapping/OpacitySlider");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import Color = require("esri/Color");

import { calculateHistogram } from "./statUtils";
import { getVisualVariableByType, SizeParams, getSizeRendererColor } from "./rendererUtils";
import { calcuateMidSize, updateRendererFromSizeSlider } from "./sizeRendererUtils";
import { updateRendererFromColorSizeSlider } from "./colorSizeRendererUtils";
import { LayerVars } from "./layerUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { CIMSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";

export class SliderVars {
  public static slider: SizeSlider = null;
  public static symbolSizesSlider: Slider = null;
  public static colorSizeSlider: ColorSizeSlider = null;
  public static binaryColorSizeSlider: BinaryColorSizeSlider = null;
  public static opacitySlider: OpacitySlider = null;
  public static opacityValuesSlider: Slider = null;
}

interface CreateSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.sizeContinuousRendererResult | esri.univariateColorSizeContinuousRendererResult,
  theme: SizeParams["theme"],
  updateOpacity?: boolean
}

// const slidersContainer = document.getElementById("sliders-container");
const sizeSlidersContainer = document.getElementById("size-slider-container");
const opacitySlidersContainer = document.getElementById("opacity-slider-container");
const symbolSizesContainer = document.getElementById("symbol-sizes");
const opacityValuesContainer = document.getElementById("opacity-values");
export const colorPicker = document.getElementById("color-picker") as HTMLInputElement;
export const colorPickerAbove = document.getElementById("color-picker-above") as HTMLInputElement;
export const colorPickerBelow = document.getElementById("color-picker-below") as HTMLInputElement;

export async function updateSizeSlider(params: CreateSizeSliderParams) {
  const { layer, view, rendererResult, updateOpacity, theme } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size") as esri.SizeVariable;

  const { field, normalizationField, valueExpression, minSize, maxSize, stops } = sizeVariable;
  let symbolSizeSliderValues: number[] = [];

  if(stops && stops.length > 0){
    const maxStop = stops[stops.length-1];
    const minStop = stops[0];

    if(theme === "above-and-below"){
      const midStop = stops[Math.floor(stops.length / 2)];
      symbolSizeSliderValues = [ midStop.size, maxStop.size ];
    } else {
      symbolSizeSliderValues = [ minStop.size, maxStop.size ];
    }
  }
  if(minSize && maxSize){
    symbolSizeSliderValues = [ minSize as number, maxSize as number ];
  }

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!SliderVars.slider){
    SliderVars.slider = SizeSlider.fromRendererResult(rendererResult as esri.sizeContinuousRendererResult, histogramResult);
    SliderVars.slider.container = document.createElement("div");
    sizeSlidersContainer.appendChild(SliderVars.slider.container);
    // SliderVars.slider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    SliderVars.slider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      const oldRenderer = LayerVars.layer.renderer as esri.ClassBreaksRenderer;
      const newRenderer = updateRendererFromSizeSlider(oldRenderer, SliderVars.slider) as esri.ClassBreaksRenderer;
      // const sizeStops = SliderVars.slider.stops;

      // if(updateOpacity){
      //   const opacityVariable = getVisualVariableByType(newRenderer, "opacity") as esri.OpacityVariable;
      //   opacityVariable.stops = sizeStops.map(
      //     function(sizeStop){
      //       return new OpacityStop({
      //         value: sizeStop.value, opacity:
      //       });
      //     });

      // }

      // const authoringInfoSizeVV = newRenderer.authoringInfo.visualVariables.filter( vv => vv.type === "size")[0];

      if (newRenderer.classBreakInfos.length > 1){
        const midIndex = SliderVars.slider.stops.length === 5 ? 2 : 1;
        const midValue = SliderVars.slider.stops[midIndex].value;
        newRenderer.classBreakInfos[0].maxValue = midValue;
        newRenderer.classBreakInfos[1].minValue = midValue;
      }
      LayerVars.layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.slider.container as HTMLElement).style.display = "block";
    SliderVars.slider.updateFromRendererResult(rendererResult as esri.sizeContinuousRendererResult, histogramResult);
  }

  if(theme === "above-and-below"){
    SliderVars.slider.stops = stops;
    SliderVars.slider.primaryHandleEnabled = true;
    SliderVars.slider.handlesSyncedToPrimary = true;
  } else {
    SliderVars.slider.primaryHandleEnabled = false;
    SliderVars.slider.handlesSyncedToPrimary = false;
  }

  updateSymbolSizesSlider({ values: symbolSizeSliderValues, theme });
}

interface CreateBinarySliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.univariateColorSizeContinuousRendererResult,
  updateOpacity?: boolean
}

export async function updateBinaryColorSizeSlider(params: CreateBinarySliderParams) {
  const { layer, view, rendererResult } = params;
  const { renderer: { authoringInfo: { univariateTheme } } } = rendererResult;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size") as esri.SizeVariable;

  const { field, normalizationField, valueExpression, minSize, maxSize, stops } = sizeVariable;
  let symbolSizeSliderValues: number[] = [];

  if(stops && stops.length > 0){
    const maxStop = stops[stops.length-1];
    const minStop = stops[0];

    if(univariateTheme === "above-and-below"){
      const midStop = stops[Math.floor(stops.length / 2)];
      symbolSizeSliderValues = [ midStop.size, maxStop.size ];
    } else {
      symbolSizeSliderValues = [ minStop.size, maxStop.size ];
    }
  }
  if(minSize && maxSize){
    symbolSizeSliderValues = [ minSize as number, maxSize as number ];
  }

  const histogramResult = await calculateHistogram({
    layer, view, field, normalizationField, valueExpression
  });

  if(!SliderVars.binaryColorSizeSlider){
    (SliderVars.binaryColorSizeSlider as any) = BinaryColorSizeSlider.fromRendererResult(rendererResult, histogramResult);
    SliderVars.binaryColorSizeSlider.container = document.createElement("div");
    sizeSlidersContainer.appendChild(SliderVars.binaryColorSizeSlider.container);
    // SliderVars.binaryColorSizeSlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    SliderVars.binaryColorSizeSlider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      LayerVars.layer.renderer = SliderVars.binaryColorSizeSlider.updateRenderer(LayerVars.layer.renderer as ClassBreaksRenderer);
    });
  } else {
    (SliderVars.binaryColorSizeSlider.container as HTMLElement).style.display = "block";
    SliderVars.binaryColorSizeSlider.updateFromRendererResult(rendererResult as esri.univariateColorSizeContinuousRendererResult, histogramResult);
  }

  updateSymbolSizesSlider({ values: symbolSizeSliderValues, theme: univariateTheme });
}

interface CreateColorSizeSliderParams {
  layer: esri.FeatureLayer,
  view: esri.MapView,
  rendererResult: esri.univariateColorSizeContinuousRendererResult,
  theme: SizeParams["theme"]
}

export async function updateColorSizeSlider(params: CreateColorSizeSliderParams) {
  const { layer, view, rendererResult, theme } = params;

  let sizeVariable = getVisualVariableByType(rendererResult.renderer, "size") as esri.SizeVariable;
  let colorVariable = getVisualVariableByType(rendererResult.renderer, "color") as esri.ColorVariable;
  const colorStops = colorVariable.stops;

  const { field, normalizationField, valueExpression, minSize, maxSize, stops } = sizeVariable;
  let symbolSizeSliderValues: number[] = [];

  if(stops && stops.length > 0){
    const maxStop = stops[stops.length-1];
    const minStop = stops[0];

    if(theme === "above-and-below"){
      const midStop = stops[Math.floor(stops.length / 2)];
      symbolSizeSliderValues = [ midStop.size, maxStop.size ];
    } else {
      symbolSizeSliderValues = [ minStop.size, maxStop.size ];
    }
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
    // SliderVars.colorSizeSlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

    SliderVars.colorSizeSlider.on([
      "thumb-change",
      "thumb-drag",
      "min-change",
      "max-change"
    ] as any, () => {
      const newRenderer = updateRendererFromColorSizeSlider(LayerVars.layer.renderer as esri.RendererWithVisualVariables, SliderVars.colorSizeSlider) as ClassBreaksRenderer;

      if (newRenderer.classBreakInfos.length > 1){
        const midIndex = SliderVars.colorSizeSlider.stops.length === 5 ? 2 : 1;
        const midValue = SliderVars.colorSizeSlider.stops[midIndex].value;
        newRenderer.classBreakInfos[0].maxValue = midValue;
        newRenderer.classBreakInfos[1].minValue = midValue;
      }

      LayerVars.layer.renderer = newRenderer;
    });
  } else {
    (SliderVars.colorSizeSlider.container as HTMLElement).style.display = "block";
    SliderVars.colorSizeSlider.updateFromRendererResult(rendererResult, histogramResult);
  }

  if(theme === "above-and-below"){
    SliderVars.colorSizeSlider.stops = [
      { color: colorStops[0].color, size: stops[0].size, value: stops[0].value },
      { color: colorStops[1].color, size: stops[1].size, value: stops[1].value },
      { color: colorStops[2].color, size: stops[2].size, value: stops[2].value },
      { color: colorStops[3].color, size: stops[3].size, value: stops[3].value },
      { color: colorStops[4].color, size: stops[4].size, value: stops[4].value }
    ];
    SliderVars.colorSizeSlider.primaryHandleEnabled = true;
    SliderVars.colorSizeSlider.handlesSyncedToPrimary = true;
  } else {
    SliderVars.colorSizeSlider.primaryHandleEnabled = false;
    SliderVars.colorSizeSlider.handlesSyncedToPrimary = false;
  }

  updateSymbolSizesSlider({ values: symbolSizeSliderValues, theme });
}

export function updateColorSizeSliderColors(colorVariable: esri.ColorVariable){
  SliderVars.colorSizeSlider.stops.forEach( (stop, i) => {
    stop.color = colorVariable.stops[i].color
  });
}

export function updateColorSizeSliderSizes(sizeVariable: esri.SizeVariable){
  const { minSize, maxSize, stops } = sizeVariable;
  if(stops && stops.length > 0){
    SliderVars.colorSizeSlider.stops.forEach( (stop, i) => {
      stop.size = sizeVariable.stops[i].size
    });
  } else {
    const lastIndex = SliderVars.colorSizeSlider.stops.length - 1;
    SliderVars.colorSizeSlider.stops.forEach( (stop, i) => {
      if(i === 0){
        stop.size = minSize as number;
      } else if(i === lastIndex){
        stop.size = maxSize as number;
      } else {
        stop.size = null;
      }
    });
  }
}

export function updateSizeSliderSizes(sizeVariable: esri.SizeVariable){
  const { minSize, maxSize, stops } = sizeVariable;
  if(stops && stops.length > 0){
    SliderVars.slider.stops.forEach( (stop, i) => {
      stop.size = sizeVariable.stops[i].size
    });
  } else {
    SliderVars.slider.stops[0].size = minSize as number;
    SliderVars.slider.stops[1].size = maxSize as number;
  }
}

export function updateOpacitySliderValues(opacityVariable: esri.OpacityVariable){
  SliderVars.opacitySlider.stops.forEach( (stop, i) => {
    stop.opacity = opacityVariable.stops[i].opacity
  });
}

interface UpdateSymbolSizesSlider {
  values: number[],
  theme?: SizeParams["theme"]
}

let symbolSizesSliderWatchHandle: esri.WatchHandle = null;

function createSymbolSizesWatcher(values: number[], theme?: SizeParams["theme"]){

  return function (values: number[]){
    const renderer = (LayerVars.layer.renderer as esri.RendererWithVisualVariables).clone();
    const sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
    let { stops } = sizeVariable;

    const minSize = theme !== "below" ? values[0] : values[1];
    const maxSize = theme !== "below" ? values[1] : values[0];

    if(stops && stops.length > 0){

      const midSize = calcuateMidSize(minSize as number, maxSize as number);
      stops[0].size = maxSize;
      stops[1].size = midSize;
      stops[2].size = minSize;
      stops[3].size = midSize;
      stops[4].size = maxSize;
    } else {
      sizeVariable.minSize = minSize;
      sizeVariable.maxSize = maxSize;
    }

    LayerVars.layer.renderer = renderer;

    if (SliderVars.colorSizeSlider){
      updateColorSizeSliderSizes(sizeVariable);
    }
    if (SliderVars.slider) {
      updateSizeSliderSizes(sizeVariable);
    }
  }
}

function updateSymbolSizesSlider(params: UpdateSymbolSizesSlider){
  const { values, theme } = params;
  if(values[1] < values[0]){
    values.reverse();
  }
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
  } else {
    SliderVars.symbolSizesSlider.values = values;
  }

  if(symbolSizesSliderWatchHandle){
    symbolSizesSliderWatchHandle.remove();
    symbolSizesSliderWatchHandle = null;
  }
  symbolSizesSliderWatchHandle = SliderVars.symbolSizesSlider.watch("values", createSymbolSizesWatcher(values, theme))
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
    // SliderVars.opacitySlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };

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

export function updateOpacityValuesSlider(params: UpdateSymbolSizesSlider){
  const { values } = params;
  if(!SliderVars.opacityValuesSlider){
    SliderVars.opacityValuesSlider = new Slider({
      values,
      container: opacityValuesContainer,
      min: 0,
      max: 1,
      steps: 0.05,
      labelInputsEnabled: true,
      rangeLabelInputsEnabled: true,
      visibleElements: {
        rangeLabels: true,
        labels: true
      }
    });
    SliderVars.opacityValuesSlider.watch("values", function(values: number[]){
      const renderer = (LayerVars.layer.renderer as esri.RendererWithVisualVariables).clone();
      const opacityVariable = getVisualVariableByType(renderer, "opacity") as esri.OpacityVariable;
      let { stops } = opacityVariable;
      const minOpacity = values[0];
      const maxOpacity = values[1];

      stops[0].opacity = minOpacity;
      stops[1].opacity = maxOpacity;

      LayerVars.layer.renderer = renderer;
      updateOpacitySliderValues(opacityVariable);
    });
  } else {
    SliderVars.opacityValuesSlider.values = values;
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

colorPickerBelow.addEventListener("input", function(event){
  const newColor = new Color(colorPickerBelow.value);

  if(SliderVars.binaryColorSizeSlider){
    SliderVars.binaryColorSizeSlider.style.trackBelowFillColor = newColor;
  }

  const renderer = (LayerVars.layer.renderer as ClassBreaksRenderer).clone();
  const symbol = renderer.classBreakInfos[0].symbol;

  if(symbol.type === "cim"){
    cimSymbolUtils.applyCIMSymbolColor(symbol as CIMSymbol, newColor);
  } else {
    (symbol as SymbolWithColor).color = newColor;
  }

  LayerVars.layer.renderer = renderer;
});

colorPickerAbove.addEventListener("input", function(event){
  const newColor = new Color(colorPickerAbove.value);

  if(SliderVars.binaryColorSizeSlider){
    SliderVars.binaryColorSizeSlider.style.trackAboveFillColor = newColor;
  }

  const renderer = (LayerVars.layer.renderer as ClassBreaksRenderer).clone();
  const symbol = renderer.classBreakInfos[1].symbol;

  if(symbol.type === "cim"){
    cimSymbolUtils.applyCIMSymbolColor(symbol as CIMSymbol, newColor);
  } else {
    (symbol as SymbolWithColor).color = newColor;
  }

  LayerVars.layer.renderer = renderer;
});

export function destroySizeSlider(){
  SliderVars.slider.destroy();
  SliderVars.slider.container = null;
  SliderVars.slider = null;
}