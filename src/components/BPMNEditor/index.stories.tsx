import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import Editor from "./index";
import json from "./moddle/custom"
export default {
  title: "Components/Editor",
  component: Editor,
  argTypes: {
    moddle: { control: 'object' },
  },
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<ButtonProps> = (args) => <div style={{ height: "100vh" }}><Editor {...args} /></div>;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { label: "Primary 😃", size: "large", moddle: json };
Primary.parameters = {
  layout: 'fullscreen'
}
export const Secondary = Template.bind({});
Secondary.parameters = {
  layout: 'fullscreen'
}
Secondary.args = { ...Primary.args, primary: false, label: "Secondary 😇" };
