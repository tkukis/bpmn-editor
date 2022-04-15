import React from "react";
import { WidgetProps } from "./widgets";
export interface Property {
    name: string;
    isAttr: boolean;
    type: string;
    widget?: string;
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
    importXML: (xml: string) => void;
    [name: string]: any;
}
export interface BPMNEditorProps {
    widgets?: {
        [name: string]: (props: WidgetProps) => React.ReactNode;
    };
    createTask?: Boolean;
    createDataStore?: Boolean;
    createDataObject?: Boolean;
    moddle?: Moddle;
    moddleExtensions: {
        [name: string]: Moddle;
    };
    onDidMount?: (modeler: BpmnModeler) => void;
}
declare const BPMNEditor: (props: BPMNEditorProps) => JSX.Element;
export default BPMNEditor;
