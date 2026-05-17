const axios = require("axios");
const fs = require("fs");

async function run() {
  const contract = JSON.parse(fs.readFileSync("src/data/contract.json", "utf-8"));

  try {
    const res = await axios.post(
      "http://localhost:3000/ingestion/contract",
      contract
    );

    console.log("OK:", res.data);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

run();