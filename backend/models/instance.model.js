const mongoose = require("mongoose");
//limits defaults
const ld = JSON.parse(process.env.instance_resource_limits);
console.log("set limits:", { cpu: ld.cpu, ram: ld.ram, swap: ld.swap, disk: ld.disk });

const InstanceSchema = new mongoose.Schema(
    {
        app_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        image_id: { type: String, required: true },
        container_id: {
            type: String,
            required: true,
            validate: {
                validator: function (/**@type{String}*/ v) {
                    return v && !v.includes(" ");
                },
                message: (props) => `${props.value} is not a container id!`,
            },
        },
        expiry_date: {
            type: Date,
            get: function (d) {
                return d.toISOString().slice(0, 10);
            },
            set: function (v) {
                return new Date(v);
            },
        },
        created_on: { type: String, default: () => new Date().toISOString().split("T")[0] },
        name: { type: String, unique: true, required: true },
        mount_folder: { type: String, required: true },
        form_data: {
            type: Object,
            required: true,
            validate: {
                validator: function (v) {
                    for (const key in v) {
                        if (!/[a-zA-Z0-9_]/.test(key)) return false;
                    }
                    return true;
                },
                message: (props) => `Form data object props must pass [a-zA-Z0-9_]`,
            },
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        limits: {
            cpu: { type: Number, default: ld.cpu },
            ram: { type: Number, default: ld.ram },
            swap: { type: Number, default: ld.swap },
            disk: { type: Number, default: ld.disk },
        },
        port: { type: Number, required: true },
    },
    {
        virtuals: {
            // expiry_date: {
            //     get() {
            //         if (!this._expiry_date) return "";
            //         let d = new Date(this._expiry_date);
            //         return d.toISOString().slice(0, 10);
            //     },
            //     set(v) {
            //         console.log("\n\nSET: ", v);
            //         throw "huráaaaa"
            //         this._expiry_date = new Date(v);
            //         console.log(this._expiry_date);
            //     },
            // },
        },
        toJSON: { virtuals: true, getters: true, setters: true }, //also adds id virtual for _id
    }
);

InstanceSchema.plugin(require("mongoose-lean-virtuals"));
InstanceSchema.plugin(require("mongoose-lean-getters"));

const Instance = mongoose.model("Instance", InstanceSchema);

module.exports = Instance;
