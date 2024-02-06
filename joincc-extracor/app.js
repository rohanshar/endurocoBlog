import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import https from "https";

const sourcePath = join(".", "joincc.json");
const targetDir = join(".", "_posts");
const detailsPath = join(".", "joinccdetails.json");

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getArticleFromURL = async (url, attempts = 3) => {
  console.log("Getting URL:", url);
  while (attempts > 0) {
    try {
      return await new Promise((resolve, reject) => {
        https
          .get(url, { followAllRedirects: true }, (response) => {
            if (response.statusCode !== 200) {
              reject(
                new Error(
                  "Failed to load page, status code: " + response.statusCode
                )
              );
              return;
            }
            let data = "";
            response.on("data", (chunk) => (data += chunk));
            response.on("end", () => {
              try {
                const doc = new JSDOM(data, { url });
                const reader = new Readability(doc.window.document);
                const article = reader.parse();
                resolve(article);
              } catch (error) {
                reject(error);
              }
            });
          })
          .on("error", (e) => {
            reject(e);
          });
      });
    } catch (error) {
      console.log(
        `Attempt ${4 - attempts} failed for URL: ${url}. Error: ${
          error.message
        }`
      );
      if (--attempts > 0) {
        console.log(`Retrying... (${attempts} attempts left)`);
        await delay(1000); // Wait for 1 second before retrying
      }
    }
  }
  throw new Error(`All attempts to fetch URL ${url} failed.`);
};

async function extractContentAndCreateMarkdown() {
  try {
    await mkdir(targetDir, { recursive: true });
    const data = await readFile(sourcePath, { encoding: "utf8" });
    const articles = JSON.parse(data);
    const detailedArticles = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      await delay(1000); // Delay 1 second before each fetch
      const articleData = await getArticleFromURL(article.link);
      if (articleData) {
        const detailedArticle = {
          ...article,
          content: articleData.textContent.trim(),
        };
        detailedArticles.push(detailedArticle);

        const sanitizedHeading = article.heading
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "");
        const fileName = `${sanitizedHeading}.md`;
        const filePath = join(targetDir, fileName);
        const randomPublicationDate = randomDate(
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          new Date()
        ).toISOString();

        const content = `---
title: "${article.heading.replace(/"/g, '\\"')}"
excerpt: >
  ${
    articleData.excerpt
      ? articleData.excerpt.substring(0, 200).replace(/\n/g, "\n  ").trim()
      : ""
  }
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "${randomPublicationDate}"
author:
  name: "Rohan Sharma"
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
---

${articleData.textContent.trim()}`;

        await writeFile(filePath, content);
      }
    }

    await writeFile(detailsPath, JSON.stringify(detailedArticles, null, 2));
    console.log(
      `Successfully created markdown files and detailed JSON for ${detailedArticles.length} articles.`
    );
  } catch (error) {
    console.error("Error in processing:", error);
  }
}

extractContentAndCreateMarkdown();
