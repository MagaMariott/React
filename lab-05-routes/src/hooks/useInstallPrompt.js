import { useEffect, useState } from "react";

// Captures the browser install prompt so the app can show its own Install button.
export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function onPrompt(event) {
      event.preventDefault();
      setPrompt(event);
    }
    function onInstalled() {
      setPrompt(null);
      setInstalled(true);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) return false;
    prompt.prompt();
    const choice = await prompt.userChoice;
    setPrompt(null);
    return choice.outcome === "accepted";
  }

  return { canInstall: Boolean(prompt) && !installed, install, installed };
}
