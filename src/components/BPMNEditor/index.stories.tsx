import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import { BPMNEditorProps } from "./interfaces";
import Editor from ".";
import json from "./moddle/moddle"
import xml from "./moddle/sampleBpmn";
export default {
  title: "Components/Editor",
  component: Editor,
  argTypes: {
    moddle: { control: 'object' },
  },
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<BPMNEditorProps> = (args) => <div style={{ height: "100vh" }}><Editor {...args} onDidMount={e => {
  e.importXML(xml);
}}
  onChange={e => {

  }}
/></div>;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { moddle: json };
Primary.parameters = {
  layout: 'fullscreen'
}
export const Secondary = Template.bind({});
Secondary.parameters = {
  layout: 'fullscreen'
}
Secondary.args = {
  moddle: json,
  widgets: {
    textArea: (props) => <div>Custom widget</div>
  }
};
