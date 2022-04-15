import React from "react";
import { Form } from "react-bootstrap";
import { WidgetProps } from ".";
const DefaultWidget = (props: WidgetProps) => {
    return <Form.Control {...props} />
}

export default DefaultWidget;   