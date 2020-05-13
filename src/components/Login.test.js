import React from "react";
import Login from "./Login";
import { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { initialReduxState } from "../models/Constants";
import { MemoryRouter } from "react-router-dom";

const Enzyme = require("enzyme");
Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();
const store = mockStore(initialReduxState);

describe("<Login />", () => {
  const wrapper = mount(
    <MemoryRouter>
      <Login store={store} />
    </MemoryRouter>
  );

  it("renders <Login /> without crashing", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Login store={store} />
      </MemoryRouter>
    );
    expect(wrapper.html()).toBeTruthy();
  });

  it("should have input for email and password", () => {
    //Email and password input field should be present
    expect(wrapper.find("input#email")).toHaveLength(1);
    expect(wrapper.find("input#password")).toHaveLength(1);
  });

  it("strips usernames with spaces", () => {
    wrapper
      .find("input.username")
      .simulate("change", { target: { value: "my User" } });
    wrapper
      .find("input.password")
      .simulate("change", { target: { value: "myPassword" } });
    wrapper.find("form").simulate("submit");

    expect(wrapper.userProfile.state("username")).toEqual("myUser");
  });
});
