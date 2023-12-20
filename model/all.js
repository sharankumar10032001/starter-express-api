import mongoose from "mongoose";

const Schema = mongoose.Schema;
const allschenma = new Schema({
  id: { type: Number, unique: true, default: 0 },
  title: String,
  category: String,
  description: String,
  image: String,
  price: Number,
  rating: { count: Number, rate: Number },
  priorityColor: { type: String, enum: ["Green", "Red"], default: "Green" },
  isDeleted: { type: Boolean, default: false },
});

export var allmodel = mongoose.model("all", allschenma);
export function model() {
  return allmodel;
}

export default allmodel;
