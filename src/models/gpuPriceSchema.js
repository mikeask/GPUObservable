const mongoose = require("../database");

const GpuPriceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  lastPrice: Number,
  lastPriceDate: Date,
  minorPrice: Number,
  minorPriceDate: Date,
  links: [String],
  __v: {
    select: false,
  },
});

const GpuPrice = mongoose.model("gpu-last-prices", GpuPriceSchema);
module.exports = GpuPrice;
