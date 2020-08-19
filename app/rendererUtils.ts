import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");
import { updateSizeSlider } from "./sliderUtils";
import { calculate9010Percentile, PercentileStats } from "./statUtils";

export interface SizeParams extends esri.sizeCreateContinuousRendererParams {
  theme?: "high-to-low" | "90-10" | "above-average" | "below-average" | "above-and-below" | "extremes" | "centered-on",
  style?: "size" | "color-and-size" | "opacity-and-size"
}

export function updateRendererFromSizeSlider(renderer: esri.RendererWithVisualVariables, slider: esri.SizeSlider){

  let sizeVariable = getVisualVariableByType(renderer, "size") as esri.SizeVariable;
  const sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
  renderer.visualVariables.splice(sizeVariableIndex, 1);

  renderer.visualVariables.push(slider.updateVisualVariable(sizeVariable));

  return renderer.clone();
}

export async function updateRenderer(params: SizeParams){
  const { layer } = params;
  const style = params.style || "size";

  let result = null;

  switch( style ){
    case "size":
      result = await createSizeRenderer(params);
      break;
    case "color-and-size":
      break;
    case "opacity-and-size":
      break;
    default:
      // return variables without modifications
      break;
  }

  layer.renderer = result.renderer.clone();
}

export async function createSizeRenderer(params: SizeParams): Promise<esri.sizeContinuousRendererResult> {
  const { layer, view, field, normalizationField, valueExpression } = params;

  const theme = params.theme || "high-to-low";

  let result = await sizeRendererCreator.createContinuousRenderer(params);

  const percentileStats = await calculate9010Percentile({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    field, normalizationField, valueExpression
  });

  const sizeVariables = updateVariablesFromTheme(result, params.theme, percentileStats);
  result.visualVariables = sizeVariables;
  result.renderer.visualVariables = sizeVariables;

  await updateSizeSlider({
    layer: layer as esri.FeatureLayer,
    view: view as esri.MapView,
    rendererResult: result
  });

  return result;
}

function updateVariablesFromTheme( rendererResult: esri.sizeContinuousRendererResult, theme: SizeParams["theme"], percentileStats?: PercentileStats){
  const stats = rendererResult.statistics;
  let sizeVariable = rendererResult.visualVariables.filter( vv => vv.target !== "outline" )[0];
  let outlineVariable = rendererResult.visualVariables.filter( vv => vv.target === "outline" )[0];

  switch( theme ){
    case "above-average":
      updateVariableToAboveAverageTheme(sizeVariable, stats);
      break;
    case "below-average":
      updateVariableToBelowAverageTheme(sizeVariable, stats);
      break;
    case "90-10":
      updateVariableTo9010Theme(sizeVariable, percentileStats);
      break;
    default:
      // return variables without modifications
      break;
  }

  return [ sizeVariable, outlineVariable ];
}

function updateVariableToAboveAverageTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  sizeVariable.minDataValue = stats.avg;
}

function updateVariableToBelowAverageTheme( sizeVariable: esri.SizeVariable, stats: esri.sizeContinuousRendererResult["statistics"] ){
  sizeVariable.flipSizes();
  sizeVariable.maxDataValue = stats.avg;
}

function updateVariableTo9010Theme( sizeVariable: esri.SizeVariable, stats: PercentileStats ){
  sizeVariable.minDataValue = stats["10"];
  sizeVariable.maxDataValue = stats["90"];
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