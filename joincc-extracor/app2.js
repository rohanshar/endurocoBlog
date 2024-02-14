import fs from "fs";
import path from "path";
import OpenAI from "openai"; // Adjusted based on the provided export file
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env file

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
});

async function rewriteText(text, markdown = false) {
  try {
    const prompt = `Please rewrite the following text${
      markdown ? " in markdown format" : ""
    }:\n\n${text}`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    if (response && response.choices && response.choices.length > 0) {
      console.log("rewrite success");
      return response.choices[0].message.content;
    } else {
      console.error("OpenAI API call failed. Returning empty string.");
      return "";
    }
  } catch (error) {
    console.error("Error in rewriting text with OpenAI:", error);
    return "";
  }
}

async function createNewJsonWithRewrittenFields(inputFilePath, outputFilePath) {
  const rawData = fs.readFileSync(inputFilePath);
  const articles = JSON.parse(rawData);

  const rewrittenArticles = await Promise.all(
    articles.map(async (article) => {
      const heading2 = await rewriteText(article.heading);
      const description2 = await rewriteText(article.description);
      const content2 = await rewriteText(article.content, true);
      const link2 = heading2
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");

      return {
        ...article,
        heading2,
        description2,
        content2,
        link2,
      };
    })
  );

  fs.writeFileSync(outputFilePath, JSON.stringify(rewrittenArticles, null, 2));
  console.log("New JSON file with rewritten fields created successfully.");
}

const inputFilePath = path.join(process.cwd(), "joinccdetails_test.json");
const outputFilePath = path.join(process.cwd(), "joinccdetails2.json");

createNewJsonWithRewrittenFields(inputFilePath, outputFilePath).catch(
  console.error
);
