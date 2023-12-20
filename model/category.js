import mongoose from "mongoose";

const Schema = mongoose.Schema;
const allschenma = new Schema({
  category: String,
});

export var allmodel = mongoose.model("category", allschenma);
export function model() {
  return allmodel;
}

export default allmodel;
