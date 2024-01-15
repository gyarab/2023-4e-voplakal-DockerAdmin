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
      //  images: computed later,
      //  selected_image: computed later,
        init_code: { type: String, required: true, default: fixtures.initCodeExample },
        selected_image_id: { type: String },
        run_code: { type: String, required: true, default: fixtures.runCodeExample },
        htmlForm: { type: String, required: true, default: fixtures.formHtmlPlaceholderData },
    },
    {
        virtuals: {
        },
        toJSON: { virtuals: true },
    }
);
AppSchema.plugin(require('mongoose-lean-virtuals'));

const App = mongoose.model("App", AppSchema);

module.exports = App;
