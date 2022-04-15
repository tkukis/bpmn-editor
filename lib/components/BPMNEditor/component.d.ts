export default ReactEditor;
declare class ReactEditor extends React.Component<any, any, any> {
    constructor(props: any);
    containerRef: React.RefObject<any>;
    state: {
        selectedElements: never[];
        element: null;
    };
    componentDidMount(): void;
    modeler: any;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
import React from "react";
