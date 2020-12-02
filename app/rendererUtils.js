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
define(["require", "exports", "esri/symbols/support/cimSymbolUtils", "./sizeRendererUtils", "./colorSizeRendererUtils", "./sliderUtils", "./opacitySizeRendererUtils", "./symbolUtils"], function (require, exports, cimSymbolUtils, sizeRendererUtils_1, colorSizeRendererUtils_1, sliderUtils_1, opacitySizeRendererUtils_1, symbolUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var binaryParentElement = document.getElementById("binary-parent");
    var isBinaryElement = document.getElementById("binary-switch");
    var symbolColorContainer = document.getElementById("symbol-color-container");
    var symbolColor = document.getElementById("symbol-color");
    var symbolColorAbove = document.getElementById("symbol-color-above");
    var symbolColorBelow = document.getElementById("symbol-color-below");
    var sizeOptionsElement = document.getElementById("size-options");
    var opacityOptionsElement = document.getElementById("opacity-options");
    var colorRampsContainer = document.getElementById("color-ramps-container");
    var symbolsSelect = document.getElementById("symbols-select");
    var themeSelect = document.getElementById("theme-select");
    function updateRenderer(params, style) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, theme, result, _a, useSizeSlider;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layer = params.layer, theme = params.theme;
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
                        [].forEach.call(themeSelect, function (option) {
                            option.disabled = option.value === "above-and-below";
                        });
                        if (params.theme === "above-and-below") {
                            params.theme = "high-to-low";
                            themeSelect.value = "high-to-low";
                        }
                        return [4 /*yield*/, sizeRendererUtils_1.createSizeRenderer(params)];
                    case 2:
                        result = _b.sent();
                        symbolColor.style.display = "block";
                        symbolColorAbove.style.display = "none";
                        symbolColorBelow.style.display = "none";
                        binaryParentElement.style.display = "none";
                        symbolColorContainer.style.display = "block";
                        opacityOptionsElement.style.display = "none";
                        colorRampsContainer.style.display = "none";
                        return [3 /*break*/, 8];
                    case 3:
                        useSizeSlider = isBinaryElement.checked && theme === "above-and-below";
                        symbolColor.style.display = "none";
                        if (sliderUtils_1.SliderVars.slider && !useSizeSlider) {
                            sliderUtils_1.SliderVars.slider.destroy();
                            sliderUtils_1.SliderVars.slider.container = null;
                            sliderUtils_1.SliderVars.slider = null;
                            symbolColorAbove.style.display = "none";
                            symbolColorBelow.style.display = "none";
                            symbolColorContainer.style.display = "none";
                            colorRampsContainer.style.display = "flex";
                        }
                        if (sliderUtils_1.SliderVars.colorSizeSlider && useSizeSlider) {
                            sliderUtils_1.SliderVars.colorSizeSlider.destroy();
                            sliderUtils_1.SliderVars.colorSizeSlider.container = null;
                            sliderUtils_1.SliderVars.colorSizeSlider = null;
                            symbolColorAbove.style.display = "block";
                            symbolColorBelow.style.display = "block";
                            symbolColorContainer.style.display = "block";
                            colorRampsContainer.style.display = "none";
                        }
                        if (sliderUtils_1.SliderVars.opacitySlider) {
                            sliderUtils_1.SliderVars.opacitySlider.destroy();
                            sliderUtils_1.SliderVars.opacitySlider.container = null;
                            sliderUtils_1.SliderVars.opacitySlider = null;
                        }
                        [].forEach.call(themeSelect, function (option) {
                            option.disabled = false;
                        });
                        if (theme === "above-and-below") {
                            binaryParentElement.style.display = "block";
                            params.colorOptions = {
                                isContinuous: !isBinaryElement.checked
                            };
                            if (symbolsSelect.value) {
                                if (symbolsSelect.value === "custom") {
                                    params.symbolOptions = {
                                        symbolStyle: null,
                                        symbols: {
                                            above: symbolUtils_1.symbolOptions.dottedArrows.above,
                                            below: symbolUtils_1.symbolOptions.dottedArrows.below
                                        }
                                    };
                                }
                                else {
                                    params.symbolOptions = {
                                        symbolStyle: symbolsSelect.value !== "default" ? symbolsSelect.value : null
                                    };
                                }
                            }
                        }
                        else {
                            binaryParentElement.style.display = "none";
                        }
                        // symbolColorContainer.style.display = "none";
                        opacityOptionsElement.style.display = "none";
                        return [4 /*yield*/, colorSizeRendererUtils_1.createColorSizeRenderer(params)];
                    case 4:
                        // colorRampsContainer.style.display = "flex";
                        result = _b.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        if (sliderUtils_1.SliderVars.colorSizeSlider) {
                            sliderUtils_1.SliderVars.colorSizeSlider.destroy();
                            sliderUtils_1.SliderVars.colorSizeSlider.container = null;
                            sliderUtils_1.SliderVars.colorSizeSlider = null;
                        }
                        symbolColorContainer.style.display = "block";
                        opacityOptionsElement.style.display = "flex";
                        colorRampsContainer.style.display = "none";
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
    function getSymbolColor(symbol) {
        if (symbol.type === "cim") {
            return cimSymbolUtils.getCIMSymbolColor(symbol);
        }
        if (symbol.symbolLayers) {
            var symbolLayer = symbol.symbolLayers.getItemAt(0);
            return symbolLayer.material.color;
        }
        return symbol.color;
    }
    exports.getSymbolColor = getSymbolColor;
});
//# sourceMappingURL=rendererUtils.js.map