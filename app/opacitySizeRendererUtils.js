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
define(["require", "exports", "esri/smartMapping/renderers/size", "esri/renderers/visualVariables/support/OpacityStop", "esri/renderers/visualVariables/OpacityVariable", "./sliderUtils", "./statUtils", "./rendererUtils", "./sizeRendererUtils"], function (require, exports, sizeRendererCreator, OpacityStop, OpacityVariable, sliderUtils_1, statUtils_1, rendererUtils_1, sizeRendererUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateRendererFromOpacitySlider(renderer, slider) {
        var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
        var sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
        renderer.visualVariables.splice(sizeVariableIndex, 1);
        var colorVariable = rendererUtils_1.getVisualVariableByType(renderer, "color");
        var colorVariableIndex = renderer.visualVariables.indexOf(colorVariable);
        renderer.visualVariables.splice(colorVariableIndex, 1);
        renderer.visualVariables = [slider.updateVisualVariable(sizeVariable)];
        return renderer.clone();
    }
    exports.updateRendererFromOpacitySlider = updateRendererFromOpacitySlider;
    /////////////////////////////////////
    ///
    /// Opacity and Size Renderer
    ///
    //////////////////////////////////////
    function createOpacitySizeRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, field, normalizationField, valueExpression, theme, result, percentileStats, visualVariables, sizeVariables, opacityVariable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, field = params.field, normalizationField = params.normalizationField, valueExpression = params.valueExpression;
                        theme = params.theme || "high-to-low";
                        return [4 /*yield*/, sizeRendererCreator.createContinuousRenderer(params)];
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
                        opacityVariable = rendererUtils_1.getVisualVariableByType(result.renderer, "opacity");
                        result.visualVariables = sizeVariables;
                        if (theme === "above-and-below") {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, sliderUtils_1.updateSizeSlider({
                                layer: layer,
                                view: view,
                                rendererResult: result
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, sliderUtils_1.updateOpacitySlider({
                                layer: layer,
                                view: view,
                                visualVariableResult: {
                                    statistics: result.statistics,
                                    visualVariable: opacityVariable,
                                    defaultValuesUsed: false,
                                    authoringInfo: result.renderer.authoringInfo
                                }
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    exports.createOpacitySizeRenderer = createOpacitySizeRenderer;
    function updateVariablesFromTheme(rendererResult, theme, percentileStats) {
        var stats = rendererResult.statistics;
        var renderer = rendererResult.renderer.clone();
        var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
        var sizeVariableIndex = renderer.visualVariables.indexOf(sizeVariable);
        renderer.visualVariables.splice(sizeVariableIndex, 1);
        var opacityStops = null;
        switch (theme) {
            case "above-average":
                sizeRendererUtils_1.updateVariableToAboveAverageTheme(sizeVariable, stats);
                opacityStops = createOpacityStopsWithAboveAverageTheme(stats);
                break;
            case "below-average":
                sizeRendererUtils_1.updateVariableToBelowAverageTheme(sizeVariable, stats);
                opacityStops = createOpacityStopsWithBelowAverageTheme(stats);
                break;
            case "90-10":
                sizeRendererUtils_1.updateVariableTo9010Theme(sizeVariable, percentileStats);
                opacityStops = createOpacityStopsWith9010Theme(percentileStats);
                break;
            case "above-and-below":
                sizeRendererUtils_1.updateVariableToAboveAndBelowTheme(sizeVariable, stats);
                opacityStops = createOpacityStopsWithAboveAndBelowTheme(stats);
                break;
            case "centered-on":
                opacityStops = createOpacityStopsWithCenteredOnTheme(stats);
                break;
            case "extremes":
                opacityStops = createOpacityStopsWithExtremesTheme(stats);
                break;
            default:
                opacityStops = createOpacityStopsWithHighToLowTheme(stats);
                break;
        }
        var opacityVariable = createOpacityVariable(sizeVariable, opacityStops);
        renderer.visualVariables = renderer.visualVariables.concat([sizeVariable, opacityVariable]);
        return renderer.visualVariables;
    }
    function createOpacityVariable(sizeVariable, stops) {
        var field = sizeVariable.field, normalizationField = sizeVariable.normalizationField, valueExpression = sizeVariable.valueExpression;
        return new OpacityVariable({
            field: field,
            normalizationField: normalizationField,
            valueExpression: valueExpression,
            stops: stops
        });
    }
    var minOpacity = 0.2;
    var maxOpacity = 1.0;
    function createOpacityStopsWithHighToLowTheme(stats) {
        var max = stats.max, min = stats.min;
        return [
            new OpacityStop({
                value: min, opacity: minOpacity
            }),
            new OpacityStop({
                value: max, opacity: maxOpacity
            })
        ];
    }
    function createOpacityStopsWithAboveAverageTheme(stats) {
        var max = stats.max, avg = stats.avg;
        return [
            new OpacityStop({
                value: avg, opacity: minOpacity
            }),
            new OpacityStop({
                value: max, opacity: maxOpacity
            })
        ];
    }
    function createOpacityStopsWithBelowAverageTheme(stats) {
        var min = stats.min, avg = stats.avg;
        return [
            new OpacityStop({
                value: min, opacity: maxOpacity
            }),
            new OpacityStop({
                value: avg, opacity: minOpacity
            })
        ];
    }
    function createOpacityStopsWith9010Theme(stats) {
        return [
            new OpacityStop({
                value: stats["10"], opacity: minOpacity
            }),
            new OpacityStop({
                value: stats["90"], opacity: maxOpacity
            })
        ];
    }
    function createOpacityStopsWithAboveAndBelowTheme(stats) {
        var max = stats.max, avg = stats.avg;
        return [
            new OpacityStop({
                value: avg, opacity: minOpacity
            }),
            new OpacityStop({
                value: max, opacity: maxOpacity
            })
        ];
    }
    function createOpacityStopsWithExtremesTheme(stats) {
        var min = stats.min, max = stats.max, avg = stats.avg, stddev = stats.stddev;
        return [
            new OpacityStop({
                value: min, opacity: maxOpacity
            }),
            new OpacityStop({
                value: avg, opacity: minOpacity
            }),
            new OpacityStop({
                value: max, opacity: maxOpacity
            })
        ];
    }
    function createOpacityStopsWithCenteredOnTheme(stats) {
        var min = stats.min, max = stats.max, avg = stats.avg, stddev = stats.stddev;
        return [
            new OpacityStop({
                value: min, opacity: minOpacity
            }),
            new OpacityStop({
                value: avg, opacity: maxOpacity
            }),
            new OpacityStop({
                value: max, opacity: minOpacity
            })
        ];
    }
});
//# sourceMappingURL=opacitySizeRendererUtils.js.map