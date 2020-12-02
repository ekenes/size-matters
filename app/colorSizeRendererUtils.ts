import esri = __esri;
import colorSizeRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import colorRamps = require("esri/smartMapping/symbology/support/colorRamps");
import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");

import { updateColorSizeSlider, updateSizeSlider, colorPicker, updateColorSizeSliderColors, colorPickerAbove, colorPickerBelow } from "./sliderUtils";
import { SizeParams, getVisualVariableByType, getSizeRendererColor, getSymbolColor } from "./rendererUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { LayerVars } from "./layerUtils";
import { CIMSymbol, Symbol3D } from "esri/symbols";

export const useDonutsElement = document.getElementById("use-donuts") as HTMLInputElement;

export function updateRendererFromColorSizeSlider(renderer: esri.RendererWithVisualVariables, slider: esri.ColorSizeSlider){

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  let colorVariable = getVisualVariableByType(renderer, "color") as esri.ColorVariable;
  const colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
  renderer.visualVariables.splice(colorVariableIndex, 1);

  renderer.visualVariables = slider.updateVisualVariables([sizeVariable, colorVariable]);

  return renderer.clone();
}

/////////////////////////////////////
///
/// Color and Size Renderer
///
//////////////////////////////////////

export async function createColorSizeRenderer(params: esri.univariateColorSizeCreateContinuousRendererParams): Promise<esri.univariateColorSizeContinuousRendererResult> {
  const { layer, view, field, normalizationField, valueExpression } = params;

  const theme = params.theme || "high-to-low";
  const useSizeSlider = params.colorOptions && !params.colorOptions.isContinuous && theme === "above-and-below";

  let result = await colorSizeRendererCreator.createContinuousRenderer(params);
  result.renderer.authoringInfo.type = "univariate-color-size";

  const rendererColor = getSizeRendererColor(result.renderer as ClassBreaksRenderer);
  colorPicker.value = rendererColor.toHex();

  if (useSizeSlider){
    const aboveSymbol = result.renderer.classBreakInfos[1].symbol;
    const belowSymbol = result.renderer.classBreakInfos[0].symbol;

    const aboveColor = getSymbolColor(aboveSymbol as any);
    const belowColor = getSymbolColor(belowSymbol as any)

    colorPickerAbove.value = aboveColor.toHex();
    colorPickerBelow.value = belowColor.toHex();

    await updateSizeSlider({
      layer: layer as esri.FeatureLayer,
      view: view as esri.MapView,
      rendererResult: {
        renderer: result.renderer,
        visualVariables: result.size.visualVariables,
        sizeScheme: result.size.sizeScheme,
        defaultValuesUsed: result.defaultValuesUsed,
        statistics: result.statistics,
        basemapId: result.basemapId,
        basemapTheme: result.basemapTheme
      } as esri.sizeContinuousRendererResult,
      theme
    });
  } else {
    await updateColorSizeSlider({
      layer: layer as esri.FeatureLayer,
      view: view as esri.MapView,
      rendererResult: result,
      theme
    });
  }

  createColorRamps(theme);
  return result;
}

const colorRampsElement = document.getElementById("color-ramps") as HTMLDivElement;

function createColorRamps(theme: SizeParams["theme"]){
  colorRampsElement.innerHTML = null;
  const excludedTags = [ "extremes", "heatmap", "point-cloud", "categorical", "centered-on" ];

  const ramps = colorRamps.byTag({
    includedTags: theme === "above-and-below" ? [ "diverging" ] : ["sequential"],
    excludedTags: theme === "above-and-below" ? excludedTags : excludedTags.concat(["diverging"])
  });

  ramps.sort(function(a, b) {
    return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
  });

  ramps.forEach((ramp) => {

    const rampElement = symbolUtils.renderColorRampPreviewHTML(ramp.colors, {
      align: "vertical",
      gradient: true,
      width: 10,
      height: 30
    });

    const rampContainer = document.createElement("div");
    rampContainer.classList.add("ramps");
    rampContainer.title = ramp.name;
    rampContainer.appendChild(rampElement);
    rampContainer.addEventListener("click", (event) => {
      updateColorVariableRamp(ramp.colors);
    });
    colorRampsElement.appendChild(rampContainer);
  });
}

function updateColorVariableRamp(colors: Color[]) {
  const renderer = (LayerVars.layer.renderer as ClassBreaksRenderer).clone();

  const colorVariable = getVisualVariableByType(renderer, "color") as esri.ColorVariable;
  colorVariable.stops.forEach( (stop, i) => {
    stop.color = colors[i];
  });

  LayerVars.layer.renderer = renderer;
  updateColorSizeSliderColors(colorVariable);
}