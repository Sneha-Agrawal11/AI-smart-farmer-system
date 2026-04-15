// Mock Firebase implementation - Firebase disabled for now
// Phone authentication will be handled by the backend

let confirmationResult: any = null;

/**
 * Sets up reCAPTCHA verifier (mock - not used)
 */
export function setupRecaptcha(buttonId: string): any {
  return { mock: true };
}

/**
 * Sends OTP to phone number via backend
 * @param phoneNumber Full phone number with country code, e.g. "+919876543210"
 * @param recaptchaVerifier Not used (mock)
 */
export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier?: any
): Promise<void> {
  // Store phone number for verification
  confirmationResult = { phoneNumber };
  console.log("OTP request sent for", phoneNumber);
}

/**
 * Verifies OTP via backend
 * @param otp The OTP entered by user
 * @returns Mock token (actual auth via backend)
 */
export async function verifyOTP(otp: string): Promise<string> {
  if (!confirmationResult) {
    throw new Error("OTP was not sent. Please request a new OTP.");
  }
  // Return a token - actual verification done by backend
  return `mock-token-${Date.now()}`;
}
