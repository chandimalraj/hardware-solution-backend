const config = require("config");
const Order = require("../models/order.model");
const OrderItem = require("../models/order_items.model");
const axios = require("axios");
const sequelize = require("../config/database");
const Customer = require("../models/customer.model");
const Salesrep = require("../models/salesrep.model");
const OrderItems = require("../models/order_items.model");
const Item = require("../models/item.model");

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

exports.getItemsByOrder = async (req, res) => {
  const { id } = req.query;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "There is no order",
      });
    } else {
      const records = await OrderItems.findAll({
        where: {
          orderId: id,
        },
      });
      console.log(records[0].dataValues);
      const modifiedOrderItems = await Promise.all(
        records.map(async (record, index) => {
          const itemRecord = await Item.findByPk(record.dataValues.itemId);
          return {
            ...record.dataValues,
            item: itemRecord,
          };
        })
      );
      let x = 0;
      const total = modifiedOrderItems.forEach((item, index) => {
        x = item?.quantity * item?.item?.price + x;
      });
      const data = {
        data: modifiedOrderItems,
        total: x,
      };
      res.status(200).json({
        status: 200,
        message: "Order Items Fetched Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getOrdersByCustomerCode = async (req, res) => {
  const { code } = req.query;
  try {
    const customer = await Customer.findOne({
      where: {
        customer_code: code,
      },
    });

    if (customer) {
      console.log(customer);
      const customerId = customer.dataValues.id;
      const orders = await Order.findAll({
        where: {
          customerId: customerId,
        },
      });
      const modifiedRecords = await Promise.all(
        orders.map(async (record, index) => {
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
    } else {
      res.status(200).json({
        status: 200,
        message: "Orders Fetched Successfully",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getOrdersBySalesRep = async (req, res) => {
  const { name } = req.query;
  try {
    const salesRep = await Salesrep.findOne({
      where: {
        name: name,
      },
    });

    if (salesRep) {
      console.log(salesRep);
      const salesRepId = salesRep.dataValues.id;
      const orders = await Order.findAll({
        where: {
          salesrepId: salesRepId,
        },
      });
      const modifiedRecords = await Promise.all(
        orders.map(async (record, index) => {
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
    } else {
      res.status(200).json({
        status: 200,
        message: "Orders Fetched Successfully",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.query;

  try {
    // Find the user by ID
    const transaction = await sequelize.transaction();
    const order = await Order.findByPk(id, { transaction: transaction });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await OrderItem.destroy({
      where: { orderId: id },
      transaction,
    });
    const result = await Order.destroy({
      where: { id: id },
      transaction,
    });

    if (result) {
      await transaction.commit();
      res
        .status(200)
        .send({ message: "Order and associated items deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.setOrderAccepted = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    // Find the user by ID
    if (!orderId) {
      return res.status(404).json({ message: "Order Id not found" });
    }
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status == "ACCEPTED") {
      order.pending = false;
      const saved = await order.save();

      res.status(201).json({
        status: 201,
        message: "Order Status Updated Successfully",
        data: saved.dataValues,
      });
    } else {
      return res.status(404).json({ message: "ACCEPTED Status not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
