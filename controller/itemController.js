const config = require("config");
const Item = require("../models/item.model");
const axios = require("axios");
const FormData = require("form-data");

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
  console.log(req.body)
  
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
        message: "Item Created Successfully",
        data: saved.dataValues,
      });
      return
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
    console.log(error)
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
