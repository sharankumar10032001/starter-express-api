import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import CustomerDetailsRoutes from "./routes/CustomerDetails.js";
import BillRoutes from "./routes/billing.js";

import allRoutes from "./routes/all.js";
import categoryRoutes from "./routes/category.js";

import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
mongoose
  .connect(
    "mongodb+srv://admin:Balaji10032001@cluster0.acqx3.mongodb.net/ssm",
    {
      useNewUrlParser: true,
      //useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    /** ready to use. The `mongoose*/
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit(1);
  });

app.use("/CustomerDetails", CustomerDetailsRoutes);
app.use("/billing", BillRoutes);

app.use("/all", allRoutes);
app.use("/category", categoryRoutes);

app.get("/", (req, res) =>
  res.send(
    "Welcome to the  API For Customer Service!<Br>Note:This Api Is Reference For Interns For Folder Structure"
  )
);
app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
