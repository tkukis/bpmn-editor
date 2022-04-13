import React from "react";
import "./index.css";
import "bpmn-js/dist/assets/bpmn-js.css"
import BpmnModeler from 'bpmn-js/lib/Modeler';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import Sidebar from "./Sidebar";
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
    const modeler = new BpmnModeler({
      container,
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
    return (
      <>
        <div className="bpmn__editor">
          <div className="container" ref={this.containerRef} style={{ height: "100%" }}><div style={{ width: "100%" }} /></div>
          <Sidebar />
        </div>  
      </>
    );
  }
}

export default ReactEditor;
