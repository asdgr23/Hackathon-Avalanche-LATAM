import dotenv from "dotenv";
import fs from "fs";
import express from "express";

import { normalizeData } from "./normalize";
import { generateReport } from "./agent";
import { filterEntityData } from "./filters/filterEntityData";
import { buildAvalanchePayload } from "./blockchain/buildAvalanchePayload";

dotenv.config();

const app = express();
app.use(express.json());

// ───────────────────────────────────
// LOAD DATA ON START (IMPORTANTE)
// ───────────────────────────────────

const transactions = JSON.parse(
  fs.readFileSync("./src/data/bank_transactions.json", "utf-8")
);

const invoices = JSON.parse(
  fs.readFileSync("./src/data/erp_invoices.json", "utf-8")
);

const contracts = JSON.parse(
  fs.readFileSync("./src/data/contracts_source.json", "utf-8")
);

const satRegistry = JSON.parse(
  fs.readFileSync("./src/data/sat_registry.json", "utf-8")
);

// ───────────────────────────────────
// API ENDPOINT
// ───────────────────────────────────

app.post("/analyze", async (req, res) => {
  try {
    const { entityQuery } = req.body;

    if (!entityQuery) {
      return res.status(400).json({
        error: "entityQuery is required",
      });
    }

    console.log("Analyzing:", entityQuery);

    const entityData = filterEntityData(
      entityQuery,
      transactions,
      invoices,
      contracts,
      satRegistry
    );

    const amlOutput = normalizeData(
      entityQuery,
      entityData.transactions,
      entityData.invoices,
      entityData.contracts,
      entityData.satRegistry
    );

    const report = await generateReport(amlOutput);

    const avalanchePayload = buildAvalanchePayload(report);

    return res.json({
      report: report.report,
      flags: amlOutput.flags,
      avalanchePayload,
      summary: {
        transactions: entityData.transactions.length,
        invoices: entityData.invoices.length,
        contracts: entityData.contracts.length,
        satRegistry: entityData.satRegistry.length,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// ───────────────────────────────────
// HEALTH CHECK
// ───────────────────────────────────

app.get("/", (_, res) => {
  res.send("FlowTrace AI Agent running 🚀");
});

// ───────────────────────────────────
// START SERVER (CRÍTICO PARA RENDER)
// ───────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});