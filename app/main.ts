import esri = __esri;
import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");

import Expand = require("esri/widgets/Expand");
import FeatureLayer = require("esri/layers/FeatureLayer");
import BasemapGallery = require("esri/widgets/BasemapGallery");
import SizeSlider = require("esri/widgets/smartMapping/SizeSlider");
import Legend = require("esri/widgets/Legend");

import { getNumberFields, createFieldSelect } from './layerUtils';
import { updateRenderer ,SizeParams } from './rendererUtils';

( async () => {

  // function to retrieve query parameters (in this case only id)
  interface UrlParams {
    id?: string,
    portal?: string,
    layerId?: string | number,
    url?: string
  }

  function getUrlParams() {
    const queryParams = document.location.search.substr(1);
    let result: UrlParams = {};

    queryParams.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });

    return result;
  }

  let { id, portal, layerId, url } = getUrlParams();
  let layer: FeatureLayer = null;

  // function to set an id as a url param
  function setUrlParams() {
    window.history.pushState("", "", `${window.location.pathname}?id=${id}&layerId=${layerId}&portal=${portal}`);
  }

  if(!url){
    if(!id){
      id = "cb1886ff0a9d4156ba4d2fadd7e8a139";
    }

    if(!layerId){
      layerId = 0;
    }

    if(!portal){
      portal = "https://www.arcgis.com/";
    }

    setUrlParams();

    layer = new FeatureLayer({
      portalItem: {
        id,
        portal: {
          url: portal
        }
      },
      layerId: layerId as number
    });
  } else {
    portal = null;
    id = null;
    layerId = null;

    layer = new FeatureLayer({
      url
    });
  }

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
    expanded: true,
    group: "left"
  }), "bottom-left");
  view.ui.add(new Expand({
    expanded: true,
    content: document.getElementById("size-slider-container"),
    group: "left"
  }), "top-left");

  await view.when();
  await layer.when();

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
  normalizationFieldSelect.addEventListener("change", inputChange);
  valueExpressionTextArea.addEventListener("blur", inputChange);
  themeSelect.addEventListener("change", inputChange);
  styleSelect.addEventListener("change", inputChange);

  function inputChange (){
    const field = fieldsSelect.value;
    const normalizationField = normalizationFieldSelect.value;
    const valueExpression = valueExpressionTextArea.innerText;
    const theme = themeSelect.value as SizeParams["theme"];
    const style = styleSelect.value;
    const params = {
      layer,
      view,
      field,
      normalizationField,
      valueExpression,
      theme
    };

    updateRenderer(params);
  }

})();