import React, { useEffect, useRef } from "react";
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { BpmnModeler, Moddle } from ".";
import defaultWidgets, { WidgetProps } from "./widgets";

export function ElementProperties(props: {
    element: any, modeler: BpmnModeler, extension: Moddle, widgets?: {
        [name: string]: (props: WidgetProps) => any
    }
}) {

    let {
        element, modeler, extension
    } = props;

    if (element.labelTarget) {
        element = element.labelTarget;
    }

    function updateName(name: string) {
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

    function makeServiceTask() {
        const bpmnReplace = modeler.get('bpmnReplace');

        bpmnReplace.replaceElement(element, {
            type: 'bpmn:ServiceTask'
        });
    }

    function attachTimeout() {
        const modeling = modeler.get('modeling');
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

    function isTimeoutConfigured(element: any) {
        const attachers = element.attachers || [];

        return attachers.some((e: any) => hasDefinition(e, 'bpmn:TimerEventDefinition'));
    }

    function append(element: any, attrs: any) {

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
                    <Form.Control readOnly value={element.type} placeholder="Type" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={e => updateName(e.target.value)} value={element.businessObject.name || ''} placeholder="Name" />
                </Form.Group>
                {extension.types.map(type => {
                    return is(element, extension.name + ":" + type.name) && type.properties.map(p => {
                        const Element = widgetFactory(p.widget, props.widgets);
                        return <Form.Group key={p.name + p.type}>
                            <Form.Label>{p.name}</Form.Label>
                            <Element
                                value={element.businessObject.get(`${extension.name}:${p.name}`)}
                                onChange={(e) => {
                                    const modeling = modeler.get("modeling");
                                    const ob = {};
                                    //@ts-ignore
                                    ob[`${extension.name}:${p.name}`] = e.target.value;
                                    modeling.updateProperties(element, ob);
                                }} />
                        </Form.Group>;
                    });
                })}
                <Form.Group className="mb-3">
                    <Form.Label>Actions</Form.Label>
                    <div>
                        <ButtonGroup className="btn-group-justified">
                            {is(element, 'bpmn:Task') && !is(element, 'bpmn:ServiceTask') &&
                                <Button variant="primary" onClick={makeServiceTask}>
                                    Make Service Task
                                </Button>}

                            {is(element, 'bpmn:Event') && !hasDefinition(element, 'bpmn:MessageEventDefinition') &&

                                <Button variant="primary" onClick={makeMessageEvent}>
                                    Make Message Event
                                </Button>}

                            {is(element, 'bpmn:Task') && !isTimeoutConfigured(element) &&

                                <Button variant="primary" onClick={attachTimeout}>
                                    Attach Timeout
                                </Button>}
                        </ButtonGroup>
                    </div>
                </Form.Group>
            </Form>
        </div>
    );
}

function widgetFactory(name: string = "defaultWidget", widgets: any = {}): (props: WidgetProps) => any {
    //@ts-ignore
    return ({ ...defaultWidgets, ...widgets })[name] || widgets.defaultWidget
}

function idInput(element: any, modeler: any) {
    const inputEl = useRef(null);
    useEffect(() => {
        if (inputEl && inputEl.current) {
            //@ts-ignore
            inputEl.current.value = element.businessObject.get("id");
        }
    }, [element.businessObject.get("id"), inputEl?.current]);
    return <Form.Control ref={inputEl} onBlur={e => {
        modeler.get('modeling').updateProperties(element, { id: (`${e.target.value}`.replaceAll(" ", "_")) });
    }} />

}

// helpers ///////////////////

function hasDefinition(event: any, definitionType: any) {

    const definitions = event.businessObject.eventDefinitions || [];

    return definitions.some(d => is(d, definitionType));
}