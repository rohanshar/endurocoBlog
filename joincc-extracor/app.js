import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const sourcePath = join(".", "joinccdetails2.json"); // Ensure this path is correct
const targetDir = join("..", "_posts"); // Adjusted to be within the current directory for demonstration

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function formatContent(content, maxWordsForHeader = 10) {
  // Split the content into lines.
  const lines = content.split("\n");

  // Transform each line based on the criteria.
  const formattedLines = lines.map((line) => {
    // Trim whitespace from the line.
    const trimmedLine = line.trim();

    // Count the words in the line.
    const wordCount = trimmedLine.split(/\s+/).length;

    // Determine if the line should be treated as a header.
    // A line is considered a potential header if it has fewer words than the specified limit.
    // Headers may or may not end with a full stop.
    const isHeader = wordCount <= maxWordsForHeader;

    if (isHeader) {
      // Format the line as a header (Markdown style) if it meets the criteria.
      // Using "##" for subheaders; adjust as necessary based on your content structure.
      return `## ${trimmedLine}`;
    } else {
      // For regular paragraphs, ensure they're separated by blank lines for proper Markdown formatting.
      return trimmedLine.length > 0 ? `${trimmedLine}\n` : "";
    }
  });

  // Join the transformed lines back into a single string, separating paragraphs/headers with double newlines.
  return formattedLines.join("\n\n");
}

async function createMarkdownFiles() {
  try {
    await mkdir(targetDir, { recursive: true });
    const data = await readFile(sourcePath, { encoding: "utf8" });
    const articles = JSON.parse(data);

    for (const article of articles) {
      const sanitizedHeading = article.heading2
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");
      const fileName = `${sanitizedHeading}.md`;
      const filePath = join(targetDir, fileName);
      const randomPublicationDate = randomDate(
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        new Date()
      ).toISOString();

      // const formattedContent = formatContent(article.content2);
      const formattedContent = article.content2;

      const content = `---
title: "${article.heading2.replace(/"/g, '\\"')}"
excerpt: >
  ${article.description2.substring(0, 200).replace(/\n/g, "\n  ").trim()}
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
