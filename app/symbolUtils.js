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
define(["require", "exports", "esri/symbols/CIMSymbol", "esri/symbols/WebStyleSymbol", "esri/core/promiseUtils", "esri/symbols"], function (require, exports, CIMSymbol, WebStyleSymbol, promiseUtils, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.donutSymbol = new CIMSymbol({
        "data": {
            "type": "CIMSymbolReference",
            "symbol": {
                "type": "CIMPointSymbol",
                "symbolLayers": [
                    {
                        "type": "CIMVectorMarker",
                        "enable": true,
                        "colorLocked": false,
                        "anchorPoint": {
                            "x": 0,
                            "y": 0,
                            "z": 0
                        },
                        "anchorPointUnits": "Relative",
                        "dominantSizeAxis3D": "Y",
                        "size": 20,
                        "billboardMode3D": "FaceNearPlane",
                        "frame": {
                            "xmin": 0,
                            "ymin": 0,
                            "xmax": 17,
                            "ymax": 17
                        },
                        "markerGraphics": [
                            {
                                "type": "CIMMarkerGraphic",
                                "geometry": {
                                    "rings": [
                                        [
                                            [
                                                12.75,
                                                8.5
                                            ],
                                            [
                                                12.67,
                                                7.65
                                            ],
                                            [
                                                12.42,
                                                6.85
                                            ],
                                            [
                                                12.04,
                                                6.13
                                            ],
                                            [
                                                11.51,
                                                5.49
                                            ],
                                            [
                                                10.88,
                                                4.97
                                            ],
                                            [
                                                10.15,
                                                4.58
                                            ],
                                            [
                                                9.35,
                                                4.33
                                            ],
                                            [
                                                8.5,
                                                4.25
                                            ],
                                            [
                                                7.65,
                                                4.33
                                            ],
                                            [
                                                6.85,
                                                4.58
                                            ],
                                            [
                                                6.12,
                                                4.97
                                            ],
                                            [
                                                5.49,
                                                5.49
                                            ],
                                            [
                                                4.97,
                                                6.12
                                            ],
                                            [
                                                4.58,
                                                6.85
                                            ],
                                            [
                                                4.33,
                                                7.65
                                            ],
                                            [
                                                4.25,
                                                8.5
                                            ],
                                            [
                                                4.33,
                                                9.35
                                            ],
                                            [
                                                4.58,
                                                10.15
                                            ],
                                            [
                                                4.97,
                                                10.88
                                            ],
                                            [
                                                5.49,
                                                11.51
                                            ],
                                            [
                                                6.12,
                                                12.03
                                            ],
                                            [
                                                6.85,
                                                12.42
                                            ],
                                            [
                                                7.65,
                                                12.67
                                            ],
                                            [
                                                8.5,
                                                12.75
                                            ],
                                            [
                                                9.35,
                                                12.67
                                            ],
                                            [
                                                10.15,
                                                12.42
                                            ],
                                            [
                                                10.88,
                                                12.03
                                            ],
                                            [
                                                11.51,
                                                11.51
                                            ],
                                            [
                                                12.04,
                                                10.87
                                            ],
                                            [
                                                12.42,
                                                10.15
                                            ],
                                            [
                                                12.67,
                                                9.35
                                            ],
                                            [
                                                12.75,
                                                8.5
                                            ]
                                        ],
                                        [
                                            [
                                                17,
                                                8.5
                                            ],
                                            [
                                                16.83,
                                                6.79
                                            ],
                                            [
                                                16.33,
                                                5.2
                                            ],
                                            [
                                                15.55,
                                                3.75
                                            ],
                                            [
                                                14.51,
                                                2.49
                                            ],
                                            [
                                                13.25,
                                                1.45
                                            ],
                                            [
                                                11.8,
                                                0.67
                                            ],
                                            [
                                                10.21,
                                                0.17
                                            ],
                                            [
                                                8.5,
                                                0
                                            ],
                                            [
                                                6.79,
                                                0.17
                                            ],
                                            [
                                                5.2,
                                                0.67
                                            ],
                                            [
                                                3.75,
                                                1.45
                                            ],
                                            [
                                                2.49,
                                                2.49
                                            ],
                                            [
                                                1.45,
                                                3.75
                                            ],
                                            [
                                                0.67,
                                                5.2
                                            ],
                                            [
                                                0.17,
                                                6.79
                                            ],
                                            [
                                                0,
                                                8.5
                                            ],
                                            [
                                                0.17,
                                                10.21
                                            ],
                                            [
                                                0.67,
                                                11.8
                                            ],
                                            [
                                                1.45,
                                                13.25
                                            ],
                                            [
                                                2.49,
                                                14.51
                                            ],
                                            [
                                                3.75,
                                                15.55
                                            ],
                                            [
                                                5.2,
                                                16.33
                                            ],
                                            [
                                                6.79,
                                                16.83
                                            ],
                                            [
                                                8.5,
                                                17
                                            ],
                                            [
                                                10.21,
                                                16.83
                                            ],
                                            [
                                                11.8,
                                                16.33
                                            ],
                                            [
                                                13.25,
                                                15.55
                                            ],
                                            [
                                                14.51,
                                                14.51
                                            ],
                                            [
                                                15.55,
                                                13.25
                                            ],
                                            [
                                                16.33,
                                                11.8
                                            ],
                                            [
                                                16.83,
                                                10.21
                                            ],
                                            [
                                                17,
                                                8.5
                                            ]
                                        ]
                                    ]
                                },
                                "symbol": {
                                    "type": "CIMPolygonSymbol",
                                    "symbolLayers": [
                                        {
                                            "type": "CIMSolidStroke",
                                            "enable": true,
                                            "capStyle": "Round",
                                            "joinStyle": "Round",
                                            "lineStyle3D": "Strip",
                                            "miterLimit": 10,
                                            "width": 0,
                                            "color": [
                                                0,
                                                0,
                                                0,
                                                255
                                            ]
                                        },
                                        {
                                            "type": "CIMSolidFill",
                                            "enable": true,
                                            "color": [
                                                255,
                                                0,
                                                0,
                                                255
                                            ]
                                        }
                                    ]
                                }
                            }
                        ],
                        "scaleSymbolsProportionally": true,
                        "respectFrame": true
                    }
                ],
                "haloSize": 1,
                "scaleX": 1,
                "angleAlignment": "Display",
                "version": "2.0.0",
                "build": "8933"
            }
        }
    });
    exports.ringSymbol = new CIMSymbol({
        "data": {
            "type": "CIMSymbolReference",
            "symbol": {
                "type": "CIMPointSymbol",
                "symbolLayers": [
                    {
                        "type": "CIMVectorMarker",
                        "enable": true,
                        "colorLocked": false,
                        "anchorPoint": {
                            "x": 0,
                            "y": 0,
                            "z": 0
                        },
                        "anchorPointUnits": "Relative",
                        "dominantSizeAxis3D": "Y",
                        "size": 20,
                        "billboardMode3D": "FaceNearPlane",
                        "frame": {
                            "xmin": 0,
                            "ymin": 0,
                            "xmax": 17,
                            "ymax": 17
                        },
                        "markerGraphics": [
                            {
                                "type": "CIMMarkerGraphic",
                                "geometry": {
                                    "paths": [
                                        [
                                            [
                                                12.75,
                                                8.5
                                            ],
                                            [
                                                12.67,
                                                7.65
                                            ],
                                            [
                                                12.42,
                                                6.85
                                            ],
                                            [
                                                12.04,
                                                6.13
                                            ],
                                            [
                                                11.51,
                                                5.49
                                            ],
                                            [
                                                10.88,
                                                4.97
                                            ],
                                            [
                                                10.15,
                                                4.58
                                            ],
                                            [
                                                9.35,
                                                4.33
                                            ],
                                            [
                                                8.5,
                                                4.25
                                            ],
                                            [
                                                7.65,
                                                4.33
                                            ],
                                            [
                                                6.85,
                                                4.58
                                            ],
                                            [
                                                6.12,
                                                4.97
                                            ],
                                            [
                                                5.49,
                                                5.49
                                            ],
                                            [
                                                4.97,
                                                6.12
                                            ],
                                            [
                                                4.58,
                                                6.85
                                            ],
                                            [
                                                4.33,
                                                7.65
                                            ],
                                            [
                                                4.25,
                                                8.5
                                            ],
                                            [
                                                4.33,
                                                9.35
                                            ],
                                            [
                                                4.58,
                                                10.15
                                            ],
                                            [
                                                4.97,
                                                10.88
                                            ],
                                            [
                                                5.49,
                                                11.51
                                            ],
                                            [
                                                6.12,
                                                12.03
                                            ],
                                            [
                                                6.85,
                                                12.42
                                            ],
                                            [
                                                7.65,
                                                12.67
                                            ],
                                            [
                                                8.5,
                                                12.75
                                            ],
                                            [
                                                9.35,
                                                12.67
                                            ],
                                            [
                                                10.15,
                                                12.42
                                            ],
                                            [
                                                10.88,
                                                12.03
                                            ],
                                            [
                                                11.51,
                                                11.51
                                            ],
                                            [
                                                12.04,
                                                10.87
                                            ],
                                            [
                                                12.42,
                                                10.15
                                            ],
                                            [
                                                12.67,
                                                9.35
                                            ],
                                            [
                                                12.75,
                                                8.5
                                            ]
                                        ]
                                    ]
                                },
                                "symbol": {
                                    "type": "CIMLineSymbol",
                                    "symbolLayers": [
                                        {
                                            "type": "CIMSolidStroke",
                                            "enable": true,
                                            "capStyle": "Round",
                                            "joinStyle": "Round",
                                            "lineStyle3D": "Strip",
                                            "miterLimit": 10,
                                            "width": 2,
                                            "color": [
                                                0,
                                                0,
                                                0,
                                                255
                                            ]
                                        }
                                    ]
                                }
                            }
                        ],
                        "scaleSymbolsProportionally": true,
                        "respectFrame": true
                    }
                ],
                "haloSize": 1,
                "scaleX": 1,
                "angleAlignment": "Display",
                "version": "2.0.0",
                "build": "8933"
            }
        }
    });
    function updateSymbolStroke(symbol, width, color) {
        var restColor = color.toRgba();
        restColor[3] *= 255;
        symbol.data.symbol.symbolLayers[0].markerGraphics[0].symbol.symbolLayers[0].color = restColor;
        symbol.data.symbol.symbolLayers[0].markerGraphics[0].symbol.symbolLayers[0].width = width;
    }
    exports.updateSymbolStroke = updateSymbolStroke;
    var basicCircle = new symbols_1.SimpleMarkerSymbol({
        style: "circle",
        outline: {
            width: 0.5,
            color: "rgba(255,255,255,0.3)"
        }
    });
    var styleUrl = "https://www.arcgis.com/sharing/rest/content/items/a19aa7c44b824838a8bb1ba3492f7780/data";
    var upCaretCircle = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "arrow circle up"
    });
    var downCaretCircle = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "arrow circle down"
    });
    var upArrow = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "up arrrow circle"
    });
    var downArrow = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "down arrow circle"
    });
    var plusCircle = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "plus circle"
    });
    var minusCircle = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "minus circle"
    });
    var empty = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "radio unchecked"
    });
    var filled = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "radio checked"
    });
    var dottedUp = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "dotted arrow up"
    });
    var dottedDown = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "dotted arrow down"
    });
    var upCaret = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "arrow up no circle"
    });
    var downCaret = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "arrow down no circle"
    });
    var plus = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "plus "
    });
    var minus = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "minus"
    });
    var high = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "High"
    });
    var low = new WebStyleSymbol({
        styleUrl: styleUrl,
        name: "Low"
    });
    var triangleUp = new symbols_1.SimpleMarkerSymbol({
        style: "triangle",
        angle: 0,
        outline: {
            width: 0.5,
            color: "rgba(255,255,255,0.3)"
        }
    });
    var triangleDown = new symbols_1.SimpleMarkerSymbol({
        style: "triangle",
        angle: 180,
        outline: {
            width: 0.5,
            color: "rgba(255,255,255,0.3)"
        }
    });
    exports.symbolOptions = {
        donuts: {
            name: "donuts",
            above: basicCircle,
            below: exports.donutSymbol
        },
        rings: {
            name: "rings",
            above: basicCircle,
            below: exports.ringSymbol
        },
        caretsCircle: {
            name: "caretsCircle",
            above: upCaretCircle,
            below: downCaretCircle
        },
        carets: {
            name: "carets",
            above: upCaret,
            below: downCaret
        },
        arrows: {
            name: "arrows",
            above: upArrow,
            below: downArrow
        },
        dottedArrows: {
            name: "dottedArrows",
            above: dottedUp,
            below: dottedDown
        },
        plusMinusCircle: {
            name: "plusMinusCircle",
            above: plusCircle,
            below: minusCircle
        },
        plusMinus: {
            name: "plusMinus",
            above: plus,
            below: minus
        },
        radio: {
            name: "radio",
            above: filled,
            below: empty
        },
        triangles: {
            name: "triangles",
            above: triangleUp,
            below: triangleDown
        },
        highLow: {
            name: "highLow",
            above: high,
            below: low
        },
        lines: {
            name: "lines",
            above: new symbols_1.SimpleLineSymbol({
                width: 2,
                style: "solid"
            }),
            below: new symbols_1.SimpleLineSymbol({
                width: 2,
                style: "short-dot"
            })
        }
    };
    exports.selectedSymbols = exports.symbolOptions.donuts;
    function updateSelectedSymbols(name) {
        exports.selectedSymbols = exports.symbolOptions[name];
    }
    exports.updateSelectedSymbols = updateSelectedSymbols;
    function fetchCIMdata() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promiseUtils.eachAlways([
                            upCaretCircle.fetchCIMSymbol(),
                            downCaretCircle.fetchCIMSymbol(),
                            upArrow.fetchCIMSymbol(),
                            downArrow.fetchCIMSymbol(),
                            plusCircle.fetchCIMSymbol(),
                            minusCircle.fetchCIMSymbol(),
                            filled.fetchCIMSymbol(),
                            empty.fetchCIMSymbol(),
                            upCaret.fetchCIMSymbol(),
                            downCaret.fetchCIMSymbol(),
                            dottedUp.fetchCIMSymbol(),
                            dottedDown.fetchCIMSymbol(),
                            plus.fetchCIMSymbol(),
                            minus.fetchCIMSymbol(),
                            high.fetchCIMSymbol(),
                            low.fetchCIMSymbol()
                        ])];
                    case 1:
                        response = _a.sent();
                        exports.symbolOptions.caretsCircle.above = response[0].value;
                        exports.symbolOptions.caretsCircle.below = response[1].value;
                        exports.symbolOptions.arrows.above = response[2].value;
                        exports.symbolOptions.arrows.below = response[3].value;
                        exports.symbolOptions.plusMinusCircle.above = response[4].value;
                        exports.symbolOptions.plusMinusCircle.below = response[5].value;
                        exports.symbolOptions.radio.above = response[6].value;
                        exports.symbolOptions.radio.below = response[7].value;
                        exports.symbolOptions.carets.above = response[8].value;
                        exports.symbolOptions.carets.below = response[9].value;
                        exports.symbolOptions.dottedArrows.above = response[10].value;
                        exports.symbolOptions.dottedArrows.below = response[11].value;
                        exports.symbolOptions.plusMinus.above = response[12].value;
                        exports.symbolOptions.plusMinus.below = response[13].value;
                        exports.symbolOptions.highLow.above = response[14].value;
                        exports.symbolOptions.highLow.below = response[15].value;
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.fetchCIMdata = fetchCIMdata;
});
//# sourceMappingURL=symbolUtils.js.map