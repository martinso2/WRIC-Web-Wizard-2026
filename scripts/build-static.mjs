import { cp, mkdir, rm } from "node:fs/promises";

const filesToCopy = [
  "index.html",
  "Nonprofit Website Workbook.html",
  "styles.css",
  "src",
  "assets",
  "uploads",
];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const file of filesToCopy) {
  await cp(file, `dist/${file}`, {
    recursive: true,
    force: true,
    errorOnExist: false,
  }).catch((error) => {
    if (error.code !== "ENOENT") {
      throw error;
    }
  });
}
