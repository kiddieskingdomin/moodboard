import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './db.js';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  await connectMongo(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Server failed:', err);
  process.exit(1);
});
