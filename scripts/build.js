const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const PATHS = require("../config/path");
const chalk = require("chalk").default;
const ora = require("ora");
const spawnAsync = require("./tools/spawn");

module.exports = async (cmd) => {
    const spinner = ora(chalk.white("Compiling...")).start();

    try {
        await spawnAsync("npx", ["tsc", "--project", PATHS.currentDirectory]);
        spinner.succeed(chalk.greenBright("Biuld Complete!"));
    } catch (error) {
        spinner.fail(error.message);
    }
};
