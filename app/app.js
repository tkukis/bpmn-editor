import Modeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

import PropertiesPanel from './properties-panel';

import customModdleExtension from './moddle/custom.json';

import diagramXML from './diagram.bpmn';

const $modelerContainer = document.querySelector('#modeler-container');
const $propertiesContainer = document.querySelector('#properties-container');

var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
  var entries = _getPaletteEntries.apply(this);
  console.log(entries);
  delete entries['create.task'];
  delete entries['create.data-store'];
  delete entries[`create.data-object`];
  return entries;
}

const modeler = new Modeler({
  container: $modelerContainer,
  additionalModules: [

  ],
  moddleExtensions: {
    custom: customModdleExtension
  },
  keyboard: {
    bindTo: document.body
  }
});

const propertiesPanel = new PropertiesPanel({
  container: $propertiesContainer,
  modeler
});

modeler.importXML(diagramXML);