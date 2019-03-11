#!/usr/bin/env node
const commander = require("commander");
const chalk = require("chalk").default;
const init = require("../scripts/init");
const package = require("../package.json");

const program = new commander.Command(package.name).version(package.version).usage(`${chalk.cyan("快速生成项目工具")}`);

// init
program
    .command("init <project-directory>")
    .description(chalk.cyan("初始化项目"))
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .option("-r, --registry", "使用镜像", "http://192.168.1.22:8081/repository/npm-group/")
    .action(init);

// build
program.command("build").action((cmd) => {
    console.log(`TODO: 编译`);
});

// test
program.command("test").action((cmd) => {
    console.log(`TODO: 测试`);
});

// start
program.command("start").action((cmd) => {
    console.log(`TODO: 开发`);
});

// run
program.parse(process.argv);
