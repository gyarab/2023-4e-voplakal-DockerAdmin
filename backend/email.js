const nodemailer = require("nodemailer");
// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    host: "smtp.seznam.cz",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports.send = async ({ to, subject, text }) => {
    if (process.env.EMAIL !== "ON") return console.log("Emailing disabled");
    // send email
    await transporter.sendMail({
        from: process.env.EMAIL_ADDR,
        to,
        subject,
        text,
    });
};
