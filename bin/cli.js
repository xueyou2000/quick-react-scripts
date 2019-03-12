#!/usr/bin/env node
const commander = require("commander");
const chalk = require("chalk").default;
const package = require("../package.json");
const PATHS = require("../config/path");
const init = require("../scripts/init");
const build = require("../scripts/build");
const test = require("../scripts/test");

const program = new commander.Command(package.name).version(package.version).usage(`${chalk.cyan("快速生成项目工具")}`);

// init
program
    .command("init <project-directory>")
    .description(chalk.cyan("初始化项目"))
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .option("--registry", "使用镜像")
    .action(init);

// build
program.command("build").action(build);

// test
program.command("test").action(test);

// run
program.parse(process.argv);
