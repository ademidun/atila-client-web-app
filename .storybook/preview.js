import React from "react";
import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router";
import '../src/index.scss';
import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "react-toastify/dist/ReactToastify.css";

  addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}