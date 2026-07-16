import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// 1. Safely resolve the absolute path to serviceAccountKey.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPath = path.join(__dirname, "serviceAccountKey.json");

try {
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

  // 2. Check if Firebase is already initialized using getApps()
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin SDK initialized successfully.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:");
  console.error(error.message);
  process.exit(1);
}

// 3. Export an object containing the auth instance so it matches your controller usage
const admin = {
  auth: () => getAuth()
};

export default admin;