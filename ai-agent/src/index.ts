import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Explica Avalanche blockchain",
      },
    ],
  });

 const content =
  response.choices[0]?.message?.content ||
  "No response generated";

console.log(content);
}

main();