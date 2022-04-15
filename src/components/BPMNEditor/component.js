import React from "react";
import "./index.css";
import "bpmn-js/dist/assets/bpmn-js.css"
import BpmnModeler from 'bpmn-js/lib/Modeler';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import Sidebar from "./Sidebar";
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ElementProperties } from "./ElementProperties";
const $propertiesContainer = document.querySelector('#properties-container');

var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;


PaletteProvider.prototype.getPaletteEntries = function (element) {
  var entries = _getPaletteEntries.apply(this);

  delete entries['create.task'];
  delete entries['create.data-store'];
  delete entries[`create.data-object`];
  return entries;
}
class ReactEditor extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      selectedElements: [],
      element: null
    };
  }

  componentDidMount() {
    const container = this.containerRef.current;
    const onDidMount = this.props.onDidMount;
    const moddleExtensions = this.props.moddleExtensions || {};
    const modeler = new BpmnModeler({
      container,
      moddleExtensions: {
        custom: this.props.moddle,
        moddleExtensions
      },
      keyboard: {
        bindTo: document.body
      }
    });
    if (onDidMount) {
      onDidMount(modeler)
    };
    this.modeler = modeler;
    modeler.on('selection.changed', (e) => {

      const {
        element
      } = this.state;

      this.setState({
        selectedElements: e.newSelection,
        element: e.newSelection[0]
      });
    });


    modeler.on('element.changed', (e) => {

      const {
        element
      } = e;

      const {
        element: currentElement
      } = this.state;

      if (!currentElement) {
        return;
      }

      // update panel, if currently selected element changed
      if (element.id === currentElement.id) {
        this.setState({
          element
        });
      }

    });
  }

  componentWillUnmount() {
    this.modeler.destroy();
  }

  render() {
    const selectedElements = this.state.selectedElements;
    const modeler = this.modeler;
    const element = this.state.element;
    const extension = this.props.moddle;
    return (
        <div className="bpmn__editor">
          <div className="container" ref={this.containerRef} style={{ height: "100%" }}><div style={{ width: "100%" }} /></div>
          <Sidebar >
            <div>
              {
                selectedElements.length === 1
                && <ElementProperties extension={extension} widgets={this.props.widgets} modeler={modeler} element={element} />
              }

              {
                selectedElements.length === 0
                && <span>Please select an element.</span>
              }

              {
                selectedElements.length > 1
                && <span>Please select a single element.</span>
              }
            </div>
          </Sidebar>
      </div>
    );
  }
}



export default ReactEditor;
