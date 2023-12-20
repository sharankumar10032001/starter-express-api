import mongoose from "mongoose";
import { generateJwtToken } from "../middleware/generateToken.js";
import { passwordHash } from "../middleware/common.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";

const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const Billsschenma = new Schema({
  createdAt: { type: Date, default: Date.now },
  patientName: String,
  patientPhoneNo: String,
  billNo: Number,

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

export var Billsmodel = mongoose.model("Bills", Billsschenma);
export function model() {
  return Billsmodel;
}
export async function createBill(body) {
  console.log("--> method hit");
  try {
    let result = await Billsmodel.create(body);

    return {
      success: true,
      statusCode: 200,
      displayMessage: "Bill Created Successfully",
      createdId: result._id,
    };

    // }else{

    //     callback="Customer {Pls Fill Email&Password OR Invalid Billname/Password!}"
    //   return callback;

    // }
  } catch (error) {
    console.log(error);
    return "Something Went Wrong";
  }
}

export async function billTableView(
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
                input: { $toString: "$billNo" },
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
                billNo: 1,
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

    const result = await Billsmodel.aggregate(aggregationPipeline);

    return result;
  } catch (error) {
    console.error("Error in billTableView:", error);
    return { success: false, error: "An error occurred while fetching data." };
  }
}

export async function getBills(body) {
  console.log("-->got Bill hit");
  const get = await Billsmodel.find(body).select({ item: 0 });
  return get;
}
export async function billDetails(body) {
  console.log("-->got Bill hit");
  const get = await Billsmodel.count();
  return get;
}

export async function getBill(id) {
  try {
    console.log("-->found respective Bill");

    const findone = await Billsmodel.findById(id);
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

export async function deleteBill(body) {
  console.log("-->detele respective Bill");

  const deleteone = await Billsmodel.findByIdAndDelete(body);

  return deleteone;
}

export async function updateBill(req, res, next) {
  console.log(req);
  console.log("-->update respective Bill");
  const deleteone = await Billsmodel.findByIdAndUpdate(req, res);

  return deleteone;
}

export default {
  createBill,
  billDetails,
  model,
  getBills,
  getBill,
  deleteBill,
  updateBill,
  billTableView,
};
