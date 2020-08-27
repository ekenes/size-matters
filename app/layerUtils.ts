import esri = __esri;
import FeatureLayer = require("esri/layers/FeatureLayer");

export class LayerVars {
  public static layer: FeatureLayer = null;
}

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

let layer: FeatureLayer = null;

// function to set an id as a url param
function setUrlParams(id: UrlParams["id"], layerId: UrlParams["layerId"], portal: UrlParams["portal"]) {
  window.history.pushState("", "", `${window.location.pathname}?id=${id}&layerId=${layerId}&portal=${portal}`);
}

export function createLayer(){

  let { id, portal, layerId, url } = getUrlParams();

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

    setUrlParams(id, layerId, portal);

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

  layer.opacity = 1;
  layer.minScale = 0;
  layer.maxScale = 0;

  LayerVars.layer = layer;
  return layer;
}

export async function getNumberFields(layer: esri.FeatureLayer) {
  await layer.load();

  const validTypes = [ "small-integer", "integer", "single", "double", "long", "number" ];

  return layer.fields
    .filter( field => validTypes.indexOf(field.type) > -1 );
}

export function createFieldSelect(fields: esri.Field[]){
  const select = document.createElement("select");
  select.classList.add("esri-select");

  const option = document.createElement("option");
  option.selected = true;
  select.appendChild(option);

  fields.forEach((field, i) => {
    const option = document.createElement("option");
    option.value = field.name;
    option.label = field.alias;
    option.text = field.alias;

    select.appendChild(option);
  });

  return select;
}

export function addArcadeFieldInfos(fields: esri.Field[]){
  const valueExpressionInput = document.getElementById("value-expression") as HTMLTextAreaElement;

  const fieldInfosComment = fields.map( field => {
    return `// $feature.${field.name}\n`;
  }).reduce( (prev, curr ) =>  prev + curr );

  valueExpressionInput.value = fieldInfosComment;
}