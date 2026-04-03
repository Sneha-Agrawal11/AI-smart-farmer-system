const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin with service account
const serviceAccount = require(path.join(__dirname, "..", "firebase-service-account.json"));

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
