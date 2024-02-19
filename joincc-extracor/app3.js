import fs from "fs";
import path from "path";
import { Configuration, OpenAIApi } from "openai";

// Load .env variables
dotenv.config();
// Define file paths and process the articles

const apiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// Function to request image generation from OpenAI
async function generateImage(heading, description) {
  try {
    const response = await openai.createImage({
      prompt: `${heading}: ${description}`,
      n: 1,
      size: "1024x1024",
    });
    return response.data[0].url; // Assuming the API response structure
  } catch (error) {
    console.error("Error in generating image with OpenAI:", error);
    return "";
  }
}

// Read and process the JSON file
async function processArticles() {
  const outputFilePath = path.join(
    process.cwd(),
    "joinccdetails2_with_images.json"
  );

  const inputFilePath = path.join(process.cwd(), "joinccdetails2_test.json");

  const rawData = fs.readFileSync(inputFilePath);
  const articles = JSON.parse(rawData);

  for (const article of articles) {
    // Generate image for each article based on heading2 and description2
    const imageUrl = await generateImage(
      article.heading2,
      article.description2
    );
    // Add the generated image URL to the article object
    article.generatedImageUrl = imageUrl;
  }

  // Write the updated articles with image URLs back to a new JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(articles, null, 2));
  console.log("JSON file with generated image URLs created successfully.");
}
processArticles().catch(console.error);
