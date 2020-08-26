import esri = __esri;
import histogram = require("esri/smartMapping/statistics/histogram");
import classBreaks = require("esri/smartMapping/statistics/classBreaks");

interface StatParams {
  layer: esri.FeatureLayer,
  field?: string,
  normalizationField?: string,
  valueExpression?: string,
  view: esri.MapView
}

export interface PercentileStats {
  "10": number,
  "90": number
}

export async function calculateHistogram(params: StatParams){
  const { layer, field, normalizationField, valueExpression, view } = params;
  return histogram({
    layer, field, normalizationField, valueExpression, view,
    numBins: 30
  });
}

export async function calculate9010Percentile(params: StatParams): Promise<PercentileStats>{
  const { layer, field, normalizationField, valueExpression, view } = params;

  const classBreaksResult = await classBreaks({
    layer, field, normalizationField, valueExpression, view,
    numClasses: 10, classificationMethod: "quantile"
  });

  const { classBreakInfos } = classBreaksResult;

  return {
    "90": classBreakInfos[9].minValue,
    "10": classBreakInfos[0].maxValue
  }
}