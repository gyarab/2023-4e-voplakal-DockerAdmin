const mongoose = require("mongoose");

/**
 * this module is not being use at the moment, If there isa need to accept regualrpayments, it will be useful in the future.
 */

const Order = mongoose.model(
    "Order",
    new mongoose.Schema(
        {
            session_id: {
                type: String,
                required: true,
            },
            instance_id: {
              type: String,
              required: true,
          },
            client_id: {
              type: String,
              required: true,
          },
            amount: {
                type: Number,
                required: true,
            },
            months: {
                type: Number,
                required: true,
            },
            status: String,
        },
        { timestamps: true }
    )
);

module.exports = Order;
