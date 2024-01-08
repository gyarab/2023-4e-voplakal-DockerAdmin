const { exec } = require("node:child_process");

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
 * @returns {Promise<DockerContainerInfo>}
 */
async function ps() {
    let string = await sh("docker ps -a --format json");
    if (!string) return [];
    string = `[${string}]`;
    string = string.replaceAll(/\r?\n/g, ",");
    string = string.replaceAll(",]", "]");
    return JSON.parse(string);
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
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(error);
            }
            // console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}
function parseJS(string) {
    string = string.replaceAll(/\r?\n/g, ",");
    string = string.replaceAll(",]", "]");
    return JSON.parse(string);
}

// getRepos().then((v) => console.log(v));

module.exports = { getImages };
