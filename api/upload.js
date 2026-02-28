export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send("Upload error");
    }

    const file = files.file;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const data = fs.readFileSync(file.filepath);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.originalFilename}`
    );

    res.send(data);
  });
}
