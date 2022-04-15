import DefaultWidget from "./defaultWidget";
import textArea from "./textArea";

export interface WidgetProps {
    onChange: (e: { target: { value: any } }) => any,
    value: any
}
const widgets = {
    textArea,
    defaultWidget: DefaultWidget
}

export default widgets;