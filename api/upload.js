export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const dummyContent = "File berhasil diproses 🚀";

  res.setHeader("Content-Disposition", "attachment; filename=hasil.txt");
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(dummyContent);
}
