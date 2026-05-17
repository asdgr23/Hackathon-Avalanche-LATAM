import express from "express";
import cors from "cors";

import { analyzeEntity }
from "./services/analyzeEntity";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {

  res.send(
    "FlowTrace AML Agent Running"
  );
});

app.post(
  "/aml/analyze",

  async (req, res) => {

    try {

      const { entity } = req.body;

      if (!entity) {

        return res.status(400).json({
          error: "entity required"
        });
      }

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

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});