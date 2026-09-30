const Rate = require("../models/Rate");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

const getRates = asyncHandler(async (req, res) => {
  const rates = await Rate.find().sort({ site: 1 });
  res.status(200).json({ success: true, data: rates });
});

const getRateById = asyncHandler(async (req, res) => {
  const rate = await Rate.findById(req.params.id);
  if (!rate) {
    throw new CustomError("Rate not found", 404);
  }
  res.status(200).json({ success: true, data: rate });
});

const createRate = asyncHandler(async (req, res) => {
  const { site, rate } = req.body;
  if (site == null || rate == null) {
    throw new CustomError("Site and rate are required", 400);
  }

  const existingRate = await Rate.findOne({ site });
  if (existingRate) {
    throw new CustomError(`Site ${site} already exists`, 409);
  }

  const newRate = await Rate.create({ site, rate });
  res.status(201).json({ success: true, data: newRate });
});

const updateRate = asyncHandler(async (req, res) => {
  const { site, rate, isActive } = req.body;

  if (site != null) {
    const existingRate = await Rate.findOne({ site, _id: { $ne: req.params.id } });
    if (existingRate) {
      throw new CustomError(`Site ${site} already exists`, 409);
    }
  }

  const updatedRate = await Rate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedRate) {
    throw new CustomError("Rate not found", 404);
  }

  res.status(200).json({ success: true, data: updatedRate });
});

const deleteRate = asyncHandler(async (req, res) => {
  const rate = await Rate.findByIdAndDelete(req.params.id);
  if (!rate) {
    throw new CustomError("Rate not found", 404);
  }
  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getRates,
  getRateById,
  createRate,
  updateRate,
  deleteRate,
};
