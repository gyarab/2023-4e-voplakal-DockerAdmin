const http = require("http");

module.exports = {
    addRoute(instance_id, domain, port) {
        return new Promise(async (resolve, reject) => {
            const caddyAPIURL = "http://localhost:2019/config/apps/http/servers/srv0/routes/";
            const req = http.request(
                caddyAPIURL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                (res) => {
                    let data = [];
                    console.log("Status Code:", res.statusCode);
                    if (res.statusCode !== 200) reject(`Status code: ${res.statusCode}\nRes: ${res}`);

                    res.on("data", (chunk) => {
                        data.push(chunk);
                    });

                    res.on("end", () => {
                        resolve(data.join("\n"));
                    });
                }
            );

            req.on("error", function (err) {
                reject("An error ocurred: \n" + err);
            });
            req.write(
                JSON.stringify({
                    "@id": instance_id,
                    handle: [
                        {
                            handler: "reverse_proxy",
                            upstreams: [
                                {
                                    dial: ":" + port,
                                },
                            ],
                        },
                    ],
                    match: [
                        {
                            host: [domain],
                        },
                    ],
                    terminal: true,
                })
            );
            req.end();
        });
    },

    deleteRoute(instance_id) {
        return new Promise(async (resolve, reject) => {
            const caddyAPIURL = `http://localhost:2019/id/${instance_id}/`;
            const req = http.request(
                caddyAPIURL,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                (res) => {
                    let data = [];
                    if (res.statusCode !== 200) reject(`Status code: ${res.statusCode}\nRes: ${res}`);

                    res.on("data", (chunk) => {
                        data.push(chunk);
                    });

                    res.on("end", () => {
                        resolve(data.join("\n"));
                    });
                }
            );
            req.on("error", function (err) {
                reject("An error ocurred: \n" + err);
            });
            req.end();
        });
    },
};
