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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/widgets/Expand", "esri/layers/FeatureLayer", "esri/widgets/BasemapGallery"], function (require, exports, WebMap, MapView, Expand, FeatureLayer, BasemapGallery) {
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
        function setId(id) {
            window.history.pushState("", "", window.location.pathname + "?id=" + id);
        }
        var _a, id, portal, layerId, layer, webmap, view, basemapGallery, extent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getUrlParams(), id = _a.id, portal = _a.portal, layerId = _a.layerId;
                    if (!id) {
                        id = "cb1886ff0a9d4156ba4d2fadd7e8a139";
                        setId(id);
                    }
                    layer = new FeatureLayer({
                        portalItem: {
                            id: id,
                            portal: {
                                url: portal ? portal : "https://arcgis.com/"
                            }
                        },
                        layerId: parseInt(layerId)
                    });
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
                        expanded: false
                    }), "top-left");
                    return [4 /*yield*/, view.when()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, layer.when()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, layer.queryExtent()];
                case 3:
                    extent = (_b.sent()).extent;
                    view.extent = extent;
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map