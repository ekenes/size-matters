import esri = __esri;
import histogram = require("esri/smartMapping/statistics/histogram");

export async function calculateHistogram(params: esri.histogramHistogramParams){
  const { layer, field, normalizationField, valueExpression, view } = params;
  return histogram({
    layer, field, normalizationField, valueExpression, view,
    numBins: 30
  });
}