const fs = require("fs");
const path = require("path");
const currentDirectory = fs.realpathSync(process.cwd());
const templateDirectory = path.resolve(__dirname, "../template");
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const resolveOwn = (relativePath) => path.resolve(__dirname, "..", relativePath);
const resolveTemplate = (relativePath) => path.resolve(templateDirectory, relativePath);

module.exports = {
    currentDirectory,
    templateDirectory
};
