const { exec, spawn } = require("node:child_process");
const { App } = require("../models");

/**
 * @typedef {Object} DockerContainerInfo
 * @property {string} Command - The command that the container runs.
 * @property {string} CreatedAt - The creation time of the container.
 * @property {string} ID - The ID of the container.
 * @property {string} Image - The image used to create the container.
 * @property {string} Labels - The labels assigned to the container.
 * @property {string} LocalVolumes - The number of local volumes for the container.
 * @property {string} Mounts - The mount points for the container.
 * @property {string} Names - The names of the container.
 * @property {string} Networks - The networks the container is connected to.
 * @property {string} Ports - The exposed ports of the container.
 * @property {string} RunningFor - The duration the container has been running.
 * @property {string} Size - The size of the container.
 * @property {string} State - The state of the container.
 * @property {string} Status - The status of the container.
 */
/**
 * returns docker ps -as
 * @returns {Promise<[DockerContainerInfo]>}
 * @param {String|undefined} containerId
 */
async function ps(containerId) {
    let command = "docker ps -as " + (containerId ? "--filter ID=" + containerId : "") + " --format json";
    let string = await sh(command);
    if (!string) {
        let e = {};
        e["Fatal Error: Container with id:" + containerId + " was not found on the host machine"] = "";
        return [e]; //, 'please contact our server admin': ''};
    }
    string = `[${string}]`;
    return parseJS(string);
}
/**
 * @returns {Promise<Array>}
 */
async function getImages() {
    let string = await sh("docker images --format json");
    if (!string) return [];
    string = `[${string}]`;
    return parseJS(string);
}

function sh(command) {
    return new Promise(async (resolve, reject) => {
        const process = spawn(`bash`, []);

        let stdout = [];
        let stderr = [];

        // wait for the process to spawn
        await new Promise((resolve) => process.once(`spawn`, resolve));

        // retrun output
        process.stdout.on(`data`, (data) => stdout.push(data.toString().trim()));

        // log any stderr
        process.stderr.on(`data`, (data) => {
            stderr.push(data.toString().trim());
        });

        await new Promise((resolve) => process.stdin.write(command + " \n", `utf8`, () => resolve()));
        // await new Promise((resolve) => process.stdin.write(`echo $aaa $bbb \n`, `utf8`, () => resolve()));

        // wait for stdout and stderr stream to end, and process to close
        let p = Promise.all([new Promise((resolve) => process.stdout.on("end", resolve)), new Promise((resolve) => process.stderr.on("end", resolve)), new Promise((resolve) => process.once(`close`, resolve))]);

        setTimeout(() => {
            process.kill();
            reject("Timeout");
        }, 8000);
        await p;
        if(stderr[0]) reject(stderr.join(""));
        else resolve(stdout.join(""))
    });
}

// sh("inputEmail='martin.air@seznam.cz';instanceName='xxxxx';image_id='eced04caab4a';echo docker run: $image_id").then(t => console.log(`"${t}"`));
function parseJS(string) {
    string = string.replaceAll(/\r?\n/g, ",");
    string = string.replaceAll(",]", "]");
    return JSON.parse(string);
}
async function run(instance) {
    let app = await App.findById(instance.app_id);
    let command = objectToBashVars(instance.form_data) + objectToBashVars({ image_id: app.selected_image_id }) + app.run_code;
    console.log(command);

    let /** @type {String} */ shout = await sh(command);
    console.log("shout", shout, "\n\n");
    return shout.split("\n").pop();
}
function init(instance) {
    console.log("init...todo");
}
/**
 * @returns {String} string containing command that will inject vars to shell
 * @param {Object} o
 */
function objectToBashVars(o) {
    let strings = [];
    for (const key in o) {
        if (Object.hasOwnProperty.call(o, key)) {
            const val = o[key];
            strings.push(`${key}=${escape(val)};`); // export ${key};
        }
    }
    return strings.join(" ");

    function escape(v) {
        v = v.replaceAll("'", "'\\''");
        return "'" + v + "'";
    }
}

module.exports = { getImages, ps, run, init };
