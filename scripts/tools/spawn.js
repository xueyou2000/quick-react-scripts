const spawn = require("cross-spawn");

function spawnAsync(command, args, options) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, options);
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
