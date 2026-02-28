import formidable from "formidable";
import unzipper from "unzipper";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import os from "os";

export const config = {
  api: {
    bodyParser: false,
  },
};

const REMOVE_FOLDERS = [
  "build",
  ".dart_tool",
  ".gradle",
  ".idea",
  "ios/Pods",
  "app/build",
  ".cxx"
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const form = formidable({ uploadDir: os.tmpdir(), keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Upload error");

    const filePath = files.file.filepath;
    const extractPath = path.join(os.tmpdir(), Date.now().toString());

    fs.mkdirSync(extractPath);

    // extract zip
    await fs.createReadStream(filePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    // remove unwanted folders
    for (let folder of REMOVE_FOLDERS) {
      const fullPath = path.join(extractPath, folder);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      }
    }

    // zip ulang ke memory
    const archive = archiver("zip", { zlib: { level: 9 } });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cleaned_project.zip"
    );

    archive.pipe(res);
    archive.directory(extractPath, false);
    await archive.finalize();
  });
}
