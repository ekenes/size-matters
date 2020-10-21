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
define(["require", "exports", "esri/smartMapping/renderers/size", "esri/renderers/visualVariables/support/SizeStop", "./sliderUtils", "./statUtils", "./rendererUtils"], function (require, exports, sizeRendererCreator, SizeStop, sliderUtils_1, statUtils_1, rendererUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateRendererFromSizeSlider(renderer, slider) {
        var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
        var sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
        renderer.visualVariables.splice(sizeVariableIndex, 1);
        renderer.visualVariables.push(slider.updateVisualVariable(sizeVariable));
        return renderer.clone();
    }
    exports.updateRendererFromSizeSlider = updateRendererFromSizeSlider;
    /////////////////////////////////////
    ///
    /// Size Renderer
    ///
    //////////////////////////////////////
    function createSizeRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, field, normalizationField, valueExpression, theme, result, rendererColor, percentileStats, visualVariables, sizeVariables, belowSymbol, aboveSymbol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, field = params.field, normalizationField = params.normalizationField, valueExpression = params.valueExpression;
                        theme = params.theme || "high-to-low";
                        return [4 /*yield*/, sizeRendererCreator.createContinuousRenderer(params)];
                    case 1:
                        result = _a.sent();
                        rendererColor = rendererUtils_1.getSizeRendererColor(result.renderer);
                        sliderUtils_1.colorPicker.value = rendererColor.toHex();
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
                        result.visualVariables = sizeVariables;
                        if (theme === "above-and-below") {
                            result.renderer = rendererUtils_1.createAboveAndBelowRenderer(result.renderer);
                            belowSymbol = result.renderer.classBreakInfos[0].symbol;
                            aboveSymbol = result.renderer.classBreakInfos[1].symbol;
                            sliderUtils_1.colorPickerBelow.value = rendererUtils_1.getSymbolColor(belowSymbol).toHex();
                            sliderUtils_1.colorPickerAbove.value = rendererUtils_1.getSymbolColor(aboveSymbol).toHex();
                        }
                        return [4 /*yield*/, sliderUtils_1.updateSizeSlider({
                                layer: layer,
                                view: view,
                                rendererResult: result,
                                theme: theme
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    exports.createSizeRenderer = createSizeRenderer;
    function updateVariablesFromTheme(rendererResult, theme, percentileStats) {
        var stats = rendererResult.statistics;
        var renderer = rendererResult.renderer.clone();
        var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
        var sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
        renderer.visualVariables.splice(sizeVariableIndex, 1);
        switch (theme) {
            case "above-average":
                updateVariableToAboveAverageTheme(sizeVariable, stats);
                break;
            case "below-average":
                updateVariableToBelowAverageTheme(sizeVariable, stats);
                break;
            case "90-10":
                updateVariableTo9010Theme(sizeVariable, percentileStats);
                break;
            case "above-and-below":
                updateVariableToAboveAndBelowTheme(sizeVariable, stats);
            default:
                // return variables without modifications
                break;
        }
        renderer.visualVariables.push(sizeVariable);
        return renderer.visualVariables;
    }
    function updateVariableToAboveAverageTheme(sizeVariable, stats) {
        sizeVariable.minDataValue = stats.avg;
    }
    exports.updateVariableToAboveAverageTheme = updateVariableToAboveAverageTheme;
    function updateVariableToBelowAverageTheme(sizeVariable, stats) {
        sizeVariable.flipSizes();
        sizeVariable.maxDataValue = stats.avg;
    }
    exports.updateVariableToBelowAverageTheme = updateVariableToBelowAverageTheme;
    function updateVariableTo9010Theme(sizeVariable, stats) {
        sizeVariable.minDataValue = stats["10"];
        sizeVariable.maxDataValue = stats["90"];
    }
    exports.updateVariableTo9010Theme = updateVariableTo9010Theme;
    function updateVariableToAboveAndBelowTheme(sizeVariable, stats) {
        var min = stats.min, max = stats.max, avg = stats.avg, stddev = stats.stddev;
        var oldSizeVariable = sizeVariable.clone();
        var midDataValue = (avg + stddev) > 0 && 0 > (avg - stddev) && min < 0 ? 0 : avg;
        var aboveAvgSpread = max - midDataValue;
        var belowAvgSpread = midDataValue - min;
        var maxSpread = aboveAvgSpread > belowAvgSpread ? aboveAvgSpread : belowAvgSpread;
        var maxDataValue = midDataValue + maxSpread;
        var minDataValue = midDataValue - maxSpread;
        var minSize, maxSize = null;
        if (typeof oldSizeVariable.minSize === "object") {
            var stops_1 = oldSizeVariable.minSize.stops;
            var numStops = stops_1.length;
            var midIndex = Math.floor(numStops / 2);
            minSize = stops_1[midIndex].size;
        }
        else {
            minSize = oldSizeVariable.minSize;
        }
        if (typeof oldSizeVariable.maxSize === "object") {
            var stops_2 = oldSizeVariable.maxSize.stops;
            var numStops = stops_2.length;
            var midIndex = Math.floor(numStops / 2);
            maxSize = stops_2[midIndex].size;
        }
        else {
            maxSize = oldSizeVariable.maxSize;
        }
        var midSize = calcuateMidSize(minSize, maxSize);
        var minMidDataValue = midDataValue - ((midDataValue - minDataValue) / 2);
        var maxMidDataValue = ((maxDataValue - midDataValue) / 2) + midDataValue;
        var stops = [
            new SizeStop({ value: minDataValue, size: maxSize }),
            new SizeStop({ value: minMidDataValue, size: midSize }),
            new SizeStop({ value: midDataValue, size: minSize }),
            new SizeStop({ value: maxMidDataValue, size: midSize }),
            new SizeStop({ value: maxDataValue, size: maxSize })
        ];
        sizeVariable.minDataValue = null;
        sizeVariable.maxDataValue = null;
        sizeVariable.minSize = null;
        sizeVariable.maxSize = null;
        sizeVariable.stops = stops;
    }
    exports.updateVariableToAboveAndBelowTheme = updateVariableToAboveAndBelowTheme;
    function calcuateMidSize(minSize, maxSize) {
        return Math.round((maxSize - minSize) / 2) + minSize;
    }
    exports.calcuateMidSize = calcuateMidSize;
});
//# sourceMappingURL=sizeRendererUtils.js.map