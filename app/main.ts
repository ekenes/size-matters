import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");

import Expand = require("esri/widgets/Expand");
import FeatureLayer = require("esri/layers/FeatureLayer");
import BasemapGallery = require("esri/widgets/BasemapGallery");

( async () => {

  const map = new EsriMap({
    basemap: "streets"
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [ -118.244, 34.052],
    zoom: 12
  });

  view.ui.add("ui-controls", "top-right");

})();