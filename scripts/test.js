const path = require("path");
const PATHS = require("../config/path");
const jest = require("jest");

module.exports = async (cmd) => {
    const args = process.argv.slice(3);
    let argv = [];
    const jestConfig = {
        rootDir: PATHS.currentDirectory,
        setupFilesAfterEnv: [require.resolve("@testing-library/react/cleanup-after-each")],
        preset: "ts-jest",
        testMatch: ["<rootDir>/tests/**/*.(spec|test).ts?(x)"],
        moduleNameMapper: {
            "\\.(css|scss)$": require.resolve("identity-obj-proxy"),
            "^.+\\.svg$": require.resolve("jest-svg-transformer"),
        },
        transform: {
            "^.+\\.js$": require.resolve("../config/jest/babelTransform"),
            "^.+\\.(ts|tsx)$": require.resolve("ts-jest"),
        },
    };
    const overrides = Object.assign({}, jestConfig, require(path.resolve(PATHS.currentDirectory, "package.json")).jest);

    argv.push("--config", JSON.stringify(overrides));
    argv = argv.concat(args);

    jest.run(argv);
};
