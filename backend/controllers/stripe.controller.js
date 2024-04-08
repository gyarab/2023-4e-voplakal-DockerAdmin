const stripe = require("stripe")("sk_test_51OcN3vKEF11ecnKBZX6WZX3ZJT0Zc3eSe2S9CMvVM9HZXBrlynINB5tC4VvNHwMJpxO2zkPLAnD1vAhS9Qvlcmb200LVABQcNe");

const bodyParser = require("body-parser");
const Order = require("../models/order.model");
const Instance = require("../models/instance.model");
const { App } = require("../models");
const assert = require("node:assert");
const { authJwt } = require("../middlewares");

const YOUR_DOMAIN = process.env.DOMAIN;
// add verifikace requestu webhook https://stripe.com/docs/payments/checkout/fulfill-orders
const endpointSecret = "whsec_kGU5PGfxYfWAXCs9GsXOS7yW3wLzAmVy";

module.exports = {
    createCheckoutSession: async (req, res) => {
        console.log("create");
        console.log(req.body);
        assert.ok(req.body.months && req.body.instance_id, "Invalid request, missing props.");
        let months = req.body.months;
        let instance = await Instance.findById(req.body.instance_id);
        let app = await App.findById(instance.app_id);

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "czk",
                        product_data: {
                            name: `Your ${instance.name} app ${app.name}`,
                        },
                        unit_amount: app.price * 100, // je to v halířích
                    },
                    quantity: months,
                },
            ],
            mode: "payment",
            customer_email: "martin.air@seznam.cz",
            success_url: YOUR_DOMAIN + "/#/my-instances",
            cancel_url: YOUR_DOMAIN + "/#/500",
        });

        await Order.create({ session_id: session.id, status: session.status, months, amount: session.amount_total, client_id: req.user._id, instance_id: instance._id });
        res.send({ redirect_url: session.url });
    },

    webhook: async (request, response) => {
        const payload = request.body;
        const sig = request.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "checkout.session.completed") {
            console.log("status: ", event.data.object.status);
            console.log(event.data.object.id);
            let o = await Order.findOne({ session_id: event.data.object.id });
            o.status = event.data.object.status;
            await o.save();

            if (event.data.object.status === "complete") {
                let i = await Instance.findById(o.instance_id);
                i.expiry_date = new Date(i.expiry_date).valueOf() + o.months * 30 * 24 * 60 * 60 * 1000;
                await i.save();
            }
        }
        response.status(200).end();
    },
};
