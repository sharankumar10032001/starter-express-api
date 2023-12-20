import PurchaseModel from "../model/purchaseing.js";
import nodemailer from "nodemailer";

let Purchases = [];

export const purchaseTableView = async (req, res) => {
  console.log(`Purchases in the database: ${Purchases}`);
  const get = await PurchaseModel.purchaseTableView(
    req.query.page,
    req.query.pageSize,
    req.query.search,
    req.query.fromDate,
    req.query.toDate,
    req.query.singleDate
  );
  console.log(`get: ${get[0]}`);

  res.send({
    purchases: get[0]?.results ?? [],
    totalCount: get[0]?.count ?? 0,
    grossTotal: get[0]?.grossCount,
  });

  // res.send(get[0]);
};

export const getPurchases = async (req, res) => {
  console.log(`Purchases in the database: ${Purchases}`);
  const get = await PurchaseModel.getPurchases(res.body);

  res.send({ purchases: get });
};

export const PurchaseDetails = async (req, res) => {
  console.log(`Purchases in the database: ${Purchases}`);
  const count = await PurchaseModel.purchaseDetails(res.body);

  res.send({ totalCount: count, nextPurchaseNumber: count + 1 });
};
export const createPurchase = async (req, res) => {
  try {
    let result = await PurchaseModel.createPurchase(req.body);

    res.send(result);
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }
};

export const getPurchase = async (req, res) => {
  console.log(res.body);
  console.log(req.params.id);
  const result = await PurchaseModel.getPurchase(req.params.id);

  res.send(result);
};

export const deletePurchase = async (req, res) => {
  const deleteone = await PurchaseModel.deletePurchase(req.params.id);

  res.send("delete sucesssfully");
};

export const updatePurchase = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const updateone = await PurchaseModel.updatePurchase(id, updates)
      .then((response) => {
        return "successfully";
      })
      .catch((error) => {
        return error;
      });

    console.log(
      ` ${req.body.firstName} ${req.body.lastName} Purchasename has been updated  `
    );
    res.send("Updated sucesssfully");
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
