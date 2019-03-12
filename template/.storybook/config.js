import React from "react";
import { addParameters, configure, storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import readme from "../README.md";
import Markdown from "./component/MyMarkdown";
import "./index.css";

function createExamplesStories() {
    const exampleStories = storiesOf("Examples", module);
    exampleStories.addDecorator(withInfo);
    exampleStories.addParameters({ info: { inline: true, source: true } });

    const req = require.context("../examples", true, /.tsx$/);
    req.keys().forEach((filename) => {
        const renderExample = req(filename).default;
        const name = filename.replace(".tsx", "").replace("./", "");
        exampleStories.add(name, renderExample);
    });
}

function loadStories() {
    storiesOf("ReadMe", module).add("ReadMe", () => <Markdown source={readme} />);
    createExamplesStories();
}

addParameters({
    options: {
        showPanel: false
    }
});
configure(loadStories, module);
