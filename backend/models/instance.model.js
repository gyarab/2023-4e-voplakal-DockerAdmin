const mongoose = require("mongoose");
//limits defaults
const ld = JSON.parse(process.env.instance_resource_limits);
console.log("set limits:", { cpu: ld.cpu, ram: ld.ram, swap: ld.swap, disk: ld.disk });

const InstanceSchema = new mongoose.Schema(
    {
        app_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        image_id: { type: String, required: true },
        container_id: { type: String, required: true },
        expiry_date: { type: String, required: true },
        created_on: { type: String, default: () => new Date().toUTCString() },
        name: { type: String, required: true },
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
    },
    {
        virtuals: {
            // client_email: {
            //     get() {
            //         return this.client + "email";
            //     },
            // },
        },
        toJSON: { virtuals: true }, //also adds id virtual for _id
    }
);

const Instance = mongoose.model("Instance", InstanceSchema);

module.exports = Instance;
