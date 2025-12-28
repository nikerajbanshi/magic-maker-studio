import React, { useEffect, useState } from "react";
import LottiePlayer from "../components/LottiePlayer";
import { getProgress, updateProgress } from "../services/progressAPI";

export default function Game() {
  const [lotties, setLotties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/games/lottie")
      .then((r) => r.json())
      .then((list) => setLotties(list))
      .catch(() => setLotties([]));
  }, []);

  const userId = localStorage.getItem("user") || "guest";

  async function sendSampleScore(correct, total = 1) {
    const payload = {
      game: "hungry_monster",
      score: correct,
      total,
      details: { note: "sample update from UI" },
      mastery_delta: { "hungry_monster": Math.min(1, correct / Math.max(1, total)) },
    };
    try {
      await updateProgress(userId, payload);
      setMessage("Progress saved ✔️");
    } catch (e) {
      setMessage("Failed to save progress");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hungry Monster Game</h1>
      <p>Choose a friendly monster animation (place Lottie JSON files in backend/static/lottie/)</p>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <select value={selected || ""} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Choose animation…</option>
          {lotties.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <button onClick={() => sendSampleScore(1, 1)}>Record correct (sample)</button>
        <button onClick={() => sendSampleScore(0, 1)}>Record wrong (sample)</button>

        <div style={{ color: message.includes("Failed") ? "#c00" : "#080" }}>{message}</div>
      </div>

      <div style={{ marginTop: "1.5rem", width: 320, height: 320 }}>
        {selected ? (
          <LottiePlayer src={`/static/lottie/${selected}`} loop style={{ width: 320, height: 320 }} />
        ) : (
          <div style={{ padding: "2rem" }}>No animation selected.</div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Your progress</h3>
        <button
          onClick={async () => {
            try {
              const p = await getProgress(userId);
              alert(JSON.stringify(p, null, 2));
            } catch (e) {
              alert("Could not fetch progress");
            }
          }}
        >
          Load progress for {userId}
        </button>
      </div>
    </div>
  );
}