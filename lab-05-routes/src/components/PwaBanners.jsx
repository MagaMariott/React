import { applyUpdate, useAppUpdate } from "../hooks/useAppUpdate.js";
import { useConnectivity, useRecheckConnection } from "../hooks/useConnectivity.js";
import { useInstallPrompt } from "../hooks/useInstallPrompt.js";

export default function PwaBanners() {
  const connection = useConnectivity();
  const recheck = useRecheckConnection();
  const update = useAppUpdate();
  const { canInstall, install } = useInstallPrompt();

  return (
    <div className="pwa-banners" aria-live="polite">
      {!connection.online ? (
        <div className="strip strip-offline">
          <p>
            {connection.checking
              ? "Checking the connection…"
              : "You are offline. Signs opened earlier stay available from this device."}
          </p>
          <button type="button" onClick={() => recheck()} disabled={connection.checking}>
            Retry connection
          </button>
        </div>
      ) : null}
      {update.updateReady ? (
        <div className="strip strip-update">
          <p>A newer build of Sign routes is ready.</p>
          <button type="button" className="solid" onClick={applyUpdate}>
            Update
          </button>
        </div>
      ) : null}
      {canInstall ? (
        <div className="strip strip-install">
          <p>Install Sign routes on this device for a standalone window.</p>
          <button type="button" className="solid" onClick={install}>
            Install
          </button>
        </div>
      ) : null}
    </div>
  );
}
