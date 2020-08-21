import esri = __esri;
import { createSizeRenderer } from "./sizeRendererUtils";
import { createColorSizeRenderer } from "./colorSizeRendererUtils";
import { SliderVars } from "./sliderUtils";

export interface SizeParams extends esri.sizeCreateContinuousRendererParams {
  theme?: "high-to-low" | "90-10" | "above-average" | "below-average" | "above-and-below" | "extremes" | "centered-on",
  style?: "size" | "color-and-size" | "opacity-and-size"
}

export async function updateRenderer(params: SizeParams){
  const { layer } = params;
  const style = params.style || "size";

  let result = null;

  switch( style ){
    case "size":
      if(SliderVars.colorSizeSlider){
        SliderVars.colorSizeSlider.destroy();
        SliderVars.colorSizeSlider = null;
      }
      result = await createSizeRenderer(params);
      break;
    case "color-and-size":
      if(SliderVars.slider){
        SliderVars.slider.destroy();
        SliderVars.slider = null;
      }
      result = await createColorSizeRenderer(params);
      break;
    case "opacity-and-size":
      break;
    default:
      // return variables without modifications
      break;
  }

  layer.renderer = result.renderer.clone();
}

export function getVisualVariableByType(renderer: esri.RendererWithVisualVariables, type: "size" | "color" | "opacity" | "outline") {
  const visualVariables = renderer.visualVariables;
  return (
    visualVariables &&
    visualVariables.filter(function (vv) {
      if (type === "outline"){
        return vv.type === "size" && (vv as esri.SizeVariable).target === "outline";
      }
      return vv.type === type;
    })[0]
  );
}

export function getVisualVariablesByType(renderer: esri.RendererWithVisualVariables, type: "size" | "color" | "opacity") {
  const visualVariables = renderer.visualVariables;
  return (
    visualVariables &&
    visualVariables.filter(function (vv) {
      return vv.type === type;
    })
  );
}