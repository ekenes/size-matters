var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/smartMapping/renderers/univariateColorSize", "esri/core/lang", "./sliderUtils", "./statUtils", "./rendererUtils", "./sizeRendererUtils"], function (require, exports, colorSizeRendererCreator, lang, sliderUtils_1, statUtils_1, rendererUtils_1, sizeRendererUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateRendererFromColorSizeSlider(renderer, slider) {
        var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
        var sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
        renderer.visualVariables.splice(sizeVariableIndex, 1);
        var colorVariable = rendererUtils_1.getVisualVariableByType(renderer, "color");
        var colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
        renderer.visualVariables.splice(colorVariableIndex, 1);
        renderer.visualVariables = slider.updateVisualVariables([sizeVariable, colorVariable]);
        return renderer.clone();
    }
    exports.updateRendererFromColorSizeSlider = updateRendererFromColorSizeSlider;
    /////////////////////////////////////
    ///
    /// Color and Size Renderer
    ///
    //////////////////////////////////////
    function createColorSizeRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, field, normalizationField, valueExpression, invalidColorThemes, theme, result, percentileStats, visualVariables, sizeVariables, colorVariables;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, field = params.field, normalizationField = params.normalizationField, valueExpression = params.valueExpression;
                        invalidColorThemes = ["90-10", "above-average", "below-average", "centered-on", "extremes"];
                        theme = lang.clone(params.theme) || "high-to-low";
                        params.theme = invalidColorThemes.indexOf(theme) > -1 ? "high-to-low" : params.theme;
                        return [4 /*yield*/, colorSizeRendererCreator.createContinuousRenderer(params)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, statUtils_1.calculate9010Percentile({
                                layer: layer,
                                view: view,
                                field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 2:
                        percentileStats = _a.sent();
                        visualVariables = updateVariablesFromTheme(result, params.theme, percentileStats);
                        result.renderer.visualVariables = visualVariables;
                        sizeVariables = rendererUtils_1.getVisualVariablesByType(result.renderer, "size");
                        colorVariables = rendererUtils_1.getVisualVariablesByType(result.renderer, "color");
                        result.size.visualVariables = sizeVariables;
                        result.color.visualVariable = colorVariables[0];
                        return [4 /*yield*/, sliderUtils_1.updateColorSizeSlider({
                                layer: layer,
                                view: view,
                                rendererResult: result
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    exports.createColorSizeRenderer = createColorSizeRenderer;
    function updateVariablesFromTheme(rendererResult, theme, percentileStats) {
        var stats = rendererResult.statistics;
        var renderer = rendererResult.renderer.clone();
        var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
        var sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
        renderer.visualVariables.splice(sizeVariableIndex, 1);
        var colorVariable = rendererUtils_1.getVisualVariableByType(renderer, "color");
        var colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
        renderer.visualVariables.splice(colorVariableIndex, 1);
        switch (theme) {
            case "above-average":
                sizeRendererUtils_1.updateVariableToAboveAverageTheme(sizeVariable, stats);
                break;
            case "below-average":
                sizeRendererUtils_1.updateVariableToBelowAverageTheme(sizeVariable, stats);
                break;
            case "90-10":
                sizeRendererUtils_1.updateVariableTo9010Theme(sizeVariable, percentileStats);
                break;
            case "above-and-below":
                sizeRendererUtils_1.updateVariableToAboveAndBelowTheme(sizeVariable, stats);
            default:
                // return variables without modifications
                break;
        }
        renderer.visualVariables = renderer.visualVariables.concat([sizeVariable, colorVariable]);
        return renderer.visualVariables; //[sizeVariable, colorVariable];
    }
});
// function updateColorVariableToAboveAverageTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
//   colorVariable.minDataValue = stats.avg;
// }
// function updateColorVariableToBelowAverageTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
//   colorVariable.flipSizes();
//   colorVariable.maxDataValue = stats.avg;
// }
// function updateColorVariableTo9010Theme( colorVariable: esri.ColorVariable, stats: PercentileStats ){
//   colorVariable.minDataValue = stats["10"];
//   colorVariable.maxDataValue = stats["90"];
// }
// function updateColorVariableToAboveAndBelowTheme( colorVariable: esri.ColorVariable, stats: esri.univariateColorSizeContinuousRendererResult["statistics"] ){
//   const { min, max, avg, stddev } = stats;
//   const oldSizeVariable = colorVariable.clone();
//   const midDataValue = (avg + stddev) > 0 && 0 > (avg - stddev) ? 0 : avg;
//   let minSize: number, maxSize: number = null;
//   if( typeof oldSizeVariable.minSize === "object"){
//     const stops = oldSizeVariable.minSize.stops;
//     const numStops = stops.length;
//     const midIndex = Math.floor(numStops/2);
//     minSize = stops[midIndex].size;
//   } else {
//     minSize = oldSizeVariable.minSize;
//   }
//   if( typeof oldSizeVariable.maxSize === "object"){
//     const stops = oldSizeVariable.maxSize.stops;
//     const numStops = stops.length;
//     const midIndex = Math.floor(numStops/2);
//     maxSize = stops[midIndex].size;
//   } else {
//     maxSize = oldSizeVariable.maxSize;
//   }
//   const midSize = Math.round(( maxSize - minSize) / 2);
//   const minMidDataValue = ( midDataValue - oldSizeVariable.minDataValue ) / 2;
//   const maxMidDataValue = ( oldSizeVariable.maxDataValue - midDataValue ) / 2;
//   const stops = [
//     new SizeStop({ value: oldSizeVariable.minDataValue, size: maxSize }),
//     new SizeStop({ value: minMidDataValue, size: midSize }),
//     new SizeStop({ value: midDataValue, size: minSize }),
//     new SizeStop({ value: maxMidDataValue, size: midSize }),
//     new SizeStop({ value: oldSizeVariable.maxDataValue, size: maxSize })
//   ];
//   sizeVariable.minDataValue = null;
//   sizeVariable.maxDataValue = null;
//   sizeVariable.minSize = null;
//   sizeVariable.maxSize = null;
//   sizeVariable.stops = stops;
// }
//# sourceMappingURL=colorSizeRendererUtils.js.map