const mongoose = require("mongoose");
const fixtures = require("./fixtures");

const ImageSchema = new mongoose.Schema({
    Containers: String,
    CreatedAt: String,
    CreatedSince: { type: String, alias: "created" },
    Digest: String,
    ID: { type: String, alias: "image_id" },
    Repository: String,
    SharedSize: String,
    Size: { type: String, alias: "size" },
    Tag: { type: String, alias: "tag" },
    UniqueSize: String,
    VirtualSize: String,
});

const AppSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        repository: { type: String, required: true },
        folder: { type: String, required: true },
        domain: String,
        //  images: computed later,
        //  selected_image: computed later,
        init_code: { type: String, required: true, default: fixtures.initCodeExample },
        selected_image_id: { type: String },
        run_code: { type: String, required: true, default: fixtures.runCodeExample },
        htmlForm: { type: String, required: true, default: fixtures.formHtmlPlaceholderData },
        price: { type: Number, required: true, default: 0 },
        free_days: { type: Number, required: true, default: 0 },
    },
    {
        virtuals: {},
        toJSON: { virtuals: true },
    }
);
AppSchema.plugin(require("mongoose-lean-virtuals"));

const App = mongoose.model("App", AppSchema);

const { spawn } = require("node:child_process");

/**
 *
 * @param {Object} app
 * @throws Error
 */
App.checkScripts = async function (app) {
    console.log("syntax chek");
    await Promise.all([spellCheck(app.init_code, "Init script"), spellCheck(app.run_code, "Run script")]);
    return;

    async function spellCheck(code, scriptName) {
        const process = spawn(`bash`, ["-n"]);
        let out = [];

        // wait for the process to spawn
        await new Promise((resolve) => process.once(`spawn`, resolve));

        // retrun output
        process.stdout.on(`data`, (data) => out.push(data.toString().trim()));
        process.on("error", (err) => {
            throw "Failed to start subprocess.\n" + err;
        });

        // log any stderr
        process.stderr.on(`data`, (data) => {
            out.push(data.toString().trim());
        });

        await new Promise((resolve) => process.stdin.write(code, `utf8`, () => resolve()));
        process.stdin.end();

        // wait for stdout and stderr stream to end, and process to close
        let p = Promise.all([new Promise((resolve) => process.stdout.on("end", resolve)), new Promise((resolve) => process.stderr.on("end", resolve)), new Promise((resolve) => process.once(`close`, resolve))]);

        setTimeout(() => {
            process.kill();
            out.unshift("Syntax check timeout");
        }, 11000);
        await p;
        if (out.length === 0) return;
        else throw "Bash syntax check error in  " + scriptName + ":\n " + out.join("\n");
    }
};

module.exports = App;
