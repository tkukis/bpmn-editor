import { BpmnModeler, Moddle } from ".";
import { WidgetProps } from "./widgets";
export declare function ElementProperties(props: {
    element: any;
    modeler: BpmnModeler;
    extension: Moddle;
    widgets?: {
        [name: string]: (props: WidgetProps) => any;
    };
}): JSX.Element;
