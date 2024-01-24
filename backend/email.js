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

module.exports.send = ({ to, subject, text }) => {
    // send email
    transporter.sendMail({
        from: "norepy-test@email.cz",
        to,
        subject,
        text,
    });
};
