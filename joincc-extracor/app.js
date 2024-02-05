import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const sourcePath = join("..", "joincc.json");
const targetDir = join("..", "_posts");

async function createMarkdownFiles() {
  try {
    const data = await readFile(sourcePath, { encoding: "utf8" });
    const articles = JSON.parse(data);

    for (const article of articles) {
      const fileName = `${article.heading.replace(/\s+/g, "-")}.md`;
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
