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
  const { name, site, rate, isActive } = req.body;

  if (!name || site == null || rate == null) {
    throw new CustomError(
      "Name, site and rate are required",
      400
    );
  }

  const cleanName = name.trim();

  const existingRate = await Rate.findOne({
    name: cleanName,
    site: Number(site),
  });

  if (existingRate) {
    throw new CustomError(
      `${cleanName} rate for site ${site} already exists`,
      409
    );
  }

  const newRate = await Rate.create({
    name: cleanName,
    site: Number(site),
    rate: Number(rate),
    isActive,
  });

  res.status(201).json({
    success: true,
    data: newRate,
  });
});

const updateRate = asyncHandler(async (req, res) => {
  const { name, site, rate, isActive } = req.body;

  if (name != null && site != null) {
    const existingRate = await Rate.findOne({ name: name.trim(), site, _id: { $ne: req.params.id } });
    if (existingRate) {
      throw new CustomError(`${name.trim()} rate for site ${site} already exists`, 409);
    }
  }

  const updateData = { ...req.body };
  if (name) updateData.name = name.trim();

  const updatedRate = await Rate.findByIdAndUpdate(
    req.params.id,
    updateData,
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
