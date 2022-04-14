import Component from "./component";
import React, { useEffect } from "react";
import diagramXML from "./diagram"
export interface Property {
    name: string;
    isAttr: boolean;
    type: string;
}

export interface Type {
    name: string;
    extends: string[];
    properties: Property[];
}

export interface Xml {
    tagAlias: string;
}

export interface Moddle {
    name: string;
    uri: string;
    associations: any[];
    types: Type[];
    prefix: string;
    xml: Xml;
}
export interface BpmnModeler {
    importXML: (xml: string) => void
}
export interface Props {
    createTask?: Boolean,
    createDataStore?: Boolean,
    createDataObject?: Boolean,
    moddle?: Moddle,
    onDidMount?: (modeler: BpmnModeler) => void;
}
const BPMNEditor = (props: Props) => {
    let modeler: BpmnModeler;
    useEffect(() => {
        modeler.importXML(diagramXML);

    }, []);
    return <Component {...props} onDidMount={
        (comp: BpmnModeler) => {
            modeler = comp;
        }
    } />
}

export default BPMNEditor;
