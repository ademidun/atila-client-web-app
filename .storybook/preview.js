import React from "react";
import { addDecorator } from "@storybook/react";
import { configure } from 'enzyme';
import { MemoryRouter } from "react-router";
import Adapter from 'enzyme-adapter-react-16';
import { initialReduxState, initialReduxStateLoggedIn } from "../src/models/Constants";
import configureStore from "redux-mock-store";
import "core-js/stable";
import '../src/index.scss';
import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.css";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "react-toastify/dist/ReactToastify.css";

import {Provider} from "react-redux";

configure({ adapter: new Adapter() });
const mockStore = configureStore();
const store = mockStore(initialReduxState);
// const loggedInStore = mockStore(initialReduxStateLoggedIn);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

addDecorator(story => <Provider store={store}>
  {story()}
</Provider>);
addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);