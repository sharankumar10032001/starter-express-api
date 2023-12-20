import allmodel from "../model/all.js";
import nodemailer from "nodemailer";

let allproducts = [];

export const getallproducts = async (req, res) => {
  try {
    const { page: currentPage, pageSize, search } = req.query;

    const searchTerm = search;
    const offset = (currentPage - 1) * pageSize;

    const matchConditions = [];

    if (searchTerm) {
      matchConditions.push({
        $or: [
          { title: { $regex: new RegExp(searchTerm, "i") } },
          { category: { $regex: new RegExp(searchTerm, "i") } },
          { description: { $regex: new RegExp(searchTerm, "i") } },
          { priorityColor: { $regex: new RegExp(searchTerm, "i") } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$price" },
                regex: searchTerm,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$id" },
                regex: searchTerm,
                options: "i",
              },
            },
          },
          // {
          //   $expr: {
          //     $regexMatch: {
          //       input: { $toString: "$rating" },
          //       regex: searchTerm,
          //       options: "i",
          //     },
          //   },
          // },
        ],
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
      // {
      //   $sort: {
      //     createdAt: -1, // Replace 'createdAt' with the field you want to sort by
      //   },
      // },
      {
        $facet: {
          // Separate stage for grouping
          data: [
            {
              $project: {
                _id: 1,
                id: 1,
                title: 1,
                category: 1,
                description: 1,
                image: 1,
                price: 1,
                rating: 1,
                priorityColor: 1,
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
          // grossCount: [
          //   {
          //     $group: {
          //       _id: null,
          //       totalGross: {
          //         $sum: "$finalTotal",
          //       },
          //     },
          //   },
          // ],
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

    const result = await allmodel.aggregate(aggregationPipeline);

    return res.send(result[0]);
  } catch (error) {
    console.error("Error in billTableView:", error);
    return res.send({
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
};
export const getallproductBysearch = async (req, res) => {
  try {
    //params
    let search = req.query.search;
    if (search.length) {
      console.log("search", search);
      //regex for search
      const regexQuery = { $regex: new RegExp(search, "i") }; // Case-insensitive search for "john"

      //model search
      const get = await allmodel.aggregate([
        {
          $match: {
            title: regexQuery,
          },
        },
        {
          $limit: 10,
        },
      ]);

      res.send(get);
    } else {
      console.log("else search", search);

      res.send([]);
    }
  } catch (err) {
    res.send(err);
  }
};

export const getallproduct = async (req, res) => {
  console.log(`allproducts in the database: ${allproducts}`);
  const get = await allmodel.findOne({ id: req.params.id });

  res.send(get);
};

export const createProduct = async (req, res) => {
  try {
    let idNumber = await allmodel.find();
    req.body.id = idNumber.length + 1;
    console.log(" req.body.id", req.body.id);
    let result = await allmodel.create(req.body);

    res.send({
      success: true,
      statusCode: 200,
      displayMessage: "Product Successfully Created",
    });
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }
};

export const deleteallproduct = async (req, res) => {
  try {
    const deleteone = await allmodel.findByIdAndDelete(req.params.id);

    res.send({
      success: true,
      statusCode: 200,
      displayMessage: "delete sucesssfully",
    });
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }
};

export const updateallproduct = async (req, res, next) => {
  const id = req.params.id;
  const { title, category, description, image, price, rating, priorityColor } =
    req.body;
  const updates = {
    title,
    category,
    description,
    image,
    price,
    rating,
    priorityColor,
  };
  try {
    const updateone = await allmodel.findByIdAndUpdate(id, updates);

    res.send({
      success: true,
      statusCode: 200,
      displayMessage: "Updated sucesssfully",
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
