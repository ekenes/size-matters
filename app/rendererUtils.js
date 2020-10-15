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
define(["require", "exports", "esri/symbols/support/cimSymbolUtils", "esri/renderers/support/ClassBreakInfo", "./sizeRendererUtils", "./colorSizeRendererUtils", "./sliderUtils", "./opacitySizeRendererUtils", "./symbolUtils", "./layerUtils"], function (require, exports, cimSymbolUtils, ClassBreakInfo, sizeRendererUtils_1, colorSizeRendererUtils_1, sliderUtils_1, opacitySizeRendererUtils_1, symbolUtils_1, layerUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var useDonutsParentElement = document.getElementById("use-donuts-parent");
    var symbolColorContainer = document.getElementById("symbol-color-container");
    var sizeOptionsElement = document.getElementById("size-options");
    var opacityOptionsElement = document.getElementById("opacity-options");
    var colorRampsElement = document.getElementById("color-ramps");
    function updateRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, theme, style, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layer = params.layer, theme = params.theme;
                        style = params.style || "size";
                        result = null;
                        _a = style;
                        switch (_a) {
                            case "size": return [3 /*break*/, 1];
                            case "color-and-size": return [3 /*break*/, 3];
                            case "opacity-and-size": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        if (sliderUtils_1.SliderVars.colorSizeSlider) {
                            sliderUtils_1.SliderVars.colorSizeSlider.destroy();
                            sliderUtils_1.SliderVars.colorSizeSlider.container = null;
                            sliderUtils_1.SliderVars.colorSizeSlider = null;
                        }
                        if (sliderUtils_1.SliderVars.opacitySlider) {
                            sliderUtils_1.SliderVars.opacitySlider.destroy();
                            sliderUtils_1.SliderVars.opacitySlider.container = null;
                            sliderUtils_1.SliderVars.opacitySlider = null;
                        }
                        return [4 /*yield*/, sizeRendererUtils_1.createSizeRenderer(params)];
                    case 2:
                        result = _b.sent();
                        useDonutsParentElement.style.display = "none";
                        symbolColorContainer.style.display = "block";
                        opacityOptionsElement.style.display = "none";
                        colorRampsElement.style.display = "none";
                        return [3 /*break*/, 8];
                    case 3:
                        if (sliderUtils_1.SliderVars.slider) {
                            sliderUtils_1.SliderVars.slider.destroy();
                            sliderUtils_1.SliderVars.slider.container = null;
                            sliderUtils_1.SliderVars.slider = null;
                        }
                        if (sliderUtils_1.SliderVars.opacitySlider) {
                            sliderUtils_1.SliderVars.opacitySlider.destroy();
                            sliderUtils_1.SliderVars.opacitySlider.container = null;
                            sliderUtils_1.SliderVars.opacitySlider = null;
                        }
                        if (theme === "above-and-below") {
                            useDonutsParentElement.style.display = "block";
                        }
                        else {
                            useDonutsParentElement.style.display = "none";
                        }
                        symbolColorContainer.style.display = "none";
                        opacityOptionsElement.style.display = "none";
                        colorRampsElement.style.display = "flex";
                        return [4 /*yield*/, colorSizeRendererUtils_1.createColorSizeRenderer(params)];
                    case 4:
                        result = _b.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        if (sliderUtils_1.SliderVars.colorSizeSlider) {
                            sliderUtils_1.SliderVars.colorSizeSlider.destroy();
                            sliderUtils_1.SliderVars.colorSizeSlider.container = null;
                            sliderUtils_1.SliderVars.colorSizeSlider = null;
                        }
                        symbolColorContainer.style.display = "block";
                        useDonutsParentElement.style.display = "none";
                        opacityOptionsElement.style.display = "flex";
                        colorRampsElement.style.display = "none";
                        return [4 /*yield*/, opacitySizeRendererUtils_1.createOpacitySizeRenderer(params)];
                    case 6:
                        result = _b.sent();
                        return [3 /*break*/, 8];
                    case 7: 
                    // return variables without modifications
                    return [3 /*break*/, 8];
                    case 8:
                        sizeOptionsElement.style.display = "flex";
                        layer.renderer = result.renderer.clone();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateRenderer = updateRenderer;
    function getVisualVariableByType(renderer, type) {
        var visualVariables = renderer.visualVariables;
        return (visualVariables &&
            visualVariables.filter(function (vv) {
                if (type === "outline") {
                    return vv.type === "size" && vv.target === "outline";
                }
                return vv.type === type;
            })[0]);
    }
    exports.getVisualVariableByType = getVisualVariableByType;
    function getVisualVariablesByType(renderer, type) {
        var visualVariables = renderer.visualVariables;
        return (visualVariables &&
            visualVariables.filter(function (vv) {
                return vv.type === type;
            }));
    }
    exports.getVisualVariablesByType = getVisualVariablesByType;
    function getSizeRendererColor(renderer) {
        var classBreakInfos = renderer.classBreakInfos;
        var solidSymbol = classBreakInfos[classBreakInfos.length - 1].symbol;
        return solidSymbol.color;
    }
    exports.getSizeRendererColor = getSizeRendererColor;
    function createAboveAndBelowRenderer(renderer) {
        var rendererWithDonuts = renderer.clone();
        var sizeVariable = getVisualVariableByType(rendererWithDonuts, "size");
        var stops = sizeVariable.stops, field = sizeVariable.field, normalizationField = sizeVariable.normalizationField, valueExpression = sizeVariable.valueExpression;
        if (!stops || stops.length < 4) {
            console.error("The provided renderer does not use the above and below theme");
            return renderer;
        }
        var aboveSymbol, belowSymbol;
        if (symbolUtils_1.selectedSymbols.name === "donuts") {
            aboveSymbol = rendererWithDonuts.classBreakInfos[0].symbol.clone();
            belowSymbol = symbolUtils_1.donutSymbol;
            cimSymbolUtils.applyCIMSymbolColor(belowSymbol, aboveSymbol.color);
            var symbolSize = aboveSymbol.size;
            var outline = aboveSymbol.outline;
            cimSymbolUtils.scaleCIMSymbolTo(belowSymbol, symbolSize);
            symbolUtils_1.updateSymbolStroke(belowSymbol, outline.width, outline.color);
        }
        else {
            var color = rendererWithDonuts.classBreakInfos[0].symbol.color;
            aboveSymbol = symbolUtils_1.selectedSymbols.above;
            belowSymbol = symbolUtils_1.selectedSymbols.below;
            aboveSymbol.color = color;
            belowSymbol.color = color;
        }
        rendererWithDonuts.field = field;
        rendererWithDonuts.normalizationField = normalizationField;
        rendererWithDonuts.valueExpression = valueExpression;
        rendererWithDonuts.classBreakInfos = [
            new ClassBreakInfo({ minValue: stops[0].value, maxValue: stops[2].value, symbol: belowSymbol }),
            new ClassBreakInfo({ minValue: stops[2].value, maxValue: stops[4].value, symbol: aboveSymbol }),
        ];
        rendererWithDonuts.authoringInfo.visualVariables[0].theme = "above-and-below";
        return rendererWithDonuts;
    }
    exports.createAboveAndBelowRenderer = createAboveAndBelowRenderer;
    function updateAboveAndBelowRendererSymbols(renderer, symbolName) {
        var rendererWithDonuts = renderer.clone();
        var originalSymbol = rendererWithDonuts.classBreakInfos[0].symbol;
        var color = originalSymbol.type === "cim" ? cimSymbolUtils.getCIMSymbolColor(originalSymbol) : originalSymbol.color;
        var symbols = symbolUtils_1.selectedSymbols;
        var aboveSymbol = symbols.above;
        var belowSymbol = symbols.below;
        if (aboveSymbol.type === "cim") {
            cimSymbolUtils.applyCIMSymbolColor(aboveSymbol, color);
        }
        else {
            aboveSymbol.color = color;
        }
        if (belowSymbol.type === "cim") {
            cimSymbolUtils.applyCIMSymbolColor(belowSymbol, color);
        }
        else {
            belowSymbol.color = color;
        }
        rendererWithDonuts.classBreakInfos[0].symbol = belowSymbol;
        rendererWithDonuts.classBreakInfos[1].symbol = aboveSymbol;
        return rendererWithDonuts;
    }
    exports.updateAboveAndBelowRendererSymbols = updateAboveAndBelowRendererSymbols;
    function removeDonutFromRenderer(renderer) {
        var rendererWithoutDonuts = renderer.clone();
        var classBreakInfos = rendererWithoutDonuts.classBreakInfos;
        if (classBreakInfos.length !== 2) {
            console.error("The provided renderer doesn't have the correct number of class breaks");
            return renderer;
        }
        classBreakInfos.shift();
        classBreakInfos[0].minValue = -9007199254740991;
        classBreakInfos[0].maxValue = 9007199254740991;
        return rendererWithoutDonuts;
    }
    colorSizeRendererUtils_1.useDonutsElement.addEventListener("change", function () {
        var renderer = layerUtils_1.LayerVars.layer.renderer;
        layerUtils_1.LayerVars.layer.renderer = colorSizeRendererUtils_1.useDonutsElement.checked ? createAboveAndBelowRenderer(renderer) : removeDonutFromRenderer(renderer);
    });
});
//# sourceMappingURL=rendererUtils.js.map