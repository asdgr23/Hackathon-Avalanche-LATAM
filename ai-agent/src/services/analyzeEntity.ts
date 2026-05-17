import fs from "fs";

import { normalizeData } from "../normalize";
import { generateReport } from "../agent";
import { filterEntityData }
from "../filters/filterEntityData";

import { buildAvalanchePayload }
from "../blockchain/buildAvalanchePayload";

export async function analyzeEntity(
  entityQuery: string
) {

  const transactions = JSON.parse(
    fs.readFileSync(
      "./src/data/bank_transactions.json",
      "utf-8"
    )
  );

  const invoices = JSON.parse(
    fs.readFileSync(
      "./src/data/erp_invoices.json",
      "utf-8"
    )
  );

  const contracts = JSON.parse(
    fs.readFileSync(
      "./src/data/contracts_source.json",
      "utf-8"
    )
  );

  const satRegistry = JSON.parse(
    fs.readFileSync(
      "./src/data/sat_registry.json",
      "utf-8"
    )
  );

  const entityData =
    filterEntityData(
      entityQuery,
      transactions,
      invoices,
      contracts,
      satRegistry
    );

  const amlOutput =
    normalizeData(
      entityQuery,
      entityData.transactions,
      entityData.invoices,
      entityData.contracts,
      entityData.satRegistry
    );

  const report =
    await generateReport(
      amlOutput
    );

  const blockchainPayload =
    buildAvalanchePayload(
      report
    );

  return {
    amlOutput,
    report,
    blockchainPayload,
  };
}