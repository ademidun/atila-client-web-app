import React from "react";
import ReactDOM from "react-dom";
import Register from "./Register";
import { validateEmailAndPasswordPresence } from "../extra/validations";

describe("<Register />", () => {
  const wrapper = shallow(<Register />);

  it("should have input for email and password", () => {
    //Email and password input field should be present
    expect(wrapper.find("input#firstName")).toHaveLength(1);
    expect(wrapper.find("input#lasttName")).toHaveLength(1);
    expect(wrapper.find("input#email")).toHaveLength(1);
    expect(wrapper.find("input#password")).toHaveLength(1);
    expect(wrapper.find("input#username")).toHaveLength(1);
    expect(wrapper.find("input#agreeTermsConditions")).toHaveLength(1);
  });

  it("should test email and password presence", () => {
    //should return true
    expect(
      validateEmailAndPasswordPresence("email@email.com", "password").toEqual(
        true
      )
    );

    //should return false
    expect(validateEmailAndPasswordPresence("", "").toEqual(false));
  });

  it("strips usernames with spaces", () => {
    const component = Enzyme.mount(<Register onSubmit={onSubmitMock} />);

    component
      .find("input.username")
      .simulate("change", { target: { value: "myUser" } });
    component
      .find("input.password")
      .simulate("change", { target: { value: "my Password" } });
    component.find("form").simulate("submit");

    expect(wrapper.userProfile.state("password")).toEqual("myPassword");
  });
});
