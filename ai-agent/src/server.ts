import express from "express";

import { analyzeEntity }
from "./services/analyzeEntity";

const app = express();

app.use(express.json());

app.post(
  "/aml/analyze",

  async (req, res) => {

    try {

      const { entity } = req.body;

      const result =
        await analyzeEntity(entity);

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "AML analysis failed"
      });
    }
  }
);

app.listen(3000, () => {

  console.log(
    "AML server running on port 3000"
  );
});