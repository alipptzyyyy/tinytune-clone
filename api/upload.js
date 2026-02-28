export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.status(200).json({ message: "Backend ready 🚀" });
}
