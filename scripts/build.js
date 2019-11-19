const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const PATHS = require("../config/path");
const chalk = require("chalk").default;
const ora = require("ora");
const rollup = require("rollup");
const spawnAsync = require("./tools/spawn");
const scss = require("rollup-plugin-scss");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");
const progress = require("rollup-plugin-progress");
const typescript = require("rollup-plugin-typescript");
// const babel = require("rollup-plugin-babel");

async function buildAssets() {
    const inputFile = path.resolve(PATHS.currentDirectory, "src/assets/index.js");
    // 扩展名
    const extensions = [".js", ".jsx", ".ts", ".tsx"];
    if (fs.existsSync(inputFile)) {
        const output = {
            file: "assets/_.js",
            format: "es",
        };

        const overrides = Object.assign({}, output, require(path.resolve(PATHS.currentDirectory, "package.json")).rollup);

        // create a bundle
        const bundle = await rollup.rollup({
            input: inputFile,
            plugins: [
                resolve({
                    extensions,
                }),
                commonjs({
                    include: path.resolve(PATHS.currentDirectory, "node_modules/**"),
                }),
                typescript({
                    tsconfig: path.resolve(PATHS.currentDirectory, "tsconfig.json"),
                }),
                // babel({
                //     extensions,
                //     include: ["src/**/*"]
                // }),
                scss({
                    output: path.resolve(PATHS.currentDirectory, "assets/index.css"),
                    outputStyle: "compressed",
                    sourceMap: true,
                }),
                progress({ clearLine: true }),
            ],
        });

        // write the bundle to disk
        await bundle.write(overrides);
    } else {
        return Promise.resolve();
    }
}

module.exports = async (cmd) => {
    const spinner = ora(chalk.white("Compiling...")).start();

    try {
        await buildAssets();
        await spawnAsync("npx", ["tsc", "--project", PATHS.currentDirectory]);
        spinner.succeed(chalk.greenBright("Biuld Complete!"));
    } catch (error) {
        spinner.fail(error.message);
    }
};
