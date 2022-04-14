import React from "react";
import "./index.css";
import "bpmn-js/dist/assets/bpmn-js.css"
import BpmnModeler from 'bpmn-js/lib/Modeler';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import Sidebar from "./Sidebar";
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Button, ButtonGroup, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
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
      moddleExtensions: {
        custom: this.props.moddle
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
      <>
        <div className="bpmn__editor">
          <div className="container" ref={this.containerRef} style={{ height: "100%" }}><div style={{ width: "100%" }} /></div>
          <Sidebar >
            <div>
              {
                selectedElements.length === 1
                && <ElementProperties extension={extension} modeler={modeler} element={element} />
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
      </>
    );
  }
}

function ElementProperties(props) {

  let {
    element,
    modeler,
    extension
  } = props;

  if (element.labelTarget) {
    element = element.labelTarget;
  }

  function updateName(name) {
    const modeling = modeler.get('modeling');

    modeling.updateLabel(element, name);
  }

  function makeMessageEvent() {

    const bpmnReplace = modeler.get('bpmnReplace');

    bpmnReplace.replaceElement(element, {
      type: element.businessObject.$type,
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    });
  }

  function makeServiceTask(name) {
    const bpmnReplace = modeler.get('bpmnReplace');

    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask'
    });
  }

  function attachTimeout() {
    const modeling = modeler.get('modeling');
    const autoPlace = modeler.get('autoPlace');
    const selection = modeler.get('selection');

    const attrs = {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    };

    const position = {
      x: element.x + element.width,
      y: element.y + element.height
    };

    const boundaryEvent = modeling.createShape(attrs, position, element, { attach: true });

    const taskShape = append(boundaryEvent, {
      type: 'bpmn:Task'
    });

    selection.select(taskShape);
  }

  function isTimeoutConfigured(element) {
    const attachers = element.attachers || [];

    return attachers.some(e => hasDefinition(e, 'bpmn:TimerEventDefinition'));
  }

  function append(element, attrs) {

    const autoPlace = modeler.get('autoPlace');
    const elementFactory = modeler.get('elementFactory');

    var shape = elementFactory.createShape(attrs);

    return autoPlace.append(element, shape);
  };
  return (
    <div className="element-properties" key={element.id}>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Id</Form.Label>

          {idInput(element, modeler)}
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control value={element.type} placeholder="Type" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control value={element.businessObject.name || ''} placeholder="Name" />
        </Form.Group>
        {extension.types.map(type => {
          return is(element, extension.name + ":" + type.name) && type.properties.map(p => {
            return <Form.Group>
              <Form.Label>{p.name}</Form.Label>
              <Form.Control
                value={element.businessObject.get(`${extension.name}:${p.name}`)}
                onChange={(e) => {
                  const modeling = modeler.get("modeling");
                  const ob = {};
                  ob[`${extension.name}:${p.name}`] = e.target.value;
                  modeling.updateProperties(element, ob);
                }}
              />
            </Form.Group>
          })
        })}
        <Form.Group className="mb-3">
          <Form.Label>Actions</Form.Label>
          <div>
            <ButtonGroup className="btn-group-justified">
              {
                is(element, 'bpmn:Task') && !is(element, 'bpmn:ServiceTask') &&
                <Button variant="primary" onClick={makeServiceTask}>
                  Make Service Task
                </Button>
              }

              {
                is(element, 'bpmn:Event') && !hasDefinition(element, 'bpmn:MessageEventDefinition') &&

                <Button variant="primary" onClick={makeMessageEvent}>
                  Make Message Event
                </Button>
              }

              {
                is(element, 'bpmn:Task') && !isTimeoutConfigured(element) &&

                <Button variant="primary" onClick={attachTimeout}>
                  Attach Timeout
                </Button>
              }
            </ButtonGroup>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}


function idInput(element, modeler) {
  return <Form.Control style={{ width: "100%" }} placeholder="Enter id" value={element.businessObject.get("id")} onClick={() => {
    const id = prompt("Id", element.businessObject.get("id"));
    const modeling = modeler.get('modeling');
    modeling.updateProperties(element, { id });
  }} />;
}

// helpers ///////////////////

function hasDefinition(event, definitionType) {

  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some(d => is(d, definitionType));
}

export default ReactEditor;
