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
define(["require", "exports", "esri/smartMapping/renderers/univariateColorSize", "esri/smartMapping/symbology/support/colorRamps", "esri/symbols/support/symbolUtils", "./sliderUtils", "./rendererUtils", "./layerUtils"], function (require, exports, colorSizeRendererCreator, colorRamps, symbolUtils, sliderUtils_1, rendererUtils_1, layerUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDonutsElement = document.getElementById("use-donuts");
    /////////////////////////////////////
    ///
    /// Color and Size Renderer
    ///
    //////////////////////////////////////
    function createColorSizeRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, field, normalizationField, valueExpression, theme, useBinarySizeSlider, result, rendererColor, aboveSymbol, belowSymbol, aboveColor, belowColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, field = params.field, normalizationField = params.normalizationField, valueExpression = params.valueExpression;
                        theme = params.theme || "high-to-low";
                        useBinarySizeSlider = params.colorOptions && !params.colorOptions.isContinuous && theme === "above-and-below";
                        return [4 /*yield*/, colorSizeRendererCreator.createContinuousRenderer(params)];
                    case 1:
                        result = _a.sent();
                        rendererColor = rendererUtils_1.getSizeRendererColor(result.renderer);
                        sliderUtils_1.colorPicker.value = rendererColor.toHex();
                        if (!useBinarySizeSlider) return [3 /*break*/, 3];
                        aboveSymbol = result.renderer.classBreakInfos[1].symbol;
                        belowSymbol = result.renderer.classBreakInfos[0].symbol;
                        aboveColor = rendererUtils_1.getSymbolColor(aboveSymbol);
                        belowColor = rendererUtils_1.getSymbolColor(belowSymbol);
                        sliderUtils_1.colorPickerAbove.value = aboveColor.toHex();
                        sliderUtils_1.colorPickerBelow.value = belowColor.toHex();
                        return [4 /*yield*/, sliderUtils_1.updateBinaryColorSizeSlider({
                                layer: layer,
                                view: view,
                                rendererResult: result
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, sliderUtils_1.updateColorSizeSlider({
                            layer: layer,
                            view: view,
                            rendererResult: result,
                            theme: theme
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        createColorRamps(theme);
                        return [2 /*return*/, result];
                }
            });
        });
    }
    exports.createColorSizeRenderer = createColorSizeRenderer;
    var colorRampsElement = document.getElementById("color-ramps");
    function createColorRamps(theme) {
        colorRampsElement.innerHTML = null;
        var excludedTags = ["extremes", "heatmap", "point-cloud", "categorical", "centered-on"];
        var ramps = colorRamps.byTag({
            includedTags: theme === "above-and-below" ? ["diverging"] : ["sequential"],
            excludedTags: theme === "above-and-below" ? excludedTags : excludedTags.concat(["diverging"])
        });
        ramps.sort(function (a, b) {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        });
        ramps.forEach(function (ramp) {
            var rampElement = symbolUtils.renderColorRampPreviewHTML(ramp.colors, {
                align: "vertical",
                gradient: true,
                width: 10,
                height: 30
            });
            var rampContainer = document.createElement("div");
            rampContainer.classList.add("ramps");
            rampContainer.title = ramp.name;
            rampContainer.appendChild(rampElement);
            rampContainer.addEventListener("click", function (event) {
                updateColorVariableRamp(ramp.colors);
            });
            colorRampsElement.appendChild(rampContainer);
        });
    }
    function updateColorVariableRamp(colors) {
        var renderer = layerUtils_1.LayerVars.layer.renderer.clone();
        var colorVariable = rendererUtils_1.getVisualVariableByType(renderer, "color");
        colorVariable.stops.forEach(function (stop, i) {
            stop.color = colors[i];
        });
        layerUtils_1.LayerVars.layer.renderer = renderer;
        sliderUtils_1.updateColorSizeSliderColors(colorVariable);
    }
});
//# sourceMappingURL=colorSizeRendererUtils.js.map