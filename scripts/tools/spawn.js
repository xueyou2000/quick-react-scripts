const spawn = require("cross-spawn");

function spawnAsync(command, args, options) {
    return new Promise((resolve, reject) => {
        const opt = options;
        if (opt && opt.env) {
            opt.env = Object.assign(process.env, opt.env);
        }

        const child = spawn(command, args, opt);
        child.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`command: ${command} ${args.toString()}`));
            } else {
                resolve();
            }
        });
        child.on("error", (err) => {
            reject(err);
        });
    });
}

module.exports = spawnAsync;
