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
    let command = "docker ps --no-trunc -as " + (containerId ? "--filter ID=" + containerId : "") + " --format json";
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
    let string = await sh("docker images --no-trunc	--format json");
    if (!string) return [];
    string = `[${string}]`;
    images = parseJS(string);
    for (const i of images) {
        i.ID = i.ID.replaceAll("sha256:", "");
    }
    return images;
}

function sh(command) {
    console.log(command);
    return new Promise(async (resolve, reject) => {
        const process = spawn(`bash`, []);

        let stdout = [];
        let stderr = [];

        // wait for the process to spawn
        await new Promise((resolve) => process.once(`spawn`, resolve));

        // retrun output
        process.stdout.on(`data`, (data) => stdout.push(data.toString().trim()));
        process.on("error", (err) => reject("Failed to start subprocess.\n", err));

        // log any stderr
        process.stderr.on(`data`, (data) => {
            stderr.push(data.toString().trim());
        });

        await new Promise((resolve) => process.stdin.write(command + " \n", `utf8`, () => resolve()));
        process.stdin.end();

        // wait for stdout and stderr stream to end, and process to close
        let p = Promise.all([new Promise((resolve) => process.stdout.on("end", resolve)), new Promise((resolve) => process.stderr.on("end", resolve)), new Promise((resolve) => process.once(`close`, resolve))]);

        setTimeout(() => {
            process.kill();
            stderr.unshift("Timeout");
        }, 11000);
        await p;

        if (stderr[0]) reject("STDERR:\n" + stderr.join("\n") + "\nSTDOUT:\n" + stdout.join("\n"));
        else resolve(stdout.join("\n"));
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
    // console.log("selected image:", app.selected_image_id);
    let command = objectToBashVars(instance.form_data) + objectToBashVars({ image_id: app.selected_image_id }) + app.run_code;
    // console.log(command);

    let /** @type {String} */ shout = await sh(command);
    console.log("shout", shout, "\n\n");
    return shout.split("\n").pop();
}
async function stop(...containerIds) {
    await sh("docker stop " + containerIds.join(" "));
}
async function start(...containerIds) {
    await sh("docker start " + containerIds.join(" "));
}
async function rm(...containerIds) {
    await sh("docker rm -f " + containerIds.join(" "));
}
function init(instance) {
    console.log("init...todo");
}
async function setLimits(containerId, { cpu, ram, swap, disk }) {
    let c = "";
    if (cpu > -1) c += ` --cpu-shares="${cpu}"`;
    if (ram > -1) c += ` --memory-reservation ${ram}M`; //soft limit = pokud není málo paměti, mohou i více
    // if (swap > -1) c += ` --memory-swap ${swap + (ram == -1 ? 0 : ram)}M`;
    if (disk > -1) c += ` --blkio-weight ${disk}`;

    if (c.length === 0) return;
    await sh(`docker update ${c} ${containerId}`);
}
/**
 * @returns {String} string containing command that will inject vars to shell
 * @param {Object} o
 */
function objectToBashVars(o) {
    let strings = [];
    for (const key in o) {
        if (Object.hasOwnProperty.call(o, key)) {
            const val = o[key] ?? "";
            strings.push(`${key}=${escape(val)};`); // export ${key};
        }
    }
    return strings.join(" ");

    function escape(v) {
        v = v.replaceAll("'", "'\\''");
        return "'" + v + "'";
    }
}

module.exports = { getImages, ps, run, init, setLimits, stop, rm, start };
