const App = require("../models/app.model");
const Instance = require("../models/instance.model");
const caddy = require("./caddy");

module.exports = {
    async resetSetup() {
        await caddy.setDefault();
        console.log("defaults set");
        for await (const instance of Instance.find()) {
            let app = await App.findById(instance.app_id, "domain").lean();
            if (app.domain) await caddy.addRoute(instance.container_id, `${instance.name}.${app.domain}`, instance.port);
        }
    },
};