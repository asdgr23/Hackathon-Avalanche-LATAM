import dotenv from "dotenv";

import fs from "fs";

import readline from "readline";

import { normalizeData } from "./normalize";

import { generateReport } from "./agent";

import { filterEntityData }
from "./filters/filterEntityData";

import { buildAvalanchePayload }
from "./blockchain/buildAvalanchePayload";

dotenv.config();

const rl = readline.createInterface({

  input: process.stdin,

  output: process.stdout,
});

function askQuestion(
  question: string
): Promise<string> {

  return new Promise((resolve) => {

    rl.question(
      question,
      resolve
    );
  });
}

async function main() {

  console.log("\n");
  console.log(
    "===================================="
  );

  console.log(
    "FLOWTRACE AML INVESTIGATOR"
  );

  console.log(
    "===================================="
  );

  // ───────────────────────────────────
  // USER INPUT
  // ───────────────────────────────────

  const entityQuery =
    await askQuestion(

      "Enter entity name, bank, tax ID, or keyword: "
    );

  // ───────────────────────────────────
  // LOAD DATA
  // ───────────────────────────────────

  console.log("\nLoading datasets...");

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

  // ───────────────────────────────────
  // FILTER ENTITY DATA
  // ───────────────────────────────────

  console.log(
    "\nSearching entity data..."
  );

  const entityData =
    filterEntityData(

      entityQuery,

      transactions,
      invoices,
      contracts,
      satRegistry
    );

  console.log(
    `Matched transactions:
     ${entityData.transactions.length}`
  );

  console.log(
    `Matched invoices:
     ${entityData.invoices.length}`
  );

  console.log(
    `Matched contracts:
     ${entityData.contracts.length}`
  );

  console.log(
    `Matched SAT records:
     ${entityData.satRegistry.length}`
  );

  // ───────────────────────────────────
  // AML ENGINE
  // ───────────────────────────────────

  console.log(
    "\nRunning AML engine..."
  );

  const amlOutput =
  normalizeData(

    entityQuery,

    entityData.transactions,

    entityData.invoices,

    entityData.contracts,

    entityData.satRegistry
  );

  console.log(
    "Detected flags:",
    amlOutput.flags
  );

  // ───────────────────────────────────
  // AI REPORT
  // ───────────────────────────────────

  console.log(
    "\nGenerating AI report..."
  );

  const report =
    await generateReport(
      amlOutput
    );

  // ───────────────────────────────────
  // BLOCKCHAIN PAYLOAD
  // ───────────────────────────────────

  const avalanchePayload =

    buildAvalanchePayload(
      report
    );

  // ───────────────────────────────────
  // OUTPUTS
  // ───────────────────────────────────

  console.log("\n");

  console.log(
    "===================================="
  );

  console.log(
    "AI AML REPORT"
  );

  console.log(
    "===================================="
  );

  console.log(
    report.report
  );

  console.log("\n");

  console.log(
    "===================================="
  );

  console.log(
    "AVALANCHE PAYLOAD"
  );

  console.log(
    "===================================="
  );

  console.log(

    JSON.stringify(
      avalanchePayload,
      null,
      2
    )
  );

  rl.close();
}

main().catch(console.error);