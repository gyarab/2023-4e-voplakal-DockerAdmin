const https = require("https");

function verifyRecaptcha(token) {
    return new Promise(async (resolve, reject) => {
        const secret = process.env.RECAPTCHA_2_SECRET; // Replace with your actual secret key
        const response = token; // Obtained from client-side reCAPTCHA
        // const remoteip = "USER_IP_ADDRESS"; // Optional, get the user's IP address

        const options = {
            hostname: "www.google.com",
            port: 443,
            path: "/recaptcha/api/siteverify",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const responseJSON = JSON.parse(data);

                    // Handle the response:
                    if (responseJSON.success) {
                        resolve(responseJSON);
                    } else {
                        // reCAPTCHA verification failed
                        console.log("Captcha verification failed");
                        reject(responseJSON);
                    }
                } catch (error) {
                    console.error("Error parsing response:", error);
                    reject(error);
                }
            });
        });

        req.on("error", (error) => {
            console.error("Request error:", error);
            reject(error);
        });

        req.write(`secret=${secret}&response=${response}`); //&remoteip=${remoteip}
        req.end();
    });
}

module.exports = { verifyRecaptcha };
