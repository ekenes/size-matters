import esri = __esri;
import sizeRendererCreator = require("esri/smartMapping/renderers/size");

export interface SizeParams extends esri.sizeCreateContinuousRendererParams {
  theme?: "high-to-low" | "90-10" | "above-average" | "below-average" | "above-and-below" | "extremes" | "centered-on"
}

export async function updateRenderer(params: SizeParams){
  const { layer } = params;
  const result = await createSizeRenderer(params);

  layer.renderer = result.renderer.clone();
}

export async function createSizeRenderer(params: SizeParams): Promise<esri.sizeContinuousRendererResult> {

  const theme = params.theme || "high-to-low";

  let result = await sizeRendererCreator.createContinuousRenderer(params);

  const sizeVariables = updateVariablesFromTheme(result, params.theme);
  result.visualVariables = sizeVariables;
  result.renderer.visualVariables = sizeVariables;

  return result;
}

function updateVariablesFromTheme( rendererResult: esri.sizeContinuousRendererResult, theme: SizeParams["theme"]){
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
  sizeVariable.minDataValue = stats.avg;
}