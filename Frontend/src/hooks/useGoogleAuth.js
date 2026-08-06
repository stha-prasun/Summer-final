import { useCallback } from "react";

let gsiPromise = null;

const loadGsiScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gsiPromise = null;
        reject(new Error("Failed to load Google Sign-In"));
      };
      document.body.appendChild(script);
    });
  }
  return gsiPromise;
};

export function useGoogleAuth() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const signInWithGoogle = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!clientId) {
        reject(new Error("Google Client ID is not configured"));
        return;
      }

      const start = () => {
        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          callback: (response) => {
            if (response?.credential) {
              resolve(response.credential);
            } else {
              reject(new Error("Google sign-in failed"));
            }
          },
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error("Google sign-in was cancelled or unavailable"));
          }
        });
      };

      loadGsiScript().then(start).catch(reject);
    });
  }, [clientId]);

  return { signInWithGoogle };
}
