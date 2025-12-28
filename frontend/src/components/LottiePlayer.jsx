import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function LottiePlayer({ src, loop = true, style = {}, autoplay = true }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let mounted = true;
    if (!src) return;
    fetch(src)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch((e) => {
        console.warn("Failed to load lottie:", src, e);
      });
    return () => (mounted = false);
  }, [src]);

  if (!src) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {data ? (
        <Lottie animationData={data} loop={loop} style={style} />
      ) : (
        <div>Loading animation…</div>
      )}
    </div>
  );
}
