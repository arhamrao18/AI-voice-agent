/**
 * Lightweight form validators. No external dependency needed for the
 * simple login/profile forms in this project.
 */

export function isValidEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidPassword(value, minLength = 6) {
  return typeof value === "string" && value.length >= minLength;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isValidPassword(password)) errors.password = "Password must be at least 6 characters.";
  return errors;
}
