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
define(["require", "exports", "esri/widgets/smartMapping/SizeSlider", "esri/widgets/smartMapping/ColorSizeSlider", "./statUtils", "./rendererUtils", "./sizeRendererUtils"], function (require, exports, SizeSlider, ColorSizeSlider, statUtils_1, rendererUtils_1, sizeRendererUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SliderVars = /** @class */ (function () {
        function SliderVars() {
        }
        SliderVars.slider = null;
        SliderVars.colorSizeSlider = null;
        return SliderVars;
    }());
    exports.SliderVars = SliderVars;
    function updateSizeSlider(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, rendererResult, sizeVariable, _a, field, normalizationField, valueExpression, histogramResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layer = params.layer, view = params.view, rendererResult = params.rendererResult;
                        sizeVariable = rendererUtils_1.getVisualVariableByType(rendererResult.renderer, "size");
                        _a = sizeVariable, field = _a.field, normalizationField = _a.normalizationField, valueExpression = _a.valueExpression;
                        return [4 /*yield*/, statUtils_1.calculateHistogram({
                                layer: layer, view: view, field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 1:
                        histogramResult = _b.sent();
                        if (!SliderVars.slider) {
                            SliderVars.slider = SizeSlider.fromRendererResult(rendererResult, histogramResult);
                            SliderVars.slider.container = "size-slider-container";
                            SliderVars.slider.labelFormatFunction = function (value) { return parseInt(value.toFixed(0)).toLocaleString(); };
                            SliderVars.slider.on([
                                "thumb-change",
                                "thumb-drag",
                                "min-change",
                                "max-change"
                            ], function () {
                                var newRenderer = sizeRendererUtils_1.updateRendererFromSizeSlider(layer.renderer, SliderVars.slider);
                                layer.renderer = newRenderer;
                            });
                        }
                        else {
                            SliderVars.slider.container.style.display = "block";
                            SliderVars.slider.updateFromRendererResult(rendererResult, histogramResult);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateSizeSlider = updateSizeSlider;
    function updateColorSizeSlider(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, rendererResult, sizeVariable, _a, field, normalizationField, valueExpression, histogramResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layer = params.layer, view = params.view, rendererResult = params.rendererResult;
                        sizeVariable = rendererUtils_1.getVisualVariableByType(rendererResult.renderer, "size");
                        _a = sizeVariable, field = _a.field, normalizationField = _a.normalizationField, valueExpression = _a.valueExpression;
                        return [4 /*yield*/, statUtils_1.calculateHistogram({
                                layer: layer, view: view, field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 1:
                        histogramResult = _b.sent();
                        if (!SliderVars.slider) {
                            SliderVars.colorSizeSlider = ColorSizeSlider.fromRendererResult(rendererResult, histogramResult);
                            SliderVars.colorSizeSlider.container = "size-slider-container";
                            SliderVars.colorSizeSlider.labelFormatFunction = function (value) { return parseInt(value.toFixed(0)).toLocaleString(); };
                            SliderVars.colorSizeSlider.on([
                                "thumb-change",
                                "thumb-drag",
                                "min-change",
                                "max-change"
                            ], function () {
                                var newRenderer = sizeRendererUtils_1.updateRendererFromSizeSlider(layer.renderer, SliderVars.slider);
                                layer.renderer = newRenderer;
                            });
                        }
                        else {
                            SliderVars.colorSizeSlider.container.style.display = "block";
                            SliderVars.colorSizeSlider.updateFromRendererResult(rendererResult, histogramResult);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateColorSizeSlider = updateColorSizeSlider;
});
//# sourceMappingURL=sliderUtils.js.map