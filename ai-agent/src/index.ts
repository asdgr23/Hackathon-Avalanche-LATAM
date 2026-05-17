import dotenv from "dotenv";

import fs from "fs";

import { normalizeData } from "./normalize";

import { generateReport } from "./agent";

dotenv.config();

const start = Date.now();

// ─────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────

async function main() {

  console.log("Loading transaction data...");

  // ─────────────────────────────────────────
  // LOAD JSON FILE
  // ─────────────────────────────────────────

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

  console.log(
    `Loaded ${transactions.length} transactions`
  );

  console.log(
  `Loaded ${invoices.length} invoices`
);

console.log(
  `Loaded ${contracts.length} contracts`
);

  // ─────────────────────────────────────────
  // NORMALIZE DATA
  // ─────────────────────────────────────────

  const amlOutput =
    normalizeData(
      transactions,
      invoices,
      contracts
    );

  console.log(
    "AML normalization complete"
  );

  console.log(
    "Detected flags:",
    amlOutput.flags
  );

  // ─────────────────────────────────────────
  // GENERATE AI REPORT
  // ─────────────────────────────────────────

  const report =
    await generateReport(amlOutput);

  // ─────────────────────────────────────────
  // OUTPUT
  // ─────────────────────────────────────────

  console.log("\n");
  console.log("=".repeat(70));

  console.log("AML REPORT");

  console.log("=".repeat(70));

  console.log(report.report);

  console.log("\n");

  console.log(
    `Risk Level: ${report.risk_level}`
  );

  console.log(
    `Risk Score: ${report.risk_score}`
  );

  const end = Date.now();

  console.log(
    `Pipeline executed in ${end - start}ms`
  );
}


main().catch((error) => {

  console.error(
    "Fatal AML pipeline error:",
    error
  );
});