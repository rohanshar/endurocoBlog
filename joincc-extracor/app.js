import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const sourcePath = join("..", "joincc.json");
const targetDir = join("..", "_posts");

async function createMarkdownFiles() {
  try {
    // Ensure the target directory exists
    await mkdir(targetDir, { recursive: true });

    const data = await readFile(sourcePath, { encoding: "utf8" });
    const articles = JSON.parse(data);

    for (const article of articles) {
      const fileName = `${article.heading
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")}.md`; // Also sanitize the file name
      const filePath = join(targetDir, fileName);
      const content = `---
title: "${article.heading}"
excerpt: "${article.description.substring(0, 200)}"
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "${new Date().toISOString()}"
author:
  name: "JJ Kasper"
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
---

${article.description}`;

      await writeFile(filePath, content);
    }

    console.log(`Successfully created ${articles.length} markdown files.`);
  } catch (error) {
    console.error("Error creating markdown files:", error);
  }
}

createMarkdownFiles();
