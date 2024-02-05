import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const sourcePath = join(".", "joincc.json");
const targetDir = join("..", "_posts");

// Function to generate a random date between two dates
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function createMarkdownFiles() {
  try {
    // Ensure the target directory exists
    await mkdir(targetDir, { recursive: true });

    const data = await readFile(sourcePath, { encoding: "utf8" });
    const articles = JSON.parse(data);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    for (const article of articles) {
      const sanitizedHeading = article.heading
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");
      const fileName = `${sanitizedHeading}.md`;
      const filePath = join(targetDir, fileName);
      const randomPublicationDate = randomDate(
        threeMonthsAgo,
        new Date()
      ).toISOString();

      const content = `---
title: "${article.heading.replace(/"/g, '\\"')}"
excerpt: >
  ${article.description.substring(0, 200).replace(/\n/g, "\n  ").trim()}
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "${randomPublicationDate}"
author:
  name: "Rohan Sharma"
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
---

${article.description.trim()}`;

      await writeFile(filePath, content);
    }

    console.log(`Successfully created ${articles.length} markdown files.`);
  } catch (error) {
    console.error("Error creating markdown files:", error);
  }
}

createMarkdownFiles();
