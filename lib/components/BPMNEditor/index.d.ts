import React from "react";
import "./index.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BPMNEditorProps } from "./interfaces";
declare class ReactEditor extends React.Component<BPMNEditorProps, {
    selectedElements: Array<any>;
    element: any;
}> {
    containerRef: React.RefObject<HTMLDivElement>;
    modeler: any;
    constructor(props: Readonly<BPMNEditorProps>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default ReactEditor;
