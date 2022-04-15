export interface WidgetProps {
    onChange: (e: {
        target: {
            value: any;
        };
    }) => any;
    value: any;
}
declare const widgets: {
    textArea: (props: WidgetProps) => JSX.Element;
    defaultWidget: (props: WidgetProps) => JSX.Element;
};
export default widgets;
