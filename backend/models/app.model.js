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
        images: [ImageSchema],
        init_code: { type: String, required: true, default: fixtures.initCodeExample },
        selected_image: { type: Number, default: 0 },
        run_code: { type: String, required: true, default: fixtures.runCodeExample },
        htmlForm: { type: String, required: true, default: fixtures.formHtmlPlaceholderData },
    },
    {
        virtuals: {
            image_selected: {
                get() {
                    return this.images[this.selected_image];
                },
            },
        },
        toJSON: { virtuals: true },
    }
);

const App = mongoose.model("App", AppSchema);

module.exports = App;
