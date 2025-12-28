const BASE = "/api/progress";

export async function getProgress(userId) {
  const res = await fetch(`${BASE}/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function updateProgress(userId, payload) {
  const res = await fetch(`${BASE}/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save progress");
  return res.json();
}
