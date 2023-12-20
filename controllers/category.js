import categoryModel from "../model/category.js";
import allModel from "../model/all.js";

import nodemailer from "nodemailer";

let allcategorys = [];

export const getallcategorys = async (req, res) => {
  console.log(`allcategorys in the database: ${allcategorys}`);
  const category = await categoryModel.find().select({ _id: 0, __v: 0 });
  let result = category.map((data) => data.category);
  res.send(result);
};

export const getallcategory = async (req, res) => {
  console.log(`allcategorys in the database: ${allcategorys}`);
  const get = await allModel.find({ category: req.params.categoryName });

  res.send(get);
};

export const createcategory = async (req, res) => {
  try {
    const { category } = req.body;
    await categoryModel.create({ category });

    res.send({
      success: true,
      statusCode: 200,
      displayMessage: "category Successfully Created",
    });
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }
};

export const deleteallcategory = async (req, res) => {
  try {
    const deleteone = await categoryModel.findByIdAndDelete(req.params.id);

    res.send({
      success: true,
      statusCode: 200,
      displayMessage: "delete sucesssfully",
    });
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }
};

export const updateallcategory = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const updateone = await categoryModel.findByIdAndUpdate(id, updates);

    res.send({
      success: true,
      statusCode: 200,
      displayMessage: "Updated sucesssfully",
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
