import mongoose from "mongoose";
import { generateJwtToken } from "../middleware/generateToken.js";
import { passwordHash } from "../middleware/common.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";

const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const Purchasesschenma = new Schema({
  createdAt: { type: Date, default: Date.now },
  patientName: String,
  patientPhoneNo: String,
  purchaseNo: Number,

  item: [
    { 
      id: Number,
      title: String,
      image: String,

      price: Number,
      quantity: Number,
      productType: String,
    },
  ],
  total: Number,
  discount: Number,
  finalTotal: Number,
  doctorName: String,

  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

export var Purchasesmodel = mongoose.model("Purchases", Purchasesschenma);
export function model() {
  return Purchasesmodel;
}
export async function createPurchase(body) {
  console.log("--> method hit");
  try {
    let result = await Purchasesmodel.create(body);

    return {
      success: true,
      statusCode: 200,
      displayMessage: "Purchase Created Successfully",
      createdId: result._id,
    };

    // }else{

    //     callback="Customer {Pls Fill Email&Password OR Invalid Purchasename/Password!}"
    //   return callback;

    // }
  } catch (error) {
    console.log(error);
    return "Something Went Wrong";
  }
}

export async function purchaseTableView(
  currentPage,
  pageSize,
  search,
  fromDate,
  toDate,
  singleDate
) {
  try {
    const searchTerm = search;
    const offset = (currentPage - 1) * pageSize;
    const searchFromTermDate = new Date(fromDate);
    const searchToTermDate = new Date(toDate);
    const searchSingleTermDate = new Date(singleDate);

    const matchConditions = [];

    if (searchTerm) {
      matchConditions.push({
        $or: [
          { patientName: { $regex: new RegExp(searchTerm, "i") } },
          { doctorName: { $regex: new RegExp(searchTerm, "i") } },
          { patientPhoneNo: { $regex: new RegExp(searchTerm, "i") } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$purchaseNo" },
                regex: searchTerm,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$total" },
                regex: searchTerm,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$finalTotal" },
                regex: searchTerm,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$discount" },
                regex: searchTerm,
                options: "i",
              },
            },
          },
        ],
      });
    }

    if (!isNaN(searchSingleTermDate.getTime())) {
      matchConditions.push({
        createdAt: {
          $gte: searchSingleTermDate,
          $lt: new Date(searchSingleTermDate.getTime() + 24 * 60 * 60 * 1000),
        },
      });
    }

    if (
      !isNaN(searchFromTermDate.getTime()) &&
      !isNaN(searchToTermDate.getTime())
    ) {
      matchConditions.push({
        createdAt: {
          $gte: searchFromTermDate,
          $lt: new Date(searchToTermDate.getTime() + 24 * 60 * 60 * 1000),
        },
      });
    }

    const aggregationPipeline = [];

    if (matchConditions.length > 1) {
      aggregationPipeline.push({
        $match: {
          $and: matchConditions,
        },
      });
    } else if (matchConditions.length === 1) {
      aggregationPipeline.push({
        $match: matchConditions[0],
      });
    }

    aggregationPipeline.push(
      {
        $sort: {
          createdAt: -1, // Replace 'createdAt' with the field you want to sort by
        },
      },
      {
        $facet: {
          // Separate stage for grouping
          data: [
            {
              $project: {
                _id: 1,
                patientName: 1,
                doctorName: 1,
                patientPhoneNo: 1,
                purchaseNo: 1,
                total: 1,
                discount: 1,
                finalTotal: 1,
                createdAt: 1,
              },
            },
            {
              $skip: Number(offset),
            },
            {
              $limit: Number(pageSize),
            },
          ],
          // Separate stage for counting
          count: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          grossCount: [
            {
              $group: {
                _id: null,
                totalGross: {
                  $sum: "$finalTotal",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          count: { $arrayElemAt: ["$count.count", 0] },
          grossCount: { $arrayElemAt: ["$grossCount.totalGross", 0] },
          results: "$data",
        },
      }
    );
    console.log("aggregationPipeline", aggregationPipeline);
    console.log("aggregationPipeline", aggregationPipeline[0].$match);

    const result = await Purchasesmodel.aggregate(aggregationPipeline);

    return result;
  } catch (error) {
    console.error("Error in purchaseTableView:", error);
    return { success: false, error: "An error occurred while fetching data." };
  }
}

export async function getPurchases(body) {
  console.log("-->got Purchase hit");
  const get = await Purchasesmodel.find(body).select({ item: 0 });
  return get;
}
export async function purchaseDetails(body) {
  console.log("-->got Purchase hit");
  const get = await Purchasesmodel.count();
  return get;
}

export async function getPurchase(id) {
  try {
    console.log("-->found respective Purchase");

    const findone = await Purchasesmodel.findById(id);
    return findone;
  } catch (err) {
    return err;
  }
}
// Email Checking Regex
function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
}
// Email Checking Regex END

export async function deletePurchase(body) {
  console.log("-->detele respective Purchase");

  const deleteone = await Purchasesmodel.findByIdAndDelete(body);

  return deleteone;
}

export async function updatePurchase(req, res, next) {
  console.log(req);
  console.log("-->update respective Purchase");
  const deleteone = await Purchasesmodel.findByIdAndUpdate(req, res);

  return deleteone;
}

export default {
  createPurchase,
  purchaseDetails,
  model,
  getPurchases,
  getPurchase,
  deletePurchase,
  updatePurchase,
  purchaseTableView,
};
