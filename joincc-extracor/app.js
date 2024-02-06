import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const sourcePath = join(".", "joinccdetails.json"); // Ensure this path is correct
const targetDir = join("..", "_posts"); // Adjusted to be within the current directory for demonstration

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function formatContent(content) {
  // Simple example of formatting: Add markdown paragraph breaks, replace certain patterns with markdown headings, etc.
  // This is a basic implementation. You may need to adjust it based on your actual content structure.
  return content
    .trim()
    .replace(/\n\t\n\t\n\t\t\n\t\t\t/g, "\n\n## ") // Example: Convert a specific pattern to subheading
    .replace(/\n/g, "\n\n"); // Ensure paragraphs are separated by blank lines in markdown
}

async function createMarkdownFiles() {
  try {
    await mkdir(targetDir, { recursive: true });
    const data = await readFile(sourcePath, { encoding: "utf8" });
    const articles = JSON.parse(data);

    for (const article of articles) {
      const sanitizedHeading = article.heading
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");
      const fileName = `${sanitizedHeading}.md`;
      const filePath = join(targetDir, fileName);
      const randomPublicationDate = randomDate(
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        new Date()
      ).toISOString();

      const formattedContent = formatContent(article.content);

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

${formattedContent}`; // Using formatted content

      await writeFile(filePath, content);
    }

    console.log(
      `Successfully created ${articles.length} markdown files with formatted content.`
    );
  } catch (error) {
    console.error("Error creating markdown files:", error);
  }
}

createMarkdownFiles();
