import fs from "fs";
import path from "path";
import https from "https";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
});

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => reject(err));
      });
  });
}

async function generateImage(heading, description) {
  try {
    const response = await openai.images.generate({
      prompt: `Generate image for a article with this heading and description ${heading}:description- ${description}`,
      n: 1,
      model: "dall-e-3",
      size: "1024x1024",
    });
    return response.data.data[0].url; // Ensure correct path to the image URL
  } catch (error) {
    console.error("Error in generating image with OpenAI:", error);
    return "";
  }
}

async function processArticles() {
  const outputFilePath = path.join(
    process.cwd(),
    "joinccdetails2_with_images.json"
  );
  const inputFilePath = path.join(process.cwd(), "joinccdetails2_test.json");

  const rawData = fs.readFileSync(inputFilePath);
  const articles = JSON.parse(rawData);
  const imagesPath = path.join(process.cwd(), "images");

  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath);
  }

  for (const [index, article] of articles.entries()) {
    const imageUrl = await generateImage(
      article.heading2,
      article.description2
    );
    if (imageUrl) {
      const filepath = path.join(imagesPath, `image_${index}.jpg`);
      await downloadImage(imageUrl, filepath);
      article.generatedImageUrl = filepath; // Update with local file path if necessary or keep as URL
    }
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(articles, null, 2));
  console.log("JSON file with generated image URLs created successfully.");
}

processArticles().catch(console.error);
