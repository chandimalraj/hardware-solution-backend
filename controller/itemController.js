const config = require("config");
const Item = require("../models/item.model");
const axios = require("axios");
const FormData = require("form-data");
const { Op } = require("sequelize");

exports.addItem = async (req, res) => {
  const { id, name, image_url, quantity, price, category } = req.body;

  try {
    const data = {
      id: id,
      name: name,
      image_url: image_url,
      category: category,
      quantity: quantity,
      price: price,
    };

    const savedData = await Item.create(data);

    if (req.file) {
      const response = await uploadImage(req.file);
      const image_url = response.data.data.url;

      const record = await Item.findByPk(savedData.dataValues.id);

      record.image_url = image_url;
      const saved = await record.save();

      res.status(201).json({
        status: 201,
        message: "Item Created Successfully",
        data: saved.dataValues,
      });
      return;
    }

    res.status(201).json({
      status: 201,
      message: "Item Created Successfully",
      data: savedData.dataValues,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadItemImage = async (req, res) => {
  const key = config.get("imgBBKey");

  try {
    if (!req.file) {
      res.status(404).json({ error: "File is not found" });
      return;
    }

    const file = req.file;
    const image = file.buffer;

    // Encode the image data to base64
    const base64Image = image.toString("base64");
    // Make a POST request to an external API
    const formData = new FormData();

    formData.append("image", base64Image);

    // Send FormData to ImgBB API endpoint
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${key}`,
      formData
    );

    res
      .status(201)
      .json({ message: "Image Uploaded Successfully", data: response.data });
  } catch (error) {
    console.log(error.response);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadImage = async (file) => {
  const key = config.get("imgBBKey");
  try {
    const image = file.buffer;

    // Encode the image data to base64
    const base64Image = image.toString("base64");
    // Make a POST request to an external API
    const formData = new FormData();

    formData.append("image", base64Image);

    // Send FormData to ImgBB API endpoint
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${key}`,
      formData
    );

    return response;
  } catch (error) {
    return error;
  }
};

exports.editItem = async (req, res) => {
  const { id, name, image_url, quantity, price, category } = req.body;
  console.log(req.body);

  try {
    const record = await Item.findByPk(id);
    if (req.file) {
      const response = await uploadImage(req.file);
      const image_url = response.data.data.url;

      record.image_url = image_url;
      record.name = name;
      record.quantity = quantity;
      record.price = price;
      record.category = category;
      const saved = await record.save();
      res.status(201).json({
        status: 201,
        message: "Item Updated Successfully",
        data: saved.dataValues,
      });
      return;
    }
    if (image_url) {
      record.name = name;
      record.quantity = quantity;
      record.price = price;
      record.category = category;
      const saved = await record.save();
      res.status(201).json({
        status: 201,
        message: "Item Updated Successfully",
        data: saved.dataValues,
      });
      return;
    }

    record.name = name;
    record.quantity = quantity;
    record.price = price;
    record.category = category;
    const saved = await record.save();

    res.status(201).json({
      status: 201,
      message: "Item Created Successfully",
      data: saved.dataValues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getItemsByCategory = async (req, res) => {
  const { category ,page,pageSize } = req.query;
  try {
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    const records = await Item.findAll({
      where: {
        category: category,
      },
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
    });
    const totalCount = records.length; // Total number of records
    const totalPages = Math.ceil(totalCount / parseInt(pageSize)); // Calculate total pages
    res.status(200).json({
      status: 200,
      message: "Items Fetched Successfully",
      data: records,
      totalPages: totalPages,
      currentPage: page,
      pageSize: pageSize,
      totalCount: totalCount
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const records = await Item.findAll();
    res.status(200).json({
      status: 200,
      message: "Items Fetched Successfully",
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getItemsByName = async (req, res) => {
  const { name, category ,page,pageSize } = req.query;

  try {
    
    const items = await Item.findAll({
      where: {
        category: category,
        name: {
          [Op.like]: `${name}%`, // Case-insensitive search for name
        },
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    const totalCount = items.length; // Total number of records
    const totalPages = Math.ceil(totalCount / pageSize); // Calculate total pages

    res.status(200).json({
      status: 200,
      message: "Items Are Fetched Successfully",
      data: items,
      totalPages: totalPages,
      currentPage: page,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.query;

  try {
    // Find the user by ID
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete the user
    await item.destroy();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
