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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/core/watchUtils", "esri/widgets/Expand", "esri/widgets/BasemapGallery", "esri/portal/PortalItem", "esri/widgets/Legend", "./layerUtils", "./rendererUtils", "./symbolUtils"], function (require, exports, WebMap, MapView, watchUtils, Expand, BasemapGallery, PortalItem, Legend, layerUtils_1, rendererUtils_1, symbolUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
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
                theme: theme
            };
            rendererUtils_1.updateRenderer(params, style);
        }
        function clearEverything() {
            layer.renderer = originalRenderer;
            fieldsSelect.value = null;
            normalizationFieldSelect.value = null;
            valueExpressionTextArea.value = null;
        }
        function statusMessage(head, info) {
            document.getElementById("head").innerHTML = head;
            document.getElementById("info").innerHTML = info;
            overlay.style.visibility = "visible";
        }
        var layer, webmap, view, basemapGallery, sliderExpand, layerView, saveBtn, originalRenderer, fieldContainer, normalizationFieldContainer, numberFields, fieldsSelect, normalizationFieldSelect, arcadeFieldsContainer, arcadeFieldsSelect, valueExpressionTextArea, themeSelect, styleSelect, symbolsContainer, symbolsSelect, isBinaryElement, overlay, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    layer = layerUtils_1.createLayer();
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
                    view.ui.add(new Expand({
                        view: view,
                        expanded: true,
                        content: document.getElementById("ui-controls")
                    }), "top-right");
                    basemapGallery = new BasemapGallery({ view: view });
                    view.ui.add(new Expand({
                        content: basemapGallery,
                        expanded: false,
                        group: "top-left",
                        view: view
                    }), "top-left");
                    view.ui.add(new Expand({
                        content: new Legend({ view: view }),
                        expanded: false,
                        group: "top-left",
                        view: view
                    }), "bottom-left");
                    sliderExpand = new Expand({
                        expanded: true,
                        content: document.getElementById("sliders-container"),
                        group: "top-left",
                        view: view
                    });
                    view.ui.add(sliderExpand, "top-left");
                    view.ui.add("save-map", "top-left");
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, layer.when()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, symbolUtils_1.fetchCIMdata()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 4:
                    layerView = _a.sent();
                    watchUtils.whenFalseOnce(layerView, "updating", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var extent;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, layerView.queryExtent()];
                                case 1:
                                    extent = (_a.sent()).extent;
                                    view.goTo(extent);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    saveBtn = document.getElementById("save-map");
                    originalRenderer = layer.renderer.clone();
                    fieldContainer = document.getElementById("field-container");
                    normalizationFieldContainer = document.getElementById("normalization-field-container");
                    return [4 /*yield*/, layerUtils_1.getNumberFields(layer)];
                case 5:
                    numberFields = _a.sent();
                    fieldsSelect = layerUtils_1.createFieldSelect(numberFields);
                    fieldContainer.appendChild(fieldsSelect);
                    normalizationFieldSelect = layerUtils_1.createFieldSelect(numberFields);
                    normalizationFieldContainer.appendChild(normalizationFieldSelect);
                    arcadeFieldsContainer = document.getElementById("arcade-fields-container");
                    arcadeFieldsSelect = layerUtils_1.createFieldSelect(numberFields);
                    arcadeFieldsContainer.appendChild(arcadeFieldsSelect);
                    valueExpressionTextArea = document.getElementById("value-expression");
                    arcadeFieldsSelect.options[0].text = "Add Field to expression";
                    arcadeFieldsSelect.addEventListener("change", function () {
                        valueExpressionTextArea.value += "$feature[\"" + arcadeFieldsSelect.value + "\"]";
                    });
                    themeSelect = document.getElementById("theme-select");
                    styleSelect = document.getElementById("style-select");
                    symbolsContainer = document.getElementById("symbols-container");
                    symbolsSelect = document.getElementById("symbols-select");
                    isBinaryElement = document.getElementById("binary-switch");
                    symbolsSelect.addEventListener("change", inputChange);
                    isBinaryElement.addEventListener("change", inputChange);
                    fieldsSelect.addEventListener("change", inputChange);
                    normalizationFieldSelect.addEventListener("change", function () {
                        if (fieldsSelect.value) {
                            inputChange();
                        }
                    });
                    valueExpressionTextArea.addEventListener("blur", inputChange);
                    themeSelect.addEventListener("change", inputChange);
                    themeSelect.addEventListener("change", function () {
                        symbolsContainer.style.display = themeSelect.value === "above-and-below" ? "block" : "none";
                    });
                    styleSelect.addEventListener("change", inputChange);
                    saveBtn.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var item, itemPageUrl, link, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, webmap.updateFrom(view)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, webmap.saveAs(new PortalItem({
                                            title: "[" + styleSelect.value + " - " + themeSelect.value + "] " + layer.title,
                                            tags: ["test", "size"],
                                            description: "Webmap testing various size styles and themes.",
                                            portal: layer.portalItem.portal
                                        }), {
                                            ignoreUnsupported: false
                                        })];
                                case 3:
                                    item = _a.sent();
                                    itemPageUrl = item.portal.url + "/home/item.html?id=" + item.id;
                                    link = "<a target=\"_blank\" href=\"" + itemPageUrl + "\">" + item.title + "</a>";
                                    statusMessage("Save WebMap", "<br> Successfully saved as <i>" + link + "</i>");
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _a.sent();
                                    statusMessage("Save WebMap", "<br> Error " + error_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    overlay = document.getElementById("overlayDiv");
                    ok = overlay.getElementsByTagName("input")[0];
                    ok.addEventListener("click", function () {
                        overlay.style.visibility = "hidden";
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map