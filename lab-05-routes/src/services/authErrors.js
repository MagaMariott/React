const known = {
  "auth/invalid-email": "That email address is not valid.",
  "auth/missing-password": "Password is required.",
  "auth/invalid-credential": "Email or password is wrong.",
  "auth/user-disabled": "This account is disabled.",
  "auth/email-already-in-use": "An account with that email already exists.",
  "auth/weak-password": "Use at least 6 characters.",
  "auth/popup-closed-by-user": "The Google window was closed before sign-in finished.",
  "auth/cancelled-popup-request": "Google sign-in was cancelled.",
  "auth/unauthorized-domain": "This site is not an authorized domain in Firebase yet.",
  "auth/network-request-failed": "The network request failed.",
  "auth/missing-config": "Firebase is not configured. Copy .env.example to .env.local and add the web app keys.",
};

export function authErrorMessage(error) {
  if (!error) return "Something went wrong.";
  return known[error.code] || error.message || "Something went wrong.";
}
