import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");

import Expand = require("esri/widgets/Expand");
import FeatureLayer = require("esri/layers/FeatureLayer");
import BasemapGallery = require("esri/widgets/BasemapGallery");
import { Extent } from "esri/geometry";

( async () => {

  // function to retrieve query parameters (in this case only id)
  interface UrlParams {
    id?: string,
    portal?: string,
    layerId?: string
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

  // function to set an id as a url param
  function setId(id:string) {
    window.history.pushState("", "", `${window.location.pathname}?id=${id}`);
  }

  let { id, portal, layerId } = getUrlParams();

  if(!id){
    id = "cb1886ff0a9d4156ba4d2fadd7e8a139";
    setId(id);
  }

  const layer = new FeatureLayer({
    portalItem: {
      id,
      portal: {
        url: portal ? portal : "https://arcgis.com/"
      }
    },
    layerId: parseInt(layerId)
  });

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
    expanded: false
  }), "top-left");

  await view.when();
  await layer.when();

  const { extent } = await layer.queryExtent();
  view.extent = extent;

})();