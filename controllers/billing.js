import BillingModel from "../model/billing.js";
import nodemailer from "nodemailer";

let Bills = [];

export const billTableView = async (req, res) => {
  console.log(`Bills in the database: ${Bills}`);
  const get = await BillingModel.billTableView(
    req.query.page,
    req.query.pageSize,
    req.query.search,
    req.query.fromDate,
    req.query.toDate,
    req.query.singleDate
  );
  console.log(`get: ${get[0]}`);

  res.send({
    bills: get[0]?.results ?? [],
    totalCount: get[0]?.count ?? 0,
    grossTotal: get[0]?.grossCount,
  });

  // res.send(get[0]);
};

export const getBills = async (req, res) => {
  console.log(`Bills in the database: ${Bills}`);
  const get = await BillingModel.getBills(res.body);

  res.send({ bills: get });
};

export const BillDetails = async (req, res) => {
  console.log(`Bills in the database: ${Bills}`);
  const count = await BillingModel.billDetails(res.body);

  res.send({ totalCount: count, nextBillNumber: count + 1 });
};
export const createBill = async (req, res) => {
  try {
    let result = await BillingModel.createBill(req.body);

    res.send(result);
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }
};

export const getBill = async (req, res) => {
  console.log(res.body);
  console.log(req.params.id);
  const result = await BillingModel.getBill(req.params.id);

  res.send(result);
};

export const deleteBill = async (req, res) => {
  const deleteone = await BillingModel.deleteBill(req.params.id);

  res.send("delete sucesssfully");
};

export const updateBill = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const updateone = await BillingModel.updateBill(id, updates)
      .then((response) => {
        return "successfully";
      })
      .catch((error) => {
        return error;
      });

    console.log(
      ` ${req.body.firstName} ${req.body.lastName} Billname has been updated  `
    );
    res.send("Updated sucesssfully");
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
