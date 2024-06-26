const { exec, spawn } = require("node:child_process");
const { App } = require("../models");
const path = require("node:path");

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

function sh(command, workdir = path.join(global.APPS_DATA_PATH), vars = {}) {
    // console.log(command, "\n\n");
    return new Promise(async (resolve, reject) => {
        let ps;
        try {
            if (process.env.USE_SUDO === "true") ps = spawn(`sudo`, ["bash"], { cwd: workdir });
            else ps = spawn(`bash`, [], { cwd: workdir });
        } catch (error) {
            console.error("Can not spawn bash process. Check workdir env: " + workdir);
            console.error(error);
            return;
        }

        let stdout = [];
        let stderr = [];

        // wait for the process to spawn
        await new Promise((resolve) => ps.once(`spawn`, resolve));

        // retrun output
        ps.stdout.on(`data`, (data) => stdout.push(data.toString().trim()));
        ps.on("error", (err) => reject(`Failed to start subprocess.\n Command: ${command}\n`, err));

        // log any stderr
        ps.stderr.on(`data`, (data) => {
            stderr.push(data.toString().trim());
        });
        //mkdir -p ${workdir};
        await new Promise((resolve) => ps.stdin.write(objectToBashVars(vars) + command + " \n", `utf8`, () => resolve()));
        ps.stdin.end();

        // wait for stdout and stderr stream to end, and process to close
        let p = Promise.all([new Promise((resolve) => ps.stdout.on("end", resolve)), new Promise((resolve) => ps.stderr.on("end", resolve)), new Promise((resolve) => ps.once(`close`, resolve))]);

        setTimeout(() => {
            ps.kill();
            stderr.unshift("Timeout");
        }, 15000);
        await p;

        if (stderr[0]) reject(`Command: ${command}\nSTDERR:\n ${stderr.join("\n")} \nSTDOUT:\n ${stdout.join("\n")}`);
        else resolve(stdout.join("\n"));
    });
}

// sh("inputEmail='martin.air@seznam.cz';instanceName='xxxxx';image_id='eced04caab4a';echo docker run: $image_id").then(t => console.log(`"${t}"`));
function parseJS(string) {
    string = string.replaceAll(/\r?\n/g, ",");
    string = string.replaceAll(",]", "]");
    return JSON.parse(string);
}
/**
 * @param {*} instance
 * @returns stdout */
async function init(instance) {
    let app = await App.findById(instance.app_id);
    return runScript(instance, app.init_code);
}
/**
 * @param {Object} instance
 * @returns last line of stdout */
async function run(instance) {
    let app = await App.findById(instance.app_id);
    return (await runScript(instance, app.run_code)).split("\n").pop();
}
/**
 * @param {Object} instance
 * @param {String} script to run
 * @returns last line from stdout
 */
async function runScript(instance, script) {
    let vars = {
        ...instance.form_data,
        ...{
            image_id: instance.image_id,
            name: instance.name,
            port: instance.port,
            mount_dir: path.join(global.APPS_DATA_PATH, instance.mount_folder),
        },
    };
    let mount = path.join(global.APPS_DATA_PATH, instance.mount_folder);
    let /** @type {String} */ shout = await sh(script, mount, vars);
    console.log(shout);
    return shout;
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
async function setLimits(containerId, { cpu, ram, swap, disk }) {
    let c = "";
    if (cpu > -1) c += ` --cpu-shares="${cpu}"`;
    if (ram > -1) c += ` --memory-reservation ${ram}M`; //soft limit = pokud není málo paměti, mohou i více
    if (swap > -1) c += ` --memory-swap ${swap + (ram > -1 ? ram : 0)}M --memory ${swap + (ram > -1 ? ram : 0)}M`;
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
        v = "" + v;
        v = v.replaceAll("'", "'\\''");
        return "'" + v + "'";
    }
}

module.exports = { getImages, runScript, ps, sh, run, init, setLimits, stop, rm, start };
