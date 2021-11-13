const express = require("express");

const scoreRouter = express.Router();

const GpuPrice = require("../../models/gpuPriceSchema");

scoreRouter.post("/", async (req, res) => {
  const existingGpuPrice = await GpuPrice.findById(req.body._id);

  if (existingGpuPrice) {
    res.status(409).send({ message: "already exists" });
    return;
  }

  const gpuPriceCreated = await GpuPrice.create(req.body);
  if (!gpuPriceCreated) {
    res.status(400).send("invalid GpuPrice");
    return;
  }
  res.status(200).send(gpuPriceCreated);
});

scoreRouter.put("/", async (req, res) => {
  const gpuPriceUpdated = await GpuPrice.findByIdAndUpdate(
    req.body._id,
    req.body
  );

  if (!gpuPriceUpdated) {
    res.status(404).send({ message: "gpu-price not found" });
    return;
  }

  res.status(200).send(req.body);
});

scoreRouter.get("/", async (req, res) => {
  try {
    console.log(req.query);
    const gpuName = req.query.name;

    if (!gpuName) {
      const gpuPriceList = await GpuPrice.find({}).sort([
        ["lastPrice", "descending"],
      ]);
      res.status(200).send(gpuPriceList);
      return;
    }

    const gpuPriceFound = await GpuPrice.findById(gpuName);
    if (!gpuPriceFound) {
      const notFoundRes = {
        message: `Não encontramos dados para a GPU ${gpuName}.`,
      };
      res.status(400).send(notFoundRes);
      return;
    }

    res.status(200).send(gpuPriceFound);
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
});

module.exports = (app) => app.use("/GPU/last-prices", scoreRouter);
