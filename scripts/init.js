const fs = require("fs-extra");
const validateProjectName = require("validate-npm-package-name");
const chalk = require("chalk").default;
const path = require("path");
const spawn = require("cross-spawn");
const PATHS = require("../config/path");
const ora = require("ora");
const envinfo = require("envinfo");
const spawnAsync = require("./tools/spawn");

function converHump(str) {
    const _ = str.replace(/\-[a-z]/g, (a, b) => {
        return b == 0 ? a.replace("-", "") : a.replace("-", "").toUpperCase();
    });
    return _[0].toUpperCase() + _.slice(1);
}

class AppPath {
    /**
     * 构造函数
     * @param {*} name app名称
     */
    constructor(name) {
        this.appName = name;
        this.checkAppName();
    }

    /**
     * app目录路径
     * @returns {string}
     */
    get directory() {
        return path.resolve(PATHS.currentDirectory, this.appName);
    }

    /**
     * 验证app名称是否可用
     */
    checkAppName() {
        if (!this.appName) {
            console.error(`缺少参数: project-directory`);
            process.exit(1);
        }

        const validationResult = validateProjectName(this.appName);
        if (!validationResult.validForNewPackages) {
            console.error(`Could not create a project called ${chalk.red(`"${this.appName}"`)} because of npm naming restrictions:`);
            this.printValidationResults(validationResult.errors);
            this.printValidationResults(validationResult.warnings);
            process.exit(1);
        }
    }

    /**
     * 打印错误
     * @param {*} results
     */
    printValidationResults(results) {
        if (typeof results !== "undefined") {
            results.forEach((error) => {
                console.error(chalk.red(`  *  ${error}`));
            });
        }
    }

    /**
     * 获取app文件路径
     * @param {*} filePath
     */
    file(filePath) {
        return path.resolve(this.directory, filePath);
    }
}

class AppInitialize {
    /**
     * 构造函数
     * @param {*} appName
     * @param {*} cmd
     */
    constructor(appName, cmd) {
        this.appName = appName;
        this.cmd = cmd;
        this.appPath = new AppPath(appName);
        this.createFiles();
    }

    createFiles() {
        const { appPath } = this;

        fs.ensureDirSync(appPath.directory);

        // 1. copy template to app dir
        fs.copySync(PATHS.templateDirectory, appPath.directory);

        // 2. update package.json
        this.updatePackageFile();

        // 3. update README.md
        this.updateReadmeFile();

        // 4. update CHANGELOG.md
        this.updateChangeLog();

        this.install();
    }

    updatePackageFile() {
        const { appPath, appName } = this;
        const packagePath = appPath.file("temp_package.json");
        const packageJson = fs.readJSONSync(packagePath);
        packageJson.name = appName;
        packageJson.keywords.push(appName);
        packageJson.repository = {
            type: "git",
            url: `git+https://github.com/xueyou2000/${appName}.git`
        };
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4));
        fs.renameSync(packagePath, appPath.file("package.json"));

        const tsConfig = appPath.file("tsconfig.json");
        const tsConfigJson = fs.readJSONSync(tsConfig);
        tsConfigJson.paths = {
            [appName]: ["src/index.tsx"],
            [`${appName}/*`]: ["src/*"]
        };
    }

    updateReadmeFile() {
        const { appPath } = this;
        const readmePath = appPath.file("README.md");
        let readmeContent = fs.readFileSync(readmePath, { encoding: "utf-8" });
        readmeContent = readmeContent.replace(/{placeholder}/g, this.appName).replace(/{ComponentName}/g, converHump(this.appName));
        fs.writeFileSync(readmePath, readmeContent);
    }

    updateChangeLog() {
        const { appPath } = this;
        const date = new Date();
        const changelogPath = appPath.file("CHANGELOG.md");
        let changelogContent = fs.readFileSync(changelogPath, { encoding: "utf-8" });
        changelogContent = changelogContent.replace("{DATE}", date.toDateString());
        fs.writeFileSync(changelogPath, changelogContent);
    }

    async install() {
        const { appPath, cmd } = this;
        // const spinner = ora(chalk.white("Installing packages. This might take a couple of minutes.")).start();
        console.log(chalk.white("Installing packages. This might take a couple of minutes."));
        let command,
            args = ["install"];

        if (cmd.registry) {
            args.push("--registr");
            args.push(cmd.registry);
        }

        try {
            await envinfo.helpers.getYarnInfo();
            command = "yarn";
        } catch (error) {
            command = "npm";
        }

        try {
            // ignore, inherit
            await spawnAsync(command, args, { stdio: "inherit", cwd: appPath.directory });
            // spinner.succeed("Install Succeed");
            console.log(chalk.green("√ Install Succeed"));
            this.tryGitInit();
        } catch (error) {
            // spinner.fail(error.message);
            console.error(error.message);
            process.exit(1);
        }
    }

    async tryGitInit() {
        const { appPath } = this;
        try {
            await spawnAsync("git", ["init"], { stdio: "ignore", cwd: appPath.directory });
            await spawnAsync("git", ["add", "*"], { stdio: "ignore", cwd: appPath.directory });
            await spawnAsync("git", ["commit", "-m", "Initial commit"], { stdio: "ignore", cwd: appPath.directory });
            console.log(chalk.green(`√ Initialized a git repository.`));
        } catch (error) {
            // Ignore
        }
    }
}

module.exports = (project_directory, cmd) => {
    new AppInitialize(project_directory, cmd);
};
