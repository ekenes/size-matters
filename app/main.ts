import esri = __esri;
import WebScene = require("esri/WebScene");
import WebMap = require("esri/WebMap");
import SceneView = require("esri/views/SceneView");
import MapView = require("esri/views/MapView");
import watchUtils = require("esri/core/watchUtils");

import Expand = require("esri/widgets/Expand");
import BasemapGallery = require("esri/widgets/BasemapGallery");
import PortalItem = require("esri/portal/PortalItem");
import Legend = require("esri/widgets/Legend");

import { getNumberFields, createFieldSelect, createLayer, getUrlParams } from './layerUtils';
import { updateRenderer, SizeParams, Style } from './rendererUtils';
import { fetchCIMdata } from "./symbolUtils";

( async () => {

  const layer = createLayer();

  const { viewType } = getUrlParams();
  const mapParams = {
    basemap: {
      portalItem: {
        id: "3582b744bba84668b52a16b0b6942544"
      }
    },
    layers: [ layer ]
  };


  const webmap = viewType === "3d" ? new WebScene(mapParams) : new WebMap(mapParams);

  const viewParams = {
    map: webmap,
    container: "viewDiv"
  };

  const view = viewType === "3d" ? new SceneView(viewParams) : new MapView(viewParams);

  view.ui.add(new Expand({
    view,
    expanded: true,
    content: document.getElementById("ui-controls")
  }), "top-right");

  const basemapGallery = new BasemapGallery({ view });
  view.ui.add( new Expand({
    content: basemapGallery,
    expanded: false,
    group: "top-left",
    view
  }), "top-left");
  view.ui.add( new Expand({
    content: new Legend({ view }),
    expanded: false,
    group: "top-left",
    view
  }), "bottom-left");
  const sliderExpand = new Expand({
    expanded: true,
    content: document.getElementById("sliders-container"),
    group: "top-left",
    view
  });
  view.ui.add(sliderExpand, "top-left");
  view.ui.add("save-map", "top-left");

  await view.when();
  await layer.when();
  await fetchCIMdata();

  const layerView = await view.whenLayerView(layer) as esri.FeatureLayerView;
  watchUtils.whenFalseOnce(layerView, "updating", async () => {
    const { extent } = await layerView.queryExtent();
    view.goTo(extent);
  });

  const saveBtn = document.getElementById("save-map");

  const originalRenderer = (layer.renderer as esri.RendererWithVisualVariables).clone();

  const fieldContainer = document.getElementById("field-container");
  const normalizationFieldContainer = document.getElementById("normalization-field-container");

  const numberFields = await getNumberFields(layer);
  const fieldsSelect = createFieldSelect(numberFields);
  fieldContainer.appendChild(fieldsSelect);

  const normalizationFieldSelect = createFieldSelect(numberFields);
  normalizationFieldContainer.appendChild(normalizationFieldSelect);

  const arcadeFieldsContainer = document.getElementById("arcade-fields-container") as HTMLDivElement;
  const arcadeFieldsSelect = createFieldSelect(numberFields);
  arcadeFieldsContainer.appendChild(arcadeFieldsSelect);

  const valueExpressionTextArea = document.getElementById("value-expression") as HTMLTextAreaElement;

  arcadeFieldsSelect.options[0].text = "Add Field to expression";
  arcadeFieldsSelect.addEventListener("change", () => {
    valueExpressionTextArea.value += `$feature["${arcadeFieldsSelect.value}"]`;
  });

  const themeSelect = document.getElementById("theme-select") as HTMLSelectElement;
  const styleSelect = document.getElementById("style-select") as HTMLSelectElement;
  const symbolTypeSelect = document.getElementById("symbol-type-select") as HTMLSelectElement;
  const symbolTypeContainer = document.getElementById("symbol-type-container") as HTMLDivElement;
  const symbolsContainer = document.getElementById("symbols-container") as HTMLSelectElement;
  const symbolsSelect = document.getElementById("symbols-select") as HTMLSelectElement;
  const isBinaryElement = document.getElementById("binary-switch") as HTMLInputElement;

  symbolsSelect.addEventListener("change", inputChange);
  isBinaryElement.addEventListener("change", inputChange);
  symbolTypeSelect.addEventListener("change", inputChange);

  symbolTypeContainer.style.display = viewType === "2d" ? "none" : "block";

  fieldsSelect.addEventListener("change", inputChange);
  normalizationFieldSelect.addEventListener("change", () => {
    if(fieldsSelect.value){
      inputChange();
    }
  });
  valueExpressionTextArea.addEventListener("blur", inputChange);
  themeSelect.addEventListener("change", inputChange);
  themeSelect.addEventListener("change", () => {
    symbolsContainer.style.display = themeSelect.value === "above-and-below" ? "block" : "none";
  });
  styleSelect.addEventListener("change", inputChange);

  function inputChange (){
    const field = fieldsSelect.value;
    const normalizationField = normalizationFieldSelect.value;
    const valueExpression = valueExpressionTextArea.value;
    const symbolType = viewType === "3d" ? symbolTypeSelect.value : null;

    if(!field && !valueExpression && !normalizationField){
      clearEverything();
      return;
    }

    const theme = themeSelect.value as SizeParams["theme"];
    const style = styleSelect.value as Style;

    const params = {
      layer,
      view,
      field,
      normalizationField,
      valueExpression,
      theme,
      symbolType
    };

    updateRenderer(params as any, style);
  }

  function clearEverything(){
    layer.renderer = originalRenderer;
    fieldsSelect.value = null;
    normalizationFieldSelect.value = null;
    valueExpressionTextArea.value = null;
  }

  saveBtn.addEventListener("click", async () => {

    await (webmap as any).updateFrom(view);

    try{
      const item = await webmap.saveAs(new PortalItem({
        title: `[${styleSelect.value} - ${themeSelect.value}] ${layer.title}`,
        tags: [ "test", "size" ],
        description: `Webmap testing various size styles and themes.`,
        portal: layer.portalItem.portal
      }), {
        ignoreUnsupported: false
      });

      const itemPageUrl = `${item.portal.url}/home/item.html?id=${item.id}`;
      const link = `<a target="_blank" href="${itemPageUrl}">${item.title}</a>`;

      statusMessage(
        "Save WebMap",
        "<br> Successfully saved as <i>" + link + "</i>"
      );

    } catch (error){
      statusMessage("Save WebMap", "<br> Error " + error);
    }

  });

  const overlay = document.getElementById("overlayDiv");
  const ok = overlay.getElementsByTagName("input")[0];

  function statusMessage(head: string, info:string) {
    document.getElementById("head").innerHTML = head;
    document.getElementById("info").innerHTML = info;
    overlay.style.visibility = "visible";
  }

  ok.addEventListener("click", function () {
    overlay.style.visibility = "hidden";
  });

})();