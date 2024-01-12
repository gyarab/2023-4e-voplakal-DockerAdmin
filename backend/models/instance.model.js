const mongoose = require("mongoose");
const fixtures = require("./fixtures");

const InstanceSchema = new mongoose.Schema(
    {
        app_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        status: { type: String, required: true },
        image_id: { type: String, required: true },
        expiry_date: { type: String, required: true },
        created_on: { type: String, required: true },
        name: { type: String, required: true },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        limits: {
            cpu: Number,
            ram: Number,
            swap: Number,
            disk: Number,
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
