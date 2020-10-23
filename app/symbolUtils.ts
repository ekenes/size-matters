import CIMSymbol = require("esri/symbols/CIMSymbol");
import Color = require("esri/Color");
import WebStyleSymbol = require("esri/symbols/WebStyleSymbol");
import promiseUtils = require("esri/core/promiseUtils");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import { SimpleLineSymbol, SimpleMarkerSymbol } from "esri/symbols";

export const donutSymbol = new CIMSymbol({
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

export const ringSymbol = new CIMSymbol({
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

export function updateSymbolStroke(symbol: CIMSymbol, width: number, color: Color){

  const restColor = color.toRgba();
  restColor[3] *= 255;

  symbol.data.symbol.symbolLayers[0].markerGraphics[0].symbol.symbolLayers[0].color = restColor;
  symbol.data.symbol.symbolLayers[0].markerGraphics[0].symbol.symbolLayers[0].width = width;

}

const basicCircle = new SimpleMarkerSymbol({
  style: "circle",
  outline: {
    width: 0.5,
    color: "rgba(255,255,255,0.3)"
  }
});

const styleUrl = "https://www.arcgis.com/sharing/rest/content/items/a19aa7c44b824838a8bb1ba3492f7780/data";

const upCaretCircle = new WebStyleSymbol({
  styleUrl,
  name: "arrow circle up"
});

const downCaretCircle = new WebStyleSymbol({
  styleUrl,
  name: "arrow circle down"
});

const upArrow = new WebStyleSymbol({
  styleUrl,
  name: "up arrrow circle"
});

const downArrow = new WebStyleSymbol({
  styleUrl,
  name: "down arrow circle"
});

const plusCircle = new WebStyleSymbol({
  styleUrl,
  name: "plus circle"
});

const minusCircle = new WebStyleSymbol({
  styleUrl,
  name: "minus circle"
});

const empty = new WebStyleSymbol({
  styleUrl,
  name: "radio unchecked"
});

const filled = new WebStyleSymbol({
  styleUrl,
  name: "radio checked"
});

const dottedUp = new WebStyleSymbol({
  styleUrl,
  name: "dotted arrow up"
});

const dottedDown = new WebStyleSymbol({
  styleUrl,
  name: "dotted arrow down"
});

const upCaret = new WebStyleSymbol({
  styleUrl,
  name: "arrow up no circle"
});

const downCaret = new WebStyleSymbol({
  styleUrl,
  name: "arrow down no circle"
});


const plus = new WebStyleSymbol({
  styleUrl,
  name: "plus"
});

const minus = new WebStyleSymbol({
  styleUrl,
  name: "minus"
});


const high = new WebStyleSymbol({
  styleUrl,
  name: "High"
});

const low = new WebStyleSymbol({
  styleUrl,
  name: "Low"
});

const happy = new WebStyleSymbol({
  styleUrl,
  name: "Happy"
});

const sad = new WebStyleSymbol({
  styleUrl,
  name: "Sad"
});

const triangleUp = new SimpleMarkerSymbol({
  style: "triangle",
  angle: 0,
  outline: {
    width: 0.5,
    color: "rgba(255,255,255,0.3)"
  }
});

const triangleDown = new SimpleMarkerSymbol({
  style: "triangle",
  angle: 180,
  outline: {
    width: 0.5,
    color: "rgba(255,255,255,0.3)"
  }
});

export type SymbolNames = "donuts" | "rings" | "carets" | "arrows" | "plusMinus" | "radio" | "triangles" | "plusMinusCircle" | "highLow" | "happySad";

export const symbolOptions = {
  donuts: {
    name: "donuts",
    above: basicCircle,
    below: donutSymbol
  },
  rings: {
    name: "rings",
    above: basicCircle,
    below: ringSymbol
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
  happySad: {
    name: "happySad",
    above: happy,
    below: sad
  },
  lines: {
    name: "lines",
    above: new SimpleLineSymbol({
      width: 2,
      style: "solid"
    }),
    below: new SimpleLineSymbol({
      width: 2,
      style: "short-dot"
    })
  }
}

interface SymbolOption {
  name: string,
  above: CIMSymbol | WebStyleSymbol | SimpleMarkerSymbol | SimpleLineSymbol,
  below: CIMSymbol | WebStyleSymbol | SimpleMarkerSymbol | SimpleLineSymbol
}

export let selectedSymbols: SymbolOption = symbolOptions.donuts;

export function updateSelectedSymbols (name: SymbolNames | string){
  selectedSymbols = symbolOptions[name];
}

export async function fetchCIMdata(){
  const response = await promiseUtils.eachAlways([
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
    low.fetchCIMSymbol(),
    happy.fetchCIMSymbol(),
    sad.fetchCIMSymbol()
  ]);

  symbolOptions.caretsCircle.above = response[0].value;
  symbolOptions.caretsCircle.below = response[1].value;
  symbolOptions.arrows.above = response[2].value;
  symbolOptions.arrows.below = response[3].value;
  symbolOptions.plusMinusCircle.above = response[4].value;
  symbolOptions.plusMinusCircle.below = response[5].value;
  symbolOptions.radio.above = response[6].value;
  symbolOptions.radio.below = response[7].value;
  symbolOptions.carets.above = response[8].value;
  symbolOptions.carets.below = response[9].value;
  symbolOptions.dottedArrows.above = response[10].value;
  symbolOptions.dottedArrows.below = response[11].value;
  symbolOptions.plusMinus.above = response[12].value;
  symbolOptions.plusMinus.below = response[13].value;
  symbolOptions.highLow.above = response[14].value;
  symbolOptions.highLow.below = response[15].value;
  symbolOptions.happySad.above = response[16].value;
  symbolOptions.happySad.below = response[17].value;
}