import React from "react";
import { Form } from "react-bootstrap";
import { WidgetProps } from ".";
const TextArea = (props: WidgetProps) => {
    return <Form.Control as="textarea" rows={3} {...props} />
}
export default TextArea;  