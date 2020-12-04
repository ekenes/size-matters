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
define(["require", "exports", "esri/layers/FeatureLayer"], function (require, exports, FeatureLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayerVars = /** @class */ (function () {
        function LayerVars() {
        }
        LayerVars.layer = null;
        return LayerVars;
    }());
    exports.LayerVars = LayerVars;
    function getUrlParams() {
        var queryParams = document.location.search.substr(1);
        var result = {};
        queryParams.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }
    exports.getUrlParams = getUrlParams;
    var layer = null;
    // function to set an id as a url param
    function setUrlParams(id, layerId, portal, viewType) {
        window.history.pushState("", "", window.location.pathname + "?id=" + id + "&layerId=" + layerId + "&portal=" + portal + "&viewType=" + viewType);
    }
    function createLayer() {
        var _a = getUrlParams(), id = _a.id, portal = _a.portal, layerId = _a.layerId, url = _a.url, viewType = _a.viewType;
        if (!viewType) {
            viewType = "2d";
        }
        if (!url) {
            if (!id) {
                id = "993b8c64a67a4c6faa44a91846547786";
            }
            if (!layerId) {
                layerId = 2;
            }
            if (!portal) {
                portal = "https://www.arcgis.com/";
            }
            setUrlParams(id, layerId, portal, viewType);
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
        LayerVars.layer = layer;
        return layer;
    }
    exports.createLayer = createLayer;
    function getNumberFields(layer) {
        return __awaiter(this, void 0, void 0, function () {
            var validTypes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, layer.load()];
                    case 1:
                        _a.sent();
                        validTypes = ["small-integer", "integer", "single", "double", "long", "number"];
                        return [2 /*return*/, layer.fields
                                .filter(function (field) { return validTypes.indexOf(field.type) > -1; })];
                }
            });
        });
    }
    exports.getNumberFields = getNumberFields;
    function createFieldSelect(fields) {
        var select = document.createElement("select");
        select.classList.add("esri-select");
        var option = document.createElement("option");
        option.selected = true;
        select.appendChild(option);
        fields.forEach(function (field, i) {
            var option = document.createElement("option");
            option.value = field.name;
            option.label = field.alias;
            option.text = field.alias;
            select.appendChild(option);
        });
        return select;
    }
    exports.createFieldSelect = createFieldSelect;
    function addArcadeFieldInfos(fields) {
        var valueExpressionInput = document.getElementById("value-expression");
        var fieldInfosComment = fields.map(function (field) {
            return "// $feature." + field.name + "\n";
        }).reduce(function (prev, curr) { return prev + curr; });
        valueExpressionInput.value = fieldInfosComment;
    }
    exports.addArcadeFieldInfos = addArcadeFieldInfos;
});
//# sourceMappingURL=layerUtils.js.map