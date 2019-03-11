const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const PATHS = require("../config/path");
const chalk = require("chalk").default;
const ora = require("ora");
const spawnAsync = require("./tools/spawn");
const jest = require("jest");
const babelJest = require("babel-jest");

module.exports = async (cmd) => {
    let argv = process.argv.slice(2);

    const babelTransform = babelJest.createTransformer({
        presets: [require.resolve("@babel/preset-env")],
        plugins: [require.resolve("babel-plugin-transform-es2015-modules-commonjs")],
        babelrc: false,
        configFile: false
    });
    const jestConfig = {
        rootDir: PATHS.currentDirectory,
        setupFilesAfterEnv: [require.resolve("react-testing-library/cleanup-after-each")],
        preset: "ts-jest",
        transform: {
            "^.+\\.js$": require.resolve("../config/jest/babelTransform"),
            "^.+\\.(ts|tsx)$": require.resolve("ts-jest")
        }
    };
    const overrides = Object.assign({}, jestConfig, require(path.resolve(PATHS.currentDirectory, "package.json")).jest);

    argv.push("--config", JSON.stringify(overrides));

    jest.run(argv);
};
