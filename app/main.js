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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/widgets/Expand", "esri/layers/FeatureLayer", "esri/widgets/BasemapGallery", "esri/widgets/Legend", "./layerUtils", "./rendererUtils"], function (require, exports, WebMap, MapView, Expand, FeatureLayer, BasemapGallery, Legend, layerUtils_1, rendererUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function getUrlParams() {
            var queryParams = document.location.search.substr(1);
            var result = {};
            queryParams.split("&").forEach(function (part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });
            return result;
        }
        // function to set an id as a url param
        function setUrlParams() {
            window.history.pushState("", "", window.location.pathname + "?id=" + id + "&layerId=" + layerId + "&portal=" + portal);
        }
        function inputChange() {
            var field = fieldsSelect.value;
            var normalizationField = normalizationFieldSelect.value;
            var valueExpression = valueExpressionTextArea.value;
            if (!field && !valueExpression && !normalizationField) {
                clearEverything();
                return;
            }
            var theme = themeSelect.value;
            var style = styleSelect.value;
            var params = {
                layer: layer,
                view: view,
                field: field,
                normalizationField: normalizationField,
                valueExpression: valueExpression,
                theme: theme,
                style: style
            };
            rendererUtils_1.updateRenderer(params);
        }
        function clearEverything() {
            layer.renderer = originalRenderer;
            fieldsSelect.value = null;
            normalizationFieldSelect.value = null;
            valueExpressionTextArea.value = null;
            themeSelect.value = "high-to-low";
            styleSelect.value = "size";
        }
        var _a, id, portal, layerId, url, layer, webmap, view, basemapGallery, sliderExpand, originalRenderer, extent, fieldContainer, normalizationFieldContainer, numberFields, fieldsSelect, normalizationFieldSelect, valueExpressionTextArea, themeSelect, styleSelect;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getUrlParams(), id = _a.id, portal = _a.portal, layerId = _a.layerId, url = _a.url;
                    layer = null;
                    if (!url) {
                        if (!id) {
                            id = "cb1886ff0a9d4156ba4d2fadd7e8a139";
                        }
                        if (!layerId) {
                            layerId = 0;
                        }
                        if (!portal) {
                            portal = "https://www.arcgis.com/";
                        }
                        setUrlParams();
                        layer = new FeatureLayer({
                            portalItem: {
                                id: id,
                                portal: {
                                    url: portal
                                }
                            },
                            layerId: layerId
                        });
                    }
                    else {
                        portal = null;
                        id = null;
                        layerId = null;
                        layer = new FeatureLayer({
                            url: url
                        });
                    }
                    layer.opacity = 1;
                    layer.minScale = 0;
                    layer.maxScale = 0;
                    webmap = new WebMap({
                        basemap: {
                            portalItem: {
                                id: "3582b744bba84668b52a16b0b6942544"
                            }
                        },
                        layers: [layer]
                    });
                    view = new MapView({
                        map: webmap,
                        container: "viewDiv"
                    });
                    view.ui.add("ui-controls", "top-right");
                    basemapGallery = new BasemapGallery({ view: view });
                    view.ui.add(new Expand({
                        content: basemapGallery,
                        expanded: false,
                        group: "left"
                    }), "top-left");
                    view.ui.add(new Expand({
                        content: new Legend({ view: view }),
                        expanded: true,
                        group: "left"
                    }), "bottom-left");
                    sliderExpand = new Expand({
                        expanded: true,
                        content: document.getElementById("sliders-container"),
                        group: "left"
                    });
                    view.ui.add(sliderExpand, "top-left");
                    return [4 /*yield*/, view.when()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, layer.when()];
                case 2:
                    _b.sent();
                    originalRenderer = layer.renderer.clone();
                    return [4 /*yield*/, layer.queryExtent()];
                case 3:
                    extent = (_b.sent()).extent;
                    view.extent = extent;
                    fieldContainer = document.getElementById("field-container");
                    normalizationFieldContainer = document.getElementById("normalization-field-container");
                    return [4 /*yield*/, layerUtils_1.getNumberFields(layer)];
                case 4:
                    numberFields = _b.sent();
                    fieldsSelect = layerUtils_1.createFieldSelect(numberFields);
                    fieldContainer.appendChild(fieldsSelect);
                    normalizationFieldSelect = layerUtils_1.createFieldSelect(numberFields);
                    normalizationFieldContainer.appendChild(normalizationFieldSelect);
                    valueExpressionTextArea = document.getElementById("value-expression");
                    themeSelect = document.getElementById("theme-select");
                    styleSelect = document.getElementById("style-select");
                    fieldsSelect.addEventListener("change", inputChange);
                    normalizationFieldSelect.addEventListener("change", function () {
                        if (fieldsSelect.value) {
                            inputChange();
                        }
                    });
                    valueExpressionTextArea.addEventListener("blur", inputChange);
                    themeSelect.addEventListener("change", inputChange);
                    styleSelect.addEventListener("change", inputChange);
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map