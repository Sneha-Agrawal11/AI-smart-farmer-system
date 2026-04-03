import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDVLQdhDUEvzEIgJZn-kuvztkm-kSptmU",
  authDomain: "smart-farmer-system.firebaseapp.com",
  projectId: "smart-farmer-system",
  storageBucket: "smart-farmer-system.firebasestorage.app",
  messagingSenderId: "600043261407",
  appId: "1:600043261407:web:a2b8737d6802a14e31c86a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Store confirmation result globally for OTP verification
let confirmationResult: ConfirmationResult | null = null;

/**
 * Sets up the invisible reCAPTCHA verifier on the given button element.
 * Must be called before sendOTP.
 */
export function setupRecaptcha(buttonId: string): RecaptchaVerifier {
  const verifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved — allow signInWithPhoneNumber
    },
    "expired-callback": () => {
      console.warn("reCAPTCHA expired. Please try again.");
    },
  });
  return verifier;
}

/**
 * Sends OTP to the given phone number using Firebase Phone Auth.
 * @param phoneNumber Full phone number with country code, e.g. "+919876543210"
 * @param recaptchaVerifier The RecaptchaVerifier instance
 */
export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<void> {
  const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  confirmationResult = result;
}

/**
 * Verifies the OTP entered by the user.
 * @param otp The 6-digit OTP string
 * @returns Firebase ID token string to send to the backend
 */
export async function verifyOTP(otp: string): Promise<string> {
  if (!confirmationResult) {
    throw new Error("OTP was not sent. Please request a new OTP.");
  }
  const userCredential = await confirmationResult.confirm(otp);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
}
