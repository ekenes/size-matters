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
define(["require", "exports", "esri/widgets/smartMapping/SizeSlider", "esri/widgets/smartMapping/ColorSizeSlider", "esri/widgets/smartMapping/BinaryColorSizeSlider", "esri/widgets/Slider", "esri/widgets/smartMapping/OpacitySlider", "esri/symbols/support/cimSymbolUtils", "esri/Color", "./statUtils", "./rendererUtils", "./sizeRendererUtils", "./colorSizeRendererUtils", "./layerUtils"], function (require, exports, SizeSlider, ColorSizeSlider, BinaryColorSizeSlider, Slider, OpacitySlider, cimSymbolUtils, Color, statUtils_1, rendererUtils_1, sizeRendererUtils_1, colorSizeRendererUtils_1, layerUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SliderVars = /** @class */ (function () {
        function SliderVars() {
        }
        SliderVars.slider = null;
        SliderVars.symbolSizesSlider = null;
        SliderVars.colorSizeSlider = null;
        SliderVars.binaryColorSizeSlider = null;
        SliderVars.opacitySlider = null;
        SliderVars.opacityValuesSlider = null;
        return SliderVars;
    }());
    exports.SliderVars = SliderVars;
    // const slidersContainer = document.getElementById("sliders-container");
    var sizeSlidersContainer = document.getElementById("size-slider-container");
    var opacitySlidersContainer = document.getElementById("opacity-slider-container");
    var symbolSizesContainer = document.getElementById("symbol-sizes");
    var opacityValuesContainer = document.getElementById("opacity-values");
    exports.colorPicker = document.getElementById("color-picker");
    exports.colorPickerAbove = document.getElementById("color-picker-above");
    exports.colorPickerBelow = document.getElementById("color-picker-below");
    function updateSizeSlider(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, rendererResult, updateOpacity, theme, sizeVariable, field, normalizationField, valueExpression, minSize, maxSize, stops, symbolSizeSliderValues, maxStop, minStop, midStop, histogramResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, rendererResult = params.rendererResult, updateOpacity = params.updateOpacity, theme = params.theme;
                        sizeVariable = rendererUtils_1.getVisualVariableByType(rendererResult.renderer, "size");
                        field = sizeVariable.field, normalizationField = sizeVariable.normalizationField, valueExpression = sizeVariable.valueExpression, minSize = sizeVariable.minSize, maxSize = sizeVariable.maxSize, stops = sizeVariable.stops;
                        symbolSizeSliderValues = [];
                        if (stops && stops.length > 0) {
                            maxStop = stops[stops.length - 1];
                            minStop = stops[0];
                            if (theme === "above-and-below") {
                                midStop = stops[Math.floor(stops.length / 2)];
                                symbolSizeSliderValues = [midStop.size, maxStop.size];
                            }
                            else {
                                symbolSizeSliderValues = [minStop.size, maxStop.size];
                            }
                        }
                        if (minSize && maxSize) {
                            symbolSizeSliderValues = [minSize, maxSize];
                        }
                        return [4 /*yield*/, statUtils_1.calculateHistogram({
                                layer: layer, view: view, field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 1:
                        histogramResult = _a.sent();
                        if (!SliderVars.slider) {
                            SliderVars.slider = SizeSlider.fromRendererResult(rendererResult, histogramResult);
                            SliderVars.slider.container = document.createElement("div");
                            sizeSlidersContainer.appendChild(SliderVars.slider.container);
                            // SliderVars.slider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };
                            SliderVars.slider.on([
                                "thumb-change",
                                "thumb-drag",
                                "min-change",
                                "max-change"
                            ], function () {
                                var oldRenderer = layerUtils_1.LayerVars.layer.renderer;
                                var newRenderer = sizeRendererUtils_1.updateRendererFromSizeSlider(oldRenderer, SliderVars.slider);
                                // const sizeStops = SliderVars.slider.stops;
                                // if(updateOpacity){
                                //   const opacityVariable = getVisualVariableByType(newRenderer, "opacity") as esri.OpacityVariable;
                                //   opacityVariable.stops = sizeStops.map(
                                //     function(sizeStop){
                                //       return new OpacityStop({
                                //         value: sizeStop.value, opacity:
                                //       });
                                //     });
                                // }
                                // const authoringInfoSizeVV = newRenderer.authoringInfo.visualVariables.filter( vv => vv.type === "size")[0];
                                if (newRenderer.classBreakInfos.length > 1) {
                                    var midIndex = SliderVars.slider.stops.length === 5 ? 2 : 1;
                                    var midValue = SliderVars.slider.stops[midIndex].value;
                                    newRenderer.classBreakInfos[0].maxValue = midValue;
                                    newRenderer.classBreakInfos[1].minValue = midValue;
                                }
                                layerUtils_1.LayerVars.layer.renderer = newRenderer;
                            });
                        }
                        else {
                            SliderVars.slider.container.style.display = "block";
                            SliderVars.slider.updateFromRendererResult(rendererResult, histogramResult);
                        }
                        if (theme === "above-and-below") {
                            SliderVars.slider.stops = stops;
                            SliderVars.slider.primaryHandleEnabled = true;
                            SliderVars.slider.handlesSyncedToPrimary = true;
                        }
                        else {
                            SliderVars.slider.primaryHandleEnabled = false;
                            SliderVars.slider.handlesSyncedToPrimary = false;
                        }
                        updateSymbolSizesSlider({ values: symbolSizeSliderValues, theme: theme });
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateSizeSlider = updateSizeSlider;
    function updateBinaryColorSizeSlider(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, rendererResult, univariateTheme, sizeVariable, field, normalizationField, valueExpression, minSize, maxSize, stops, symbolSizeSliderValues, maxStop, minStop, midStop, histogramResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, rendererResult = params.rendererResult;
                        univariateTheme = rendererResult.renderer.authoringInfo.univariateTheme;
                        sizeVariable = rendererUtils_1.getVisualVariableByType(rendererResult.renderer, "size");
                        field = sizeVariable.field, normalizationField = sizeVariable.normalizationField, valueExpression = sizeVariable.valueExpression, minSize = sizeVariable.minSize, maxSize = sizeVariable.maxSize, stops = sizeVariable.stops;
                        symbolSizeSliderValues = [];
                        if (stops && stops.length > 0) {
                            maxStop = stops[stops.length - 1];
                            minStop = stops[0];
                            if (univariateTheme === "above-and-below") {
                                midStop = stops[Math.floor(stops.length / 2)];
                                symbolSizeSliderValues = [midStop.size, maxStop.size];
                            }
                            else {
                                symbolSizeSliderValues = [minStop.size, maxStop.size];
                            }
                        }
                        if (minSize && maxSize) {
                            symbolSizeSliderValues = [minSize, maxSize];
                        }
                        return [4 /*yield*/, statUtils_1.calculateHistogram({
                                layer: layer, view: view, field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 1:
                        histogramResult = _a.sent();
                        if (!SliderVars.binaryColorSizeSlider) {
                            SliderVars.binaryColorSizeSlider = BinaryColorSizeSlider.fromRendererResult(rendererResult, histogramResult);
                            SliderVars.binaryColorSizeSlider.container = document.createElement("div");
                            sizeSlidersContainer.appendChild(SliderVars.binaryColorSizeSlider.container);
                            // SliderVars.binaryColorSizeSlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };
                            SliderVars.binaryColorSizeSlider.on([
                                "thumb-change",
                                "thumb-drag",
                                "min-change",
                                "max-change"
                            ], function () {
                                layerUtils_1.LayerVars.layer.renderer = SliderVars.binaryColorSizeSlider.updateRenderer(layerUtils_1.LayerVars.layer.renderer);
                            });
                        }
                        else {
                            SliderVars.binaryColorSizeSlider.container.style.display = "block";
                            SliderVars.binaryColorSizeSlider.updateFromRendererResult(rendererResult, histogramResult);
                        }
                        updateSymbolSizesSlider({ values: symbolSizeSliderValues, theme: univariateTheme });
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateBinaryColorSizeSlider = updateBinaryColorSizeSlider;
    function updateColorSizeSlider(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, rendererResult, theme, sizeVariable, colorVariable, colorStops, field, normalizationField, valueExpression, minSize, maxSize, stops, symbolSizeSliderValues, maxStop, minStop, midStop, histogramResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, rendererResult = params.rendererResult, theme = params.theme;
                        sizeVariable = rendererUtils_1.getVisualVariableByType(rendererResult.renderer, "size");
                        colorVariable = rendererUtils_1.getVisualVariableByType(rendererResult.renderer, "color");
                        colorStops = colorVariable.stops;
                        field = sizeVariable.field, normalizationField = sizeVariable.normalizationField, valueExpression = sizeVariable.valueExpression, minSize = sizeVariable.minSize, maxSize = sizeVariable.maxSize, stops = sizeVariable.stops;
                        symbolSizeSliderValues = [];
                        if (stops && stops.length > 0) {
                            maxStop = stops[stops.length - 1];
                            minStop = stops[0];
                            if (theme === "above-and-below") {
                                midStop = stops[Math.floor(stops.length / 2)];
                                symbolSizeSliderValues = [midStop.size, maxStop.size];
                            }
                            else {
                                symbolSizeSliderValues = [minStop.size, maxStop.size];
                            }
                        }
                        if (minSize && maxSize) {
                            symbolSizeSliderValues = [minSize, maxSize];
                        }
                        return [4 /*yield*/, statUtils_1.calculateHistogram({
                                layer: layer, view: view, field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 1:
                        histogramResult = _a.sent();
                        if (!SliderVars.colorSizeSlider) {
                            SliderVars.colorSizeSlider = ColorSizeSlider.fromRendererResult(rendererResult, histogramResult);
                            SliderVars.colorSizeSlider.container = document.createElement("div");
                            sizeSlidersContainer.appendChild(SliderVars.colorSizeSlider.container);
                            // SliderVars.colorSizeSlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };
                            SliderVars.colorSizeSlider.on([
                                "thumb-change",
                                "thumb-drag",
                                "min-change",
                                "max-change"
                            ], function () {
                                var newRenderer = colorSizeRendererUtils_1.updateRendererFromColorSizeSlider(layerUtils_1.LayerVars.layer.renderer, SliderVars.colorSizeSlider);
                                if (newRenderer.classBreakInfos.length > 1) {
                                    var midIndex = SliderVars.colorSizeSlider.stops.length === 5 ? 2 : 1;
                                    var midValue = SliderVars.colorSizeSlider.stops[midIndex].value;
                                    newRenderer.classBreakInfos[0].maxValue = midValue;
                                    newRenderer.classBreakInfos[1].minValue = midValue;
                                }
                                layerUtils_1.LayerVars.layer.renderer = newRenderer;
                            });
                        }
                        else {
                            SliderVars.colorSizeSlider.container.style.display = "block";
                            SliderVars.colorSizeSlider.updateFromRendererResult(rendererResult, histogramResult);
                        }
                        if (theme === "above-and-below") {
                            SliderVars.colorSizeSlider.stops = [
                                { color: colorStops[0].color, size: stops[0].size, value: stops[0].value },
                                { color: colorStops[1].color, size: stops[1].size, value: stops[1].value },
                                { color: colorStops[2].color, size: stops[2].size, value: stops[2].value },
                                { color: colorStops[3].color, size: stops[3].size, value: stops[3].value },
                                { color: colorStops[4].color, size: stops[4].size, value: stops[4].value }
                            ];
                            SliderVars.colorSizeSlider.primaryHandleEnabled = true;
                            SliderVars.colorSizeSlider.handlesSyncedToPrimary = true;
                        }
                        else {
                            SliderVars.colorSizeSlider.primaryHandleEnabled = false;
                            SliderVars.colorSizeSlider.handlesSyncedToPrimary = false;
                        }
                        updateSymbolSizesSlider({ values: symbolSizeSliderValues, theme: theme });
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateColorSizeSlider = updateColorSizeSlider;
    function updateColorSizeSliderColors(colorVariable) {
        SliderVars.colorSizeSlider.stops.forEach(function (stop, i) {
            stop.color = colorVariable.stops[i].color;
        });
    }
    exports.updateColorSizeSliderColors = updateColorSizeSliderColors;
    function updateColorSizeSliderSizes(sizeVariable) {
        var minSize = sizeVariable.minSize, maxSize = sizeVariable.maxSize, stops = sizeVariable.stops;
        if (stops && stops.length > 0) {
            SliderVars.colorSizeSlider.stops.forEach(function (stop, i) {
                stop.size = sizeVariable.stops[i].size;
            });
        }
        else {
            var lastIndex_1 = SliderVars.colorSizeSlider.stops.length - 1;
            SliderVars.colorSizeSlider.stops.forEach(function (stop, i) {
                if (i === 0) {
                    stop.size = minSize;
                }
                else if (i === lastIndex_1) {
                    stop.size = maxSize;
                }
                else {
                    stop.size = null;
                }
            });
        }
    }
    exports.updateColorSizeSliderSizes = updateColorSizeSliderSizes;
    function updateSizeSliderSizes(sizeVariable) {
        var minSize = sizeVariable.minSize, maxSize = sizeVariable.maxSize, stops = sizeVariable.stops;
        if (stops && stops.length > 0) {
            SliderVars.slider.stops.forEach(function (stop, i) {
                stop.size = sizeVariable.stops[i].size;
            });
        }
        else {
            SliderVars.slider.stops[0].size = minSize;
            SliderVars.slider.stops[1].size = maxSize;
        }
    }
    exports.updateSizeSliderSizes = updateSizeSliderSizes;
    function updateOpacitySliderValues(opacityVariable) {
        SliderVars.opacitySlider.stops.forEach(function (stop, i) {
            stop.opacity = opacityVariable.stops[i].opacity;
        });
    }
    exports.updateOpacitySliderValues = updateOpacitySliderValues;
    var symbolSizesSliderWatchHandle = null;
    function createSymbolSizesWatcher(values, theme) {
        return function (values) {
            var renderer = layerUtils_1.LayerVars.layer.renderer.clone();
            var sizeVariable = rendererUtils_1.getVisualVariableByType(renderer, "size");
            var stops = sizeVariable.stops;
            var minSize = theme !== "below" ? values[0] : values[1];
            var maxSize = theme !== "below" ? values[1] : values[0];
            if (stops && stops.length > 0) {
                var midSize = sizeRendererUtils_1.calcuateMidSize(minSize, maxSize);
                stops[0].size = maxSize;
                stops[1].size = midSize;
                stops[2].size = minSize;
                stops[3].size = midSize;
                stops[4].size = maxSize;
            }
            else {
                sizeVariable.minSize = minSize;
                sizeVariable.maxSize = maxSize;
            }
            layerUtils_1.LayerVars.layer.renderer = renderer;
            if (SliderVars.colorSizeSlider) {
                updateColorSizeSliderSizes(sizeVariable);
            }
            if (SliderVars.slider) {
                updateSizeSliderSizes(sizeVariable);
            }
        };
    }
    function updateSymbolSizesSlider(params) {
        var values = params.values, theme = params.theme;
        if (values[1] < values[0]) {
            values.reverse();
        }
        if (!SliderVars.symbolSizesSlider) {
            SliderVars.symbolSizesSlider = new Slider({
                values: values,
                container: symbolSizesContainer,
                min: 1,
                max: 40,
                steps: 0.5,
                labelInputsEnabled: true,
                rangeLabelInputsEnabled: true,
                visibleElements: {
                    rangeLabels: true,
                    labels: true
                }
            });
        }
        else {
            SliderVars.symbolSizesSlider.values = values;
        }
        if (symbolSizesSliderWatchHandle) {
            symbolSizesSliderWatchHandle.remove();
            symbolSizesSliderWatchHandle = null;
        }
        symbolSizesSliderWatchHandle = SliderVars.symbolSizesSlider.watch("values", createSymbolSizesWatcher(values, theme));
    }
    function updateOpacitySlider(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, visualVariableResult, opacityVariable, field, normalizationField, valueExpression, histogramResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, visualVariableResult = params.visualVariableResult;
                        opacityVariable = visualVariableResult.visualVariable;
                        field = opacityVariable.field, normalizationField = opacityVariable.normalizationField, valueExpression = opacityVariable.valueExpression;
                        return [4 /*yield*/, statUtils_1.calculateHistogram({
                                layer: layer, view: view, field: field, normalizationField: normalizationField, valueExpression: valueExpression
                            })];
                    case 1:
                        histogramResult = _a.sent();
                        if (!SliderVars.opacitySlider) {
                            SliderVars.opacitySlider = OpacitySlider.fromVisualVariableResult(visualVariableResult, histogramResult);
                            SliderVars.opacitySlider.container = document.createElement("div");
                            opacitySlidersContainer.appendChild(SliderVars.opacitySlider.container);
                            // SliderVars.opacitySlider.labelFormatFunction = (value: number) => { return parseInt(value.toFixed(0)).toLocaleString() };
                            SliderVars.opacitySlider.on([
                                "thumb-change",
                                "thumb-drag",
                                "min-change",
                                "max-change"
                            ], function () {
                                var newRenderer = layerUtils_1.LayerVars.layer.renderer.clone();
                                var opacityVariable = rendererUtils_1.getVisualVariableByType(newRenderer, "opacity");
                                opacityVariable.stops = SliderVars.opacitySlider.stops;
                                layerUtils_1.LayerVars.layer.renderer = newRenderer;
                            });
                        }
                        else {
                            SliderVars.opacitySlider.container.style.display = "block";
                            SliderVars.opacitySlider.updateFromVisualVariableResult(visualVariableResult, histogramResult);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.updateOpacitySlider = updateOpacitySlider;
    function updateOpacityValuesSlider(params) {
        var values = params.values;
        if (!SliderVars.opacityValuesSlider) {
            SliderVars.opacityValuesSlider = new Slider({
                values: values,
                container: opacityValuesContainer,
                min: 0,
                max: 1,
                steps: 0.05,
                labelInputsEnabled: true,
                rangeLabelInputsEnabled: true,
                visibleElements: {
                    rangeLabels: true,
                    labels: true
                }
            });
            SliderVars.opacityValuesSlider.watch("values", function (values) {
                var renderer = layerUtils_1.LayerVars.layer.renderer.clone();
                var opacityVariable = rendererUtils_1.getVisualVariableByType(renderer, "opacity");
                var stops = opacityVariable.stops;
                var minOpacity = values[0];
                var maxOpacity = values[1];
                stops[0].opacity = minOpacity;
                stops[1].opacity = maxOpacity;
                layerUtils_1.LayerVars.layer.renderer = renderer;
                updateOpacitySliderValues(opacityVariable);
            });
        }
        else {
            SliderVars.opacityValuesSlider.values = values;
        }
    }
    exports.updateOpacityValuesSlider = updateOpacityValuesSlider;
    exports.colorPicker.addEventListener("input", function (event) {
        var newColor = new Color(exports.colorPicker.value);
        var renderer = layerUtils_1.LayerVars.layer.renderer.clone();
        var classBreakInfos = renderer.classBreakInfos;
        classBreakInfos.forEach(function (info) {
            var symbol = info.symbol;
            if (symbol.type === "cim") {
                cimSymbolUtils.applyCIMSymbolColor(symbol, newColor);
            }
            if (symbol.symbolLayers) {
                var sl = symbol.symbolLayers.getItemAt(0);
                sl.material = {
                    color: newColor
                };
            }
            else {
                symbol.color = newColor;
            }
        });
        layerUtils_1.LayerVars.layer.renderer = renderer;
    });
    exports.colorPickerBelow.addEventListener("input", function (event) {
        var newColor = new Color(exports.colorPickerBelow.value);
        if (SliderVars.binaryColorSizeSlider) {
            SliderVars.binaryColorSizeSlider.style.trackBelowFillColor = newColor;
        }
        var renderer = layerUtils_1.LayerVars.layer.renderer.clone();
        var symbol = renderer.classBreakInfos[0].symbol;
        if (symbol.type === "cim") {
            cimSymbolUtils.applyCIMSymbolColor(symbol, newColor);
        }
        if (symbol.symbolLayers) {
            var sl = symbol.symbolLayers.getItemAt(0);
            sl.material = {
                color: newColor
            };
        }
        else {
            symbol.color = newColor;
        }
        layerUtils_1.LayerVars.layer.renderer = renderer;
    });
    exports.colorPickerAbove.addEventListener("input", function (event) {
        var newColor = new Color(exports.colorPickerAbove.value);
        if (SliderVars.binaryColorSizeSlider) {
            SliderVars.binaryColorSizeSlider.style.trackAboveFillColor = newColor;
        }
        var renderer = layerUtils_1.LayerVars.layer.renderer.clone();
        var symbol = renderer.classBreakInfos[1].symbol;
        if (symbol.type === "cim") {
            cimSymbolUtils.applyCIMSymbolColor(symbol, newColor);
        }
        if (symbol.symbolLayers) {
            var sl = symbol.symbolLayers.getItemAt(0);
            sl.material = {
                color: newColor
            };
        }
        else {
            symbol.color = newColor;
        }
        layerUtils_1.LayerVars.layer.renderer = renderer;
    });
    function destroySizeSlider() {
        SliderVars.slider.destroy();
        SliderVars.slider.container = null;
        SliderVars.slider = null;
    }
    exports.destroySizeSlider = destroySizeSlider;
});
//# sourceMappingURL=sliderUtils.js.map