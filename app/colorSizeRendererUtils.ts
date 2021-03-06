import esri = __esri;
import colorSizeRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import colorRamps = require("esri/smartMapping/symbology/support/colorRamps");
import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");

import { updateColorSizeSlider, colorPicker, updateColorSizeSliderColors, colorPickerAbove, colorPickerBelow, updateBinaryColorSizeSlider } from "./sliderUtils";
import { SizeParams, getVisualVariableByType, getSizeRendererColor, getSymbolColor } from "./rendererUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";
import { LayerVars } from "./layerUtils";

export const useDonutsElement = document.getElementById("use-donuts") as HTMLInputElement;

/////////////////////////////////////
///
/// Color and Size Renderer
///
//////////////////////////////////////

export async function createColorSizeRenderer(params: esri.univariateColorSizeCreateContinuousRendererParams): Promise<esri.univariateColorSizeContinuousRendererResult> {
  const { layer, view, field, normalizationField, valueExpression } = params;

  const theme = params.theme || "high-to-low";
  const useBinarySizeSlider = params.colorOptions && !params.colorOptions.isContinuous && theme === "above-and-below";

  let result = await colorSizeRendererCreator.createContinuousRenderer(params);

  const rendererColor = getSizeRendererColor(result.renderer as ClassBreaksRenderer);
  colorPicker.value = rendererColor.toHex();

  if (useBinarySizeSlider){
    const aboveSymbol = result.renderer.classBreakInfos[1].symbol;
    const belowSymbol = result.renderer.classBreakInfos[0].symbol;

    const aboveColor = getSymbolColor(aboveSymbol as any);
    const belowColor = getSymbolColor(belowSymbol as any)

    colorPickerAbove.value = aboveColor.toHex();
    colorPickerBelow.value = belowColor.toHex();

    await updateBinaryColorSizeSlider({
      layer: layer as esri.FeatureLayer,
      view: view,
      rendererResult: result
    });
  } else {
    await updateColorSizeSlider({
      layer: layer as esri.FeatureLayer,
      view: view,
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