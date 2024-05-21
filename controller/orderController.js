const config = require("config");
const Order = require("../models/order.model");
const OrderItem = require("../models/order_items.model");
const axios = require("axios");
const sequelize = require("../config/database");
const Customer = require("../models/customer.model");
const Salesrep = require("../models/salesrep.model");

exports.addOrder = async (req, res) => {
  const { id, paymentType, customerId, salesrepId, order_items } = req.body;

  const t = await sequelize.transaction();
  try {
    const data = {
      // id: id,
      payment_type: paymentType,
      customerId: customerId,
      salesrepId: salesrepId,
    };

    if (id) {
      const order = await Order.findByPk(id, { transaction: t });
      if (order) {
        // Create and associate order items
        const createdOrderItems = await Promise.all(
          order_items.map(async (item) => {
            const orderItem = await OrderItem.create(
              {
                quantity: item.quantity,
                itemId: item.itemId,
              },
              { transaction: t }
            );
            orderItem.orderId = order.id;
            await orderItem.save({ transaction: t });
            //await order.addItems(orderItem);
            return orderItem;
          })
        );
        // Add order items to the order response
        // Commit the transaction
        await t.commit();
        order.dataValues.order_items = createdOrderItems;
        res
          .status(201)
          .json({ message: "Order created successfully", data: order });
        return;
      }
    } else {
      const order = await Order.create(data, { transaction: t });
      // Create and associate order items
      const createdOrderItems = await Promise.all(
        order_items.map(async (item) => {
          const orderItem = await OrderItem.create(
            {
              quantity: item.quantity,
              itemId: item.itemId,
            },
            { transaction: t }
          );
          orderItem.orderId = order.dataValues.id;
          await orderItem.save({ transaction: t });
          //await order.addItems(orderItem);
          return orderItem;
        })
      );

      // Commit the transaction
      await t.commit();
      // Add order items to the order response
      order.dataValues.order_items = createdOrderItems;
      res
        .status(201)
        .json({ message: "Order created successfully", data: order });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    await t.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editOrder = async (req, res) => {
  const { id, paymentType, customerId } = req.body;
  console.log(req.body);

  try {
    const record = await Order.findByPk(id);

    record.payment_type = paymentType;
    record.customerId = customerId;

    const saved = await record.save();

    res.status(201).json({
      status: 201,
      message: "Order Updated Successfully",
      data: saved.dataValues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const records = await Order.findAll();
    const modifiedRecords = await Promise.all(
      records.map(async (record, index) => {
        const customer = await Customer.findByPk(
          record?.dataValues?.customerId
        );
        const salesrep = await Salesrep.findByPk(
          record?.dataValues?.salesrepId
        );
        return {
          ...record.dataValues,
          customer: customer,
          salesRep: salesrep,
        };
      })
    );

    res.status(200).json({
      status: 200,
      message: "Orders Fetched Successfully",
      data: modifiedRecords,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
