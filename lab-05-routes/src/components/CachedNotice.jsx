export default function CachedNotice({ cachedAt, offline = false }) {
  if (!cachedAt && !offline) return null;
  if (cachedAt) {
    const when = new Date(cachedAt).toLocaleString();
    return (
      <p className="cache-note" role="status">
        Showing a saved copy from {when}. A fresh answer is used when the network answers.
      </p>
    );
  }
  return (
    <p className="cache-note" role="status">
      You are offline. This screen is served from what was saved on this device.
    </p>
  );
}
