const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing VITE_GOOGLE_CLIENT_ID in .env");
}

if (!REDIRECT_URI) {
  throw new Error("Missing VITE_GOOGLE_REDIRECT_URI in .env");
}

const GOOGLE_OAUTH_SCOPES = ["profile", "email"];
const OAUTH_STATE_KEY = "oauth_state";

export const useGoogleOAuth = () => {
  const initiateGoogleOAuth = () => {
    const state = crypto.randomUUID();
    const scope = GOOGLE_OAUTH_SCOPES.join(" ");

    try {
      localStorage.setItem(OAUTH_STATE_KEY, state);
    } catch (error) {
      console.error("Failed to store OAuth state:", error);
      throw new Error("Unable to initiate authentication", { cause: error });
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope,
      state,
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    window.location.href = authUrl;
  };

  return {
    initiateGoogleOAuth,
  };
};
