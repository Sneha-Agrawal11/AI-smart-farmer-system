const admin = require("firebase-admin");

// Initialize Firebase Admin with service account
// Load from environment variable (for deployment) or from file (for local development)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // For production (Render): credentials from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // For local development: load from file
  const path = require("path");
  serviceAccount = require(path.join(__dirname, "..", "firebase-service-account.json"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Verifies a Firebase ID token and returns the decoded token.
 * @param {string} idToken - The Firebase ID token from the client
 * @returns {Promise<admin.auth.DecodedIdToken>} Decoded token with phone_number etc.
 */
async function verifyFirebaseToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
}

module.exports = { verifyFirebaseToken };
