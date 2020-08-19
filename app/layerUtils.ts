import esri = __esri;


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