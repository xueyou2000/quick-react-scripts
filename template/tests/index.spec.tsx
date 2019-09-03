import React from "react";
import { render } from "@testing-library/react";
import Component from "../src";

describe("component", () => {
    test("render", () => {
        const wrapper = render(<Component />);
        const div = wrapper.getByText("Hello");
        expect(div.textContent).toBe("Hello");
    });
});
