import esri = __esri;
import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");

import Expand = require("esri/widgets/Expand");
import FeatureLayer = require("esri/layers/FeatureLayer");
import BasemapGallery = require("esri/widgets/BasemapGallery");
import PortalItem = require("esri/portal/PortalItem");
import Legend = require("esri/widgets/Legend");

import { getNumberFields, createFieldSelect, createLayer, LayerVars } from './layerUtils';
import { updateRenderer ,SizeParams, getSizeRendererColor } from './rendererUtils';
import { colorPicker } from "./sliderUtils";
import { ClassBreaksRenderer } from "esri/rasterRenderers";

( async () => {

  const layer = createLayer();

  const webmap = new WebMap({
    basemap: {
      portalItem: {
        id: "3582b744bba84668b52a16b0b6942544"
      }
    },
    layers: [ layer ]
  });

  const view = new MapView({
    map: webmap,
    container: "viewDiv"
  });

  view.ui.add("ui-controls", "top-right");

  const basemapGallery = new BasemapGallery({ view });
  view.ui.add( new Expand({
    content: basemapGallery,
    expanded: false,
    group: "left"
  }), "top-left");
  view.ui.add( new Expand({
    content: new Legend({ view }),
    expanded: false,
    group: "left"
  }), "bottom-left");
  const sliderExpand = new Expand({
    expanded: true,
    content: document.getElementById("sliders-container"),
    group: "left"
  });
  view.ui.add(sliderExpand, "top-left");
  view.ui.add("save-map", "top-left");

  await view.when();
  await layer.when();

  const saveBtn = document.getElementById("save-map");

  const originalRenderer = (layer.renderer as esri.RendererWithVisualVariables).clone();

  const { extent } = await layer.queryExtent();
  view.extent = extent;

  const fieldContainer = document.getElementById("field-container");
  const normalizationFieldContainer = document.getElementById("normalization-field-container");

  const numberFields = await getNumberFields(layer);
  const fieldsSelect = createFieldSelect(numberFields);
  fieldContainer.appendChild(fieldsSelect);

  const normalizationFieldSelect = createFieldSelect(numberFields);
  normalizationFieldContainer.appendChild(normalizationFieldSelect);

  const valueExpressionTextArea = document.getElementById("value-expression") as HTMLTextAreaElement;
  const themeSelect = document.getElementById("theme-select") as HTMLSelectElement;
  const styleSelect = document.getElementById("style-select") as HTMLSelectElement;

  fieldsSelect.addEventListener("change", inputChange);
  normalizationFieldSelect.addEventListener("change", () => {
    if(fieldsSelect.value){
      inputChange();
    }
  });
  valueExpressionTextArea.addEventListener("blur", inputChange);
  themeSelect.addEventListener("change", inputChange);
  styleSelect.addEventListener("change", inputChange);

  function inputChange (){
    const field = fieldsSelect.value;
    const normalizationField = normalizationFieldSelect.value;
    const valueExpression = valueExpressionTextArea.value;

    if(!field && !valueExpression && !normalizationField){
      clearEverything();
      return;
    }

    const theme = themeSelect.value as SizeParams["theme"];
    const style = styleSelect.value as SizeParams["style"];
    const params = {
      layer,
      view,
      field,
      normalizationField,
      valueExpression,
      theme,
      style
    };

    updateRenderer(params);
  }

  function clearEverything(){
    layer.renderer = originalRenderer;
    fieldsSelect.value = null;
    normalizationFieldSelect.value = null;
    valueExpressionTextArea.value = null;
    themeSelect.value = "high-to-low";
    styleSelect.value = "size";
  }

  saveBtn.addEventListener("click", async () => {
    await webmap.saveAs(new PortalItem({
      title: `${styleSelect.innerText} - ${themeSelect.innerText} - ${layer.title}`,
      tags: [ "test", "size" ],
      description: `Webmap testing various size styles and themes.`
    }), {
      ignoreUnsupported: true
    });
  });

})();